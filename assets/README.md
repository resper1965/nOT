# 📁 Assets - ness. OT GRC

## Pasta de Assets da Rede OT

Esta pasta contém os dados de entrada da rede TBE-OT para análise de segurança.

---

## 📤 Como Enviar Novos Assets

### 1. Formatos Aceitos

**Topologia de Rede**:
- JSON (exportação de ferramentas)
- XML (Visio, outros)
- CSV (inventário de dispositivos)
- Excel (XLSX) - será convertido

**Documentos**:
- PDF (políticas existentes, relatórios)
- DOCX/DOC (procedimentos)
- TXT/MD (textos diversos)

**Configurações**:
- Config files de dispositivos (txt, conf, cfg)
- Outputs de comandos (show run, etc)

---

## 📂 Estrutura Recomendada

```
assets/
├── network-data/
│   ├── topology.json           # Topologia completa
│   ├── devices.csv             # Inventário de dispositivos
│   ├── connections.csv         # Matriz de conexões
│   └── zones.json              # Zonas de segurança
│
├── configs/
│   ├── firewalls/              # Configs de firewalls
│   ├── switches/               # Configs de switches
│   └── routers/                # Configs de roteadores
│
├── existing-docs/
│   ├── policies/               # Políticas existentes
│   ├── procedures/             # Procedimentos existentes
│   └── reports/                # Relatórios de segurança
│
└── scans/
    ├── vulnerability-scans/    # Outputs de scanners
    ├── logs/                   # Logs de sistemas
    └── network-captures/       # PCAPs se houver
```

---

## 🔍 Dados Necessários para Análise Completa

### Inventário de Ativos (OBRIGATÓRIO)

**Informações por Dispositivo**:
- [ ] Nome/Hostname
- [ ] Tipo (Router, Switch, Firewall, Server, SCADA, PLC, etc)
- [ ] Endereço IP
- [ ] MAC Address (se disponível)
- [ ] Localização física
- [ ] Sistema Operacional e versão
- [ ] Fabricante e modelo
- [ ] Criticidade (Critical, High, Medium, Low)
- [ ] Responsável
- [ ] Status (ativo, inativo, em manutenção)

**Formato Sugerido CSV**:
```csv
hostname,type,ip_address,mac_address,location,os,os_version,vendor,model,criticality,owner,status
SRV-SCADA-01,SCADA Server,192.168.1.10,00:11:22:33:44:55,Datacenter A,Windows Server,2019,Dell,PowerEdge R740,Critical,TI,Active
RTU-001,RTU,192.168.100.50,,,Campo Subestação A,Firmware,v3.2,Schneider,RTU3000,Critical,Operação,Active
```

### Topologia de Rede (OBRIGATÓRIO)

**Informações Necessárias**:
- [ ] Conectividade entre dispositivos (quem conecta com quem)
- [ ] Protocolos usados (TCP/IP, Modbus, DNP3, OPC, etc)
- [ ] Portas abertas
- [ ] VLANs e segmentação
- [ ] Zonas de segurança (IT, OT, DMZ, etc)
- [ ] Firewalls e regras (se disponível)

**Formato Sugerido JSON**:
```json
{
  "zones": [
    {"id": "zone-1", "name": "Corporate IT", "security_level": "medium"},
    {"id": "zone-2", "name": "OT SCADA", "security_level": "critical"}
  ],
  "devices": [ ... ],
  "connections": [
    {
      "source": "SRV-SCADA-01",
      "destination": "RTU-001",
      "protocol": "DNP3",
      "port": 20000,
      "encrypted": false
    }
  ]
}
```

### Dados de Segurança (Desejável)

- [ ] Resultados de scans de vulnerabilidades
- [ ] Relatórios de pentest (se houver)
- [ ] Logs de IDS/IPS
- [ ] Incidentes anteriores
- [ ] Políticas existentes
- [ ] Configurações de firewalls

---

## 🎯 Processamento dos Assets

### Scripts Disponíveis

**1. analyze_topology.py**
- Input: JSON de topologia
- Output: `docs/security/topology-analysis-[data].md`
- Análise: Tipos de dispositivos, estatísticas, categorização

**2. import_assets.py** (TODO - Criar)
- Input: CSV de inventário
- Output: Database `security.assets` table
- Validação de dados

**3. parse_configs.py** (TODO - Criar)  
- Input: Config files de dispositivos
- Output: Análise de hardening e configurações

---

## 📊 Análise Automática

Ao enviar assets, o sistema executará automaticamente:

1. **Parse e Validação**
   - Verificar formato
   - Validar campos obrigatórios
   - Detectar inconsistências

2. **Importação para Database**
   - Inserir em `security.assets`
   - Inserir em `topology.network_zones`
   - Inserir em `topology.network_connections`

3. **Análise Inicial**
   - Estatísticas gerais
   - Identificação de dispositivos críticos
   - Detecção de gaps

4. **Relatório Preliminar**
   - Geração automática de relatório MD
   - Alertas de segurança
   - Recomendações iniciais

---

## ⚠️ Dados Sensíveis - Tratamento

**Classificação**: SECRETO (conforme ANEEL RN 964/2021)

**Controles**:
- [ ] Acesso restrito à pasta assets/
- [ ] Criptografia em repouso (BitLocker/LUKS)
- [ ] Não commitar ao git (.gitignore)
- [ ] Backup em local seguro
- [ ] Destruição segura após processamento (se necessário)

**.gitignore**:
```
assets/*.json
assets/*.csv
assets/*.xlsx
assets/*.zip
assets/network-data/*
assets/configs/*
assets/scans/*
```

---

## 📥 Envio de Arquivos

### Via Interface (Quando UI Estiver Pronta)

1. Acessar http://localhost:3000/dashboard/documents
2. Upload via drag-and-drop
3. Classificar tipo de asset
4. Aguardar processamento
5. Ver relatório gerado

### Via Linha de Comando (Agora)

```bash
# Copiar arquivos para a pasta assets
cp /caminho/para/topologia.json assets/network-data/
cp /caminho/para/inventario.csv assets/network-data/
cp /caminho/para/configs/* assets/configs/

# Executar análise
python3 analyze_topology.py assets/network-data/topology.json

# Ou importar para database (quando script estiver pronto)
python3 import_assets.py assets/network-data/inventario.csv
```

---

## 🔄 Status Atual

**Assets Antigos**: Removidos (desconsiderados)  
**Assets Novos**: ⏳ Aguardando envio do usuário  
**Pasta Preparada**: ✅ Pronta para receber arquivos  

---

## 📞 Próximos Passos

1. **Usuário envia arquivos** para esta pasta
2. **Sistema processa** automaticamente
3. **Análise é gerada** em `docs/security/`
4. **Database é populado** com ativos reais
5. **Dashboard mostra** dados reais

---

**Status**: ⏳ Aguardando Assets  
**Última Limpeza**: 2025-01-20  
**Pronto para**: Receber novos arquivos
