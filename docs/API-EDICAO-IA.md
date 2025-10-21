# 🤖 API de Edição com Reclassificação Automática por IA

**Sistema inteligente de edição de assets/VLANs com recálculo automático de regras de segurança**

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [APIs de Assets](#apis-de-assets)
3. [APIs de VLANs](#apis-de-vlans)
4. [Motor de IA](#motor-de-ia)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Regras de Segurança](#regras-de-segurança)

---

## 1. VISÃO GERAL

### Arquitetura

```
┌─────────────┐
│  Frontend   │
│  (Edição)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐       ┌──────────────┐
│  FastAPI    │──────▶│  IA Engine   │
│  CRUD APIs  │       │ Reclassifier │
└──────┬──────┘       └──────────────┘
       │                      │
       ▼                      ▼
┌─────────────┐       ┌──────────────┐
│ PostgreSQL  │       │   Triggers   │
│  Database   │◀──────│ Auto-update  │
└─────────────┘       └──────────────┘
```

### Fluxo de Edição

1. **Usuário edita** asset/VLAN no frontend
2. **API recebe** dados e consulta estado atual
3. **IA analisa** se mudança requer reclassificação
4. **Sistema calcula** nova criticidade com confidence score
5. **Database atualiza** com metadata da IA
6. **Motor de regras** recalcula firewall rules
7. **Frontend recebe** confirmação + regras afetadas

---

## 2. APIS DE ASSETS

### Base URL
```
http://localhost:8001/api/assets
```

### 2.1 GET /api/assets/{asset_id}

Busca um asset por ID.

**Request:**
```bash
curl http://localhost:8001/api/assets/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "asset_name": "SCADA-Server-01",
  "asset_type": "Server",
  "ip_address": "192.168.100.50",
  "location": "Datacenter - Rack 12",
  "criticality": "critical",
  "status": "active",
  "metadata": {
    "ai_reclassified": true,
    "ai_confidence": 0.92,
    "ai_reasons": [
      "Nome contém 'scada' (criticidade elevada)",
      "Localização 'datacenter' é área crítica",
      "Função 'scada' é crítica"
    ]
  },
  "created_at": "2025-10-20T10:00:00",
  "updated_at": "2025-10-21T15:30:00"
}
```

---

### 2.2 PUT /api/assets/{asset_id}

Atualiza um asset com **reclassificação automática por IA**.

**Request:**
```bash
curl -X PUT http://localhost:8001/api/assets/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "SCADA-Production-Server",
    "location": "Control Room A",
    "metadata": {
      "function": "scada",
      "purdue_level": "Level 3"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "asset": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "asset_name": "SCADA-Production-Server",
    "criticality": "critical",
    ...
  },
  "ai_reclassification": {
    "criticality": "critical",
    "confidence": 0.95,
    "score": 175,
    "reasons": [
      "Nome contém 'scada' (criticidade elevada)",
      "Nome contém 'production' (criticidade elevada)",
      "Purdue Level 3 é zona OT crítica"
    ]
  },
  "affected_rules": [
    "Prioridade de monitoramento: HIGH → CRITICAL",
    "Segmentação: isolar em VLAN dedicada",
    "Acesso: MFA obrigatório para administração",
    "IDS/IPS: aumentar sensibilidade de detecção",
    "Auditoria: logging completo de todas ações"
  ],
  "message": "Asset atualizado com sucesso e reclassificado para CRITICAL"
}
```

---

### 2.3 POST /api/assets/bulk-edit

Edição em lote de múltiplos assets.

**Request:**
```bash
curl -X POST http://localhost:8001/api/assets/bulk-edit \
  -H "Content-Type: application/json" \
  -d '{
    "asset_ids": [
      "123e4567-e89b-12d3-a456-426614174000",
      "223e4567-e89b-12d3-a456-426614174001",
      "323e4567-e89b-12d3-a456-426614174002"
    ],
    "updates": {
      "location": "Datacenter - Setor A",
      "status": "active"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "results": {
    "total": 3,
    "updated": 3,
    "reclassified": 1,
    "errors": [],
    "affected_rules": [
      "ACLs de firewall: revisar regras para criticidade critical",
      "IDS/IPS: aumentar sensibilidade de detecção"
    ]
  }
}
```

---

### 2.4 POST /api/assets/reclassify-all

Reclassifica **todos** os assets usando IA (útil após mudanças nas regras de negócio).

**Request:**
```bash
curl -X POST http://localhost:8001/api/assets/reclassify-all
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 14606,
    "reclassified": 1247,
    "unchanged": 13359,
    "critical_new": 89,
    "high_new": 412,
    "medium_new": 598,
    "low_new": 148
  },
  "message": "Reclassificados 1247 assets de 14606"
}
```

---

### 2.5 DELETE /api/assets/{asset_id}

Deleta um asset (soft delete).

**Request:**
```bash
curl -X DELETE http://localhost:8001/api/assets/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "success": true,
  "message": "Asset deletado com sucesso"
}
```

---

## 3. APIS DE VLANS

### Base URL
```
http://localhost:8001/api/vlans
```

### 3.1 GET /api/vlans/{vlan_id}

Busca uma VLAN por ID.

**Response:**
```json
{
  "vlan_id": 100,
  "vlan_name": "VLAN 100",
  "description": "MES, planejamento de produção, logística",
  "criticality": "medium",
  "zone_id": 2,
  "zone_name": "Level 4 - Business Logistics",
  "purdue_level": "Level 4",
  "security_level": 2
}
```

---

### 3.2 PUT /api/vlans/{vlan_id}

Atualiza uma VLAN com **recálculo automático de regras de firewall**.

**Request:**
```bash
curl -X PUT http://localhost:8001/api/vlans/100 \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": 4,
    "criticality": "critical",
    "description": "SCADA principal - rede crítica"
  }'
```

**Response:**
```json
{
  "success": true,
  "vlan": {
    "vlan_id": 100,
    "zone_id": 4,
    "criticality": "critical",
    ...
  },
  "rules_changed": true,
  "affected_rules": [
    {
      "source_zone": "DMZ",
      "dest_zone": "Level 3 - SCADA/HMI",
      "action": "allow",
      "protocol": "OPC-UA",
      "port": "4840",
      "reason": "DMZ pode ler SCADA via OPC-UA"
    },
    {
      "source_zone": "Level 3 - SCADA/HMI",
      "dest_zone": "Level 2 - Control",
      "action": "allow",
      "protocol": "Modbus-TCP",
      "port": "502",
      "reason": "SCADA pode controlar PLCs via Modbus-TCP"
    }
  ],
  "message": "VLAN atualizada e regras recalculadas"
}
```

---

### 3.3 POST /api/vlans/assign-zone

Atribui múltiplas VLANs a uma zona Purdue.

**Request:**
```bash
curl -X POST http://localhost:8001/api/vlans/assign-zone \
  -H "Content-Type: application/json" \
  -d '{
    "vlan_ids": [560, 563, 564, 565],
    "zone_id": 4,
    "reason": "VLANs SCADA identificadas em auditoria"
  }'
```

**Response:**
```json
{
  "success": true,
  "zone": {
    "id": 4,
    "zone_name": "Level 3 - SCADA/HMI",
    "criticality": "critical",
    "security_level": 4
  },
  "vlans_updated": 4,
  "total_rules_generated": 42,
  "message": "4 VLANs atribuídas à zona Level 3 - SCADA/HMI"
}
```

---

### 3.4 POST /api/vlans/generate-rules

Gera todas as regras de firewall baseadas nas zonas Purdue atuais.

**Request:**
```bash
curl -X POST http://localhost:8001/api/vlans/generate-rules
```

**Response:**
```json
{
  "success": true,
  "total_rules": 84,
  "deny_rules": 42,
  "allow_rules": 42,
  "rules": {
    "deny": [
      {
        "source_zone": "Level 2 - Control",
        "dest_zone": "Level 5 - Enterprise",
        "action": "deny",
        "protocol": "*",
        "port": "*",
        "reason": "OT não pode iniciar conexões para IT (isolamento)"
      }
    ],
    "allow": [
      {
        "source_zone": "Level 3 - SCADA/HMI",
        "dest_zone": "Level 2 - Control",
        "action": "allow",
        "protocol": "Modbus-TCP",
        "port": "502",
        "reason": "SCADA pode controlar PLCs via Modbus-TCP"
      }
    ]
  },
  "message": "Geradas 84 regras de firewall baseadas em Modelo Purdue"
}
```

---

## 4. MOTOR DE IA

### 4.1 Como Funciona

O **AIReclassifier** analisa assets usando um sistema de pontuação (scoring):

```python
# Exemplo de scoring
score = 0

# 1. Tipo de asset
if asset_type == 'Server': score += 60
if asset_type == 'Firewall': score += 80
if asset_type == 'Router': score += 80

# 2. Palavras-chave no nome
if 'scada' in asset_name: score += 90
if 'hmi' in asset_name: score += 90
if 'safety' in asset_name: score += 95
if 'core' in asset_name: score += 70

# 3. Localização
if 'datacenter' in location: score += 40
if 'control room' in location: score += 50

# 4. Metadata
if function == 'scada': score += 60
if purdue_level == 'Level 2': score += 50

# Decisão final
if score >= 150: criticality = 'critical' (confidence 0.90+)
if score >= 100: criticality = 'high'     (confidence 0.80+)
if score >= 50:  criticality = 'medium'   (confidence 0.70+)
else:            criticality = 'low'      (confidence 0.60+)
```

### 4.2 Confidence Threshold

- ✅ **>= 0.70**: IA aplica reclassificação automaticamente
- ⚠️ **< 0.70**: IA sugere mas não aplica (requer aprovação manual)

### 4.3 Regras de Negócio

**Quando reclassificar:**
- Mudança de `asset_type`
- Mudança de `asset_name` (keywords críticas)
- Mudança de `location` (áreas críticas)
- Mudança de `metadata` (função, Purdue level)

**Quando NÃO reclassificar:**
- Mudança de `status` apenas
- Mudança de `ip_address` apenas
- Mudança de `mac_address` apenas

---

## 5. EXEMPLOS DE USO

### 5.1 Cenário 1: Identificar servidor SCADA

```bash
# Antes: servidor genérico (low)
{
  "asset_name": "SRV-015",
  "asset_type": "Server",
  "criticality": "low"
}

# Edição: adicionar função
curl -X PUT .../api/assets/{id} -d '{
  "asset_name": "SCADA-HMI-Server",
  "metadata": {
    "function": "scada",
    "purdue_level": "Level 3"
  }
}'

# Depois: reclassificado automaticamente
{
  "asset_name": "SCADA-HMI-Server",
  "criticality": "critical",
  "metadata": {
    "ai_reclassified": true,
    "ai_confidence": 0.95,
    "ai_reasons": ["Nome contém 'scada'", "Função 'scada' é crítica"]
  }
}
```

### 5.2 Cenário 2: Mover VLAN para zona crítica

```bash
# Antes: VLAN 100 na zona Business (medium)
# Depois: descobrimos que é SCADA

curl -X PUT .../api/vlans/100 -d '{
  "zone_id": 4,
  "description": "SCADA Servers - Crítico"
}'

# Resultado: 42 novas regras de firewall geradas
# - Bloqueio Internet → VLAN 100
# - Permissão DMZ → VLAN 100 (OPC-UA apenas)
# - IDS/IPS ativado para VLAN 100
```

### 5.3 Cenário 3: Reclassificar tudo após auditoria

```bash
# Após auditoria, revisamos regras de criticidade

curl -X POST .../api/assets/reclassify-all

# Resultado:
# - 89 novos assets CRITICAL (servidores SCADA/HMI)
# - 412 novos assets HIGH (routers, core switches)
# - 598 novos assets MEDIUM (access switches)
```

---

## 6. REGRAS DE SEGURANÇA

### 6.1 Matriz de Criticidade → Controles

| Criticidade | Monitoramento | Backup | Acesso | IDS/IPS | Segmentação |
|-------------|---------------|--------|--------|---------|-------------|
| **CRITICAL** | Tempo real | RTO < 4h | MFA obrigatório | Inline | VLAN dedicada |
| **HIGH** | < 5 min | RTO < 8h | MFA recomendado | Passive | VLAN por função |
| **MEDIUM** | < 15 min | RTO < 24h | Senha forte | Logging | VLAN compartilhada |
| **LOW** | < 1h | RTO < 72h | Senha | Opcional | VLAN geral |

### 6.2 Regras de Firewall Purdue

```
┌────────────────────────────────────────────────────────┐
│ MODELO PURDUE - REGRAS DE FIREWALL                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Level 5 (Enterprise)                                 │
│     ↓ DENY direct → Level 3-2-1                       │
│     ↓ ALLOW → DMZ (HTTPS)                             │
│                                                        │
│  DMZ (Demilitarized Zone)                             │
│     ↓ ALLOW → Level 3 (OPC-UA, read-only)             │
│     ↓ DENY → Level 2-1                                │
│                                                        │
│  Level 3 (SCADA/HMI)                                  │
│     ↓ ALLOW → Level 2 (Modbus, DNP3, IEC-104)         │
│     ↑ DENY ← Level 5 (isolamento)                     │
│                                                        │
│  Level 2 (Control/PLCs)                               │
│     ↓ ALLOW → Level 1 (Modbus-RTU/TCP)                │
│     ↑ DENY ← Level 5-4 (isolamento)                   │
│                                                        │
│  Level 1 (Field Devices)                              │
│     ↑ READ-ONLY ← Level 2                             │
│     ↑ DENY ← Level 5-4-3 (isolamento total)           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 6.3 Triggers Automáticos

Quando um asset/VLAN muda de criticidade:

1. **Notification**: Alerta para SOC/NOC
2. **ACL Update**: Regras de firewall recalculadas
3. **Monitoring**: Ajuste de sensibilidade IDS/IPS
4. **Backup**: Inclusão/exclusão de backup crítico
5. **Audit Log**: Registro completo da mudança
6. **Compliance**: Atualização de relatórios ONS/ANEEL

---

## 7. INTEGRAÇÃO FRONTEND

### Exemplo React/Next.js

```typescript
// frontend/lib/api-client.ts
export async function updateAsset(id: string, updates: AssetUpdate) {
  const response = await fetch(`/api/assets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  
  const result = await response.json();
  
  if (result.ai_reclassification) {
    // Mostrar notificação de reclassificação
    showNotification({
      title: 'Asset reclassificado por IA',
      message: `Novo nível: ${result.ai_reclassification.criticality.toUpperCase()}`,
      confidence: result.ai_reclassification.confidence,
      reasons: result.ai_reclassification.reasons
    });
  }
  
  if (result.affected_rules.length > 0) {
    // Mostrar regras afetadas
    showAffectedRules(result.affected_rules);
  }
  
  return result;
}
```

---

## 8. PRÓXIMOS PASSOS

### 8.1 Melhorias Futuras

- [ ] Integrar OpenAI GPT-4 para análise de contexto
- [ ] Histórico de mudanças (audit trail completo)
- [ ] Aprovação manual para confidence < 0.70
- [ ] Machine Learning para melhorar scoring
- [ ] Webhook para notificações externas
- [ ] API para exportar regras para Palo Alto/Fortinet

### 8.2 Compliance

- [ ] Gerar relatório ONS automático
- [ ] Gerar evidências ANEEL RN 964
- [ ] Exportar para GRC tools (Archer, ServiceNow)

---

**Powered by BMAD™ Core - AI-Driven Network Security**  
**Framework:** IEC 62443 | ISA-95 Purdue | ONS | ANEEL RN 964/2021

