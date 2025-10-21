"""
APIs CRUD para gerenciamento de Assets com reclassificação automática

Endpoints:
- GET    /api/assets/{id}       - Buscar asset
- PUT    /api/assets/{id}       - Atualizar asset (+ IA reclassification)
- DELETE /api/assets/{id}       - Deletar asset
- POST   /api/assets/bulk-edit  - Edição em lote

Autor: BMAD™ Core
Data: 21/10/2025
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import json

router = APIRouter(prefix="/api/assets", tags=["Assets CRUD"])

# Models
class AssetUpdate(BaseModel):
    asset_name: Optional[str] = None
    asset_type: Optional[str] = None
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None
    location: Optional[str] = None
    criticality: Optional[str] = Field(None, pattern="^(critical|high|medium|low)$")
    status: Optional[str] = None
    metadata: Optional[dict] = None

class AssetResponse(BaseModel):
    id: str
    asset_name: str
    asset_type: str
    ip_address: Optional[str]
    location: Optional[str]
    criticality: str
    status: str
    metadata: Optional[dict]
    created_at: datetime
    updated_at: datetime
    ai_classification: Optional[dict] = None

class BulkEditRequest(BaseModel):
    asset_ids: List[str]
    updates: AssetUpdate

class ReclassificationResult(BaseModel):
    asset_id: str
    old_criticality: str
    new_criticality: str
    reason: str
    confidence: float
    rules_affected: List[str]

# Database connection
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

# AI Reclassification Engine
class AIReclassifier:
    """
    Agente IA para reclassificação automática baseada em contexto OT/ICS
    """
    
    @staticmethod
    def should_reclassify(old_data: dict, new_data: dict) -> bool:
        """Determina se mudança requer reclassificação"""
        critical_fields = ['asset_type', 'asset_name', 'location', 'metadata']
        return any(old_data.get(f) != new_data.get(f) for f in critical_fields if f in new_data)
    
    @staticmethod
    def analyze_asset(asset_data: dict) -> dict:
        """
        Analisa asset e retorna classificação recomendada
        
        Regras baseadas em IEC 62443 e Modelo Purdue:
        - CRITICAL: SCADA, HMI, Safety Systems, Controllers críticos
        - HIGH: Routers, Firewalls, Core Switches, Database Servers
        - MEDIUM: Access Switches, Application Servers, Workstations
        - LOW: Endpoints, IoT, Printers, Cameras
        """
        
        asset_type = asset_data.get('asset_type', '').lower()
        asset_name = asset_data.get('asset_name', '').lower()
        location = asset_data.get('location', '').lower()
        metadata = asset_data.get('metadata', {})
        
        # Scoring system
        score = 0
        reasons = []
        
        # Type-based scoring
        if asset_type in ['firewall', 'router']:
            score += 80
            reasons.append(f"Tipo {asset_type} é infraestrutura crítica")
        elif asset_type == 'server':
            score += 60
            reasons.append("Servidor requer análise de função")
        elif asset_type == 'switch':
            score += 50
            reasons.append("Switch requer análise de função (core vs access)")
        elif asset_type in ['hub', 'modem']:
            score += 30
            reasons.append("Dispositivo de comunicação")
        else:
            score += 10
            reasons.append("Dispositivo genérico ou endpoint")
        
        # Name-based scoring (keywords críticas)
        critical_keywords = {
            'scada': 90, 'hmi': 90, 'safety': 95, 'plc': 85,
            'rtu': 85, 'historian': 80, 'controller': 75,
            'core': 70, 'backbone': 70, 'distribution': 65,
            'database': 70, 'db': 70, 'sql': 65,
            'critical': 80, 'production': 60, 'operational': 55
        }
        
        for keyword, keyword_score in critical_keywords.items():
            if keyword in asset_name:
                score += keyword_score
                reasons.append(f"Nome contém '{keyword}' (criticidade elevada)")
                break
        
        # Location-based scoring
        critical_locations = {
            'datacenter': 40, 'data center': 40, 'control room': 50,
            'scada room': 60, 'operational': 45, 'production': 40
        }
        
        for loc_keyword, loc_score in critical_locations.items():
            if loc_keyword in location:
                score += loc_score
                reasons.append(f"Localização '{loc_keyword}' é área crítica")
                break
        
        # Metadata-based scoring
        if metadata:
            function = metadata.get('function', '').lower()
            if function in ['scada', 'safety', 'control', 'core']:
                score += 60
                reasons.append(f"Função '{function}' é crítica")
            
            purdue_level = metadata.get('purdue_level', '')
            if purdue_level in ['Level 2', 'Level 3']:
                score += 50
                reasons.append(f"Purdue {purdue_level} é zona OT crítica")
        
        # Determine criticality
        if score >= 150:
            criticality = 'critical'
            confidence = min(0.95, score / 180)
        elif score >= 100:
            criticality = 'high'
            confidence = min(0.90, score / 130)
        elif score >= 50:
            criticality = 'medium'
            confidence = min(0.85, score / 80)
        else:
            criticality = 'low'
            confidence = min(0.80, score / 50)
        
        return {
            'criticality': criticality,
            'confidence': round(confidence, 2),
            'score': score,
            'reasons': reasons[:3]  # Top 3 reasons
        }
    
    @staticmethod
    def get_affected_rules(asset_data: dict, old_criticality: str, new_criticality: str) -> List[str]:
        """Identifica regras de rede afetadas pela mudança"""
        affected = []
        
        if old_criticality != new_criticality:
            affected.append(f"Prioridade de monitoramento: {old_criticality.upper()} → {new_criticality.upper()}")
            affected.append(f"ACLs de firewall: revisar regras para criticidade {new_criticality}")
        
        if new_criticality in ['critical', 'high']:
            affected.append("IDS/IPS: aumentar sensibilidade de detecção")
            affected.append("Backup: incluir em backup crítico (RTO < 4h)")
            affected.append("Alertas: notificação em tempo real para anomalias")
        
        if new_criticality == 'critical':
            affected.append("Segmentação: isolar em VLAN dedicada")
            affected.append("Acesso: MFA obrigatório para administração")
            affected.append("Auditoria: logging completo de todas ações")
        
        return affected

# Endpoints
@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: str, conn = Depends(get_db)):
    """Busca um asset por ID"""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT 
            id::text,
            asset_name,
            asset_type,
            ip_address::text,
            mac_address::text,
            location,
            criticality,
            status,
            metadata,
            created_at,
            updated_at
        FROM security.assets
        WHERE id = %s
    """, (asset_id,))
    
    asset = cursor.fetchone()
    cursor.close()
    
    if not asset:
        raise HTTPException(status_code=404, detail="Asset não encontrado")
    
    return asset

@router.put("/{asset_id}", response_model=dict)
def update_asset(asset_id: str, updates: AssetUpdate, conn = Depends(get_db)):
    """
    Atualiza um asset com reclassificação automática por IA
    """
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Busca dados atuais
    cursor.execute("""
        SELECT 
            asset_name, asset_type, ip_address::text, location, 
            criticality, status, metadata
        FROM security.assets
        WHERE id = %s
    """, (asset_id,))
    
    old_data = cursor.fetchone()
    if not old_data:
        raise HTTPException(status_code=404, detail="Asset não encontrado")
    
    # Prepara novos dados
    update_fields = []
    update_values = []
    new_data = dict(old_data)
    
    for field, value in updates.dict(exclude_none=True).items():
        if value is not None:
            update_fields.append(f"{field} = %s")
            update_values.append(value if field != 'metadata' else json.dumps(value))
            new_data[field] = value
    
    # Verifica se precisa reclassificar
    ai_result = None
    if AIReclassifier.should_reclassify(old_data, new_data):
        ai_result = AIReclassifier.analyze_asset(new_data)
        
        # Se IA sugere mudança de criticidade E confiança > 70%
        if (ai_result['confidence'] >= 0.70 and 
            ai_result['criticality'] != new_data.get('criticality', old_data['criticality'])):
            
            update_fields.append("criticality = %s")
            update_values.append(ai_result['criticality'])
            new_data['criticality'] = ai_result['criticality']
            
            # Adiciona metadata da IA
            metadata = new_data.get('metadata', {}) or {}
            metadata['ai_reclassified'] = True
            metadata['ai_confidence'] = ai_result['confidence']
            metadata['ai_reasons'] = ai_result['reasons']
            metadata['ai_timestamp'] = datetime.now().isoformat()
            
            if 'metadata = %s' in update_fields:
                idx = update_fields.index('metadata = %s')
                update_values[idx] = json.dumps(metadata)
            else:
                update_fields.append('metadata = %s')
                update_values.append(json.dumps(metadata))
    
    # Adiciona updated_at
    update_fields.append("updated_at = CURRENT_TIMESTAMP")
    
    # Executa update
    query = f"""
        UPDATE security.assets 
        SET {', '.join(update_fields)}
        WHERE id = %s
        RETURNING *
    """
    update_values.append(asset_id)
    
    cursor.execute(query, update_values)
    updated_asset = cursor.fetchone()
    conn.commit()
    
    # Identifica regras afetadas
    affected_rules = []
    if ai_result and ai_result['criticality'] != old_data['criticality']:
        affected_rules = AIReclassifier.get_affected_rules(
            new_data, 
            old_data['criticality'], 
            ai_result['criticality']
        )
    
    cursor.close()
    
    return {
        "success": True,
        "asset": dict(updated_asset),
        "ai_reclassification": ai_result,
        "affected_rules": affected_rules,
        "message": "Asset atualizado com sucesso" + (
            f" e reclassificado para {ai_result['criticality'].upper()}" 
            if ai_result and ai_result['criticality'] != old_data['criticality']
            else ""
        )
    }

@router.delete("/{asset_id}")
def delete_asset(asset_id: str, conn = Depends(get_db)):
    """Deleta um asset (soft delete)"""
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE security.assets 
        SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING id
    """, (asset_id,))
    
    result = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="Asset não encontrado")
    
    return {"success": True, "message": "Asset deletado com sucesso"}

@router.post("/bulk-edit", response_model=dict)
def bulk_edit_assets(request: BulkEditRequest, conn = Depends(get_db)):
    """
    Edição em lote de múltiplos assets com reclassificação automática
    """
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    results = {
        "total": len(request.asset_ids),
        "updated": 0,
        "reclassified": 0,
        "errors": [],
        "affected_rules": set()
    }
    
    for asset_id in request.asset_ids:
        try:
            # Reutiliza lógica de update
            result = update_asset(asset_id, request.updates, conn)
            results["updated"] += 1
            
            if result.get("ai_reclassification"):
                results["reclassified"] += 1
            
            if result.get("affected_rules"):
                results["affected_rules"].update(result["affected_rules"])
        
        except Exception as e:
            results["errors"].append({
                "asset_id": asset_id,
                "error": str(e)
            })
    
    cursor.close()
    
    return {
        "success": True,
        "results": {
            **results,
            "affected_rules": list(results["affected_rules"])
        }
    }

@router.post("/reclassify-all")
def reclassify_all_assets(conn = Depends(get_db)):
    """
    Reclassifica todos os assets usando IA
    Útil após mudanças nas regras de negócio
    """
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT 
            id::text, asset_name, asset_type, 
            location, criticality, metadata
        FROM security.assets
        WHERE status = 'active'
    """)
    
    assets = cursor.fetchall()
    
    stats = {
        "total": len(assets),
        "reclassified": 0,
        "unchanged": 0,
        "critical_new": 0,
        "high_new": 0,
        "medium_new": 0,
        "low_new": 0
    }
    
    for asset in assets:
        ai_result = AIReclassifier.analyze_asset(dict(asset))
        
        if ai_result['criticality'] != asset['criticality'] and ai_result['confidence'] >= 0.70:
            cursor.execute("""
                UPDATE security.assets
                SET 
                    criticality = %s,
                    metadata = COALESCE(metadata, '{}'::jsonb) || %s::jsonb,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                ai_result['criticality'],
                json.dumps({
                    'ai_reclassified': True,
                    'ai_confidence': ai_result['confidence'],
                    'ai_reasons': ai_result['reasons'],
                    'ai_timestamp': datetime.now().isoformat()
                }),
                asset['id']
            ))
            
            stats["reclassified"] += 1
            stats[f"{ai_result['criticality']}_new"] += 1
        else:
            stats["unchanged"] += 1
    
    conn.commit()
    cursor.close()
    
    return {
        "success": True,
        "stats": stats,
        "message": f"Reclassificados {stats['reclassified']} assets de {stats['total']}"
    }

