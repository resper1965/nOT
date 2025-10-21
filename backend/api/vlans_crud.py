"""
APIs CRUD para gerenciamento de VLANs com recálculo automático de regras

Endpoints:
- GET    /api/vlans/{vlan_id}      - Buscar VLAN
- PUT    /api/vlans/{vlan_id}      - Atualizar VLAN (+ recalc rules)
- POST   /api/vlans/assign-zone    - Atribuir VLAN a zona Purdue
- POST   /api/vlans/generate-rules - Gerar regras de firewall

Autor: BMAD™ Core
Data: 21/10/2025
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor

router = APIRouter(prefix="/api/vlans", tags=["VLANs CRUD"])

class VLANUpdate(BaseModel):
    vlan_name: Optional[str] = None
    description: Optional[str] = None
    criticality: Optional[str] = Field(None, pattern="^(critical|high|medium|low)$")
    zone_id: Optional[int] = None

class ZoneAssignment(BaseModel):
    vlan_ids: List[int]
    zone_id: int
    reason: Optional[str] = None

class FirewallRule(BaseModel):
    source_zone: str
    dest_zone: str
    action: str  # allow/deny
    protocol: str
    port: Optional[str]
    reason: str

def get_db():
    conn = psycopg2.connect(
        host="postgres",
        port=5432,
        database="ness_ot_grc",
        user="ness_admin",
        password="ness_secure_pass_2025"
    )
    try:
        yield conn
    finally:
        conn.close()

class FirewallRuleEngine:
    """
    Motor de regras de firewall baseado em Modelo Purdue
    Gera automaticamente regras ao mudar zonas/criticidade
    """
    
    @staticmethod
    def generate_zone_rules(source_zone: dict, dest_zone: dict) -> List[FirewallRule]:
        """Gera regras de firewall entre duas zonas"""
        rules = []
        
        source_level = source_zone.get('security_level', 999)
        dest_level = dest_zone.get('security_level', 999)
        source_name = source_zone['zone_name']
        dest_name = dest_zone['zone_name']
        
        # Regra 1: Menor privilégio (default deny)
        rules.append(FirewallRule(
            source_zone=source_name,
            dest_zone=dest_name,
            action="deny",
            protocol="*",
            port="*",
            reason="Default Deny - Princípio de menor privilégio"
        ))
        
        # Regra 2: IT → OT (muito restrito)
        if 'Enterprise' in source_name and 'SCADA' in dest_name:
            rules.append(FirewallRule(
                source_zone=source_name,
                dest_zone="DMZ",
                action="allow",
                protocol="HTTPS",
                port="443",
                reason="Enterprise pode acessar DMZ via HTTPS"
            ))
            rules.append(FirewallRule(
                source_zone="DMZ",
                dest_zone=dest_name,
                action="allow",
                protocol="OPC-UA",
                port="4840",
                reason="DMZ pode ler SCADA via OPC-UA"
            ))
        
        # Regra 3: SCADA ↔ Control (permitido com logging)
        if 'SCADA' in source_name and 'Control' in dest_name:
            for protocol, port in [('Modbus-TCP', '502'), ('DNP3', '20000'), ('IEC-104', '2404')]:
                rules.append(FirewallRule(
                    source_zone=source_name,
                    dest_zone=dest_name,
                    action="allow",
                    protocol=protocol,
                    port=port,
                    reason=f"SCADA pode controlar PLCs via {protocol}"
                ))
        
        # Regra 4: Control → Field Devices (permitido)
        if 'Control' in source_name and 'Basic' in dest_name:
            rules.append(FirewallRule(
                source_zone=source_name,
                dest_zone=dest_name,
                action="allow",
                protocol="Modbus-RTU/TCP",
                port="502",
                reason="PLCs podem ler sensores"
            ))
        
        # Regra 5: OT → IT (negado exceto logs)
        if source_level > 3 and dest_level <= 2:  # OT → IT
            rules.append(FirewallRule(
                source_zone=source_name,
                dest_zone=dest_name,
                action="deny",
                protocol="*",
                port="*",
                reason="OT não pode iniciar conexões para IT (isolamento)"
            ))
            rules.append(FirewallRule(
                source_zone=source_name,
                dest_zone="Syslog Server",
                action="allow",
                protocol="Syslog",
                port="514",
                reason="Logs OT podem ir para SIEM"
            ))
        
        return rules
    
    @staticmethod
    def recalculate_all_rules(conn) -> List[FirewallRule]:
        """Recalcula todas as regras de firewall"""
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT 
                id, zone_name, purdue_level, 
                criticality, security_level
            FROM topology.network_zones
            ORDER BY security_level DESC
        """)
        
        zones = cursor.fetchall()
        all_rules = []
        
        # Gera regras para cada par de zonas
        for i, source in enumerate(zones):
            for dest in zones[i+1:]:
                rules = FirewallRuleEngine.generate_zone_rules(
                    dict(source), 
                    dict(dest)
                )
                all_rules.extend(rules)
        
        cursor.close()
        return all_rules

@router.get("/{vlan_id}")
def get_vlan(vlan_id: int, conn = Depends(get_db)):
    """Busca uma VLAN por ID"""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT 
            v.*,
            z.zone_name,
            z.purdue_level,
            z.security_level
        FROM topology.vlans v
        LEFT JOIN topology.network_zones z ON v.zone_id = z.id
        WHERE v.vlan_id = %s
    """, (vlan_id,))
    
    vlan = cursor.fetchone()
    cursor.close()
    
    if not vlan:
        raise HTTPException(status_code=404, detail="VLAN não encontrada")
    
    return dict(vlan)

@router.put("/{vlan_id}")
def update_vlan(vlan_id: int, updates: VLANUpdate, conn = Depends(get_db)):
    """
    Atualiza uma VLAN e recalcula regras de firewall se necessário
    """
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Busca dados atuais
    cursor.execute("""
        SELECT vlan_id, zone_id, criticality 
        FROM topology.vlans 
        WHERE vlan_id = %s
    """, (vlan_id,))
    
    old_data = cursor.fetchone()
    if not old_data:
        raise HTTPException(status_code=404, detail="VLAN não encontrada")
    
    # Prepara update
    update_fields = []
    update_values = []
    
    for field, value in updates.dict(exclude_none=True).items():
        if value is not None:
            update_fields.append(f"{field} = %s")
            update_values.append(value)
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="Nenhuma atualização fornecida")
    
    update_fields.append("updated_at = CURRENT_TIMESTAMP")
    
    query = f"""
        UPDATE topology.vlans 
        SET {', '.join(update_fields)}
        WHERE vlan_id = %s
        RETURNING *
    """
    update_values.append(vlan_id)
    
    cursor.execute(query, update_values)
    updated_vlan = cursor.fetchone()
    conn.commit()
    
    # Verifica se mudou zona ou criticidade (requer recálculo de regras)
    rules_changed = False
    affected_rules = []
    
    if (updates.zone_id and updates.zone_id != old_data['zone_id']) or \
       (updates.criticality and updates.criticality != old_data['criticality']):
        rules_changed = True
        
        # Recalcula regras
        all_rules = FirewallRuleEngine.recalculate_all_rules(conn)
        affected_rules = [r.dict() for r in all_rules if str(vlan_id) in str(r.source_zone) or str(vlan_id) in str(r.dest_zone)]
    
    cursor.close()
    
    return {
        "success": True,
        "vlan": dict(updated_vlan),
        "rules_changed": rules_changed,
        "affected_rules": affected_rules[:5],  # Top 5 regras afetadas
        "message": "VLAN atualizada" + (" e regras recalculadas" if rules_changed else "")
    }

@router.post("/assign-zone")
def assign_zone(assignment: ZoneAssignment, conn = Depends(get_db)):
    """
    Atribui múltiplas VLANs a uma zona Purdue
    Recalcula automaticamente regras de firewall
    """
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Verifica se zona existe
    cursor.execute("""
        SELECT id, zone_name, purdue_level, criticality, security_level
        FROM topology.network_zones
        WHERE id = %s
    """, (assignment.zone_id,))
    
    zone = cursor.fetchone()
    if not zone:
        raise HTTPException(status_code=404, detail="Zona não encontrada")
    
    # Atualiza VLANs
    updated_count = 0
    for vlan_id in assignment.vlan_ids:
        cursor.execute("""
            UPDATE topology.vlans
            SET 
                zone_id = %s,
                purdue_level = %s,
                criticality = %s,
                security_level = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE vlan_id = %s
        """, (
            assignment.zone_id,
            zone['purdue_level'],
            zone['criticality'],
            zone['security_level'],
            vlan_id
        ))
        updated_count += cursor.rowcount
    
    conn.commit()
    
    # Recalcula regras
    all_rules = FirewallRuleEngine.recalculate_all_rules(conn)
    
    cursor.close()
    
    return {
        "success": True,
        "zone": dict(zone),
        "vlans_updated": updated_count,
        "total_rules_generated": len(all_rules),
        "message": f"{updated_count} VLANs atribuídas à zona {zone['zone_name']}"
    }

@router.post("/generate-rules")
def generate_firewall_rules(conn = Depends(get_db)):
    """
    Gera todas as regras de firewall baseadas nas zonas Purdue atuais
    """
    all_rules = FirewallRuleEngine.recalculate_all_rules(conn)
    
    # Agrupa por tipo
    rules_by_type = {
        "deny": [],
        "allow": []
    }
    
    for rule in all_rules:
        rules_by_type[rule.action].append(rule.dict())
    
    return {
        "success": True,
        "total_rules": len(all_rules),
        "deny_rules": len(rules_by_type["deny"]),
        "allow_rules": len(rules_by_type["allow"]),
        "rules": {
            "deny": rules_by_type["deny"][:10],  # Top 10
            "allow": rules_by_type["allow"][:10]  # Top 10
        },
        "message": f"Geradas {len(all_rules)} regras de firewall baseadas em Modelo Purdue"
    }

