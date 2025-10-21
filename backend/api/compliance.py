from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/compliance", tags=["compliance"])

# Configuração do banco
DB_CONFIG = {
    'host': 'postgres',
    'port': 5432,
    'database': 'ness_ot_grc',
    'user': 'ness_admin',
    'password': 'ness_secure_pass_2025'
}

def get_db_connection():
    """Conecta ao banco de dados"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.OperationalError as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar ao banco: {e}")

@router.get("/documents")
async def get_compliance_documents():
    """Retorna lista de documentos de compliance baseados em ANEEL RN 964/2021 e ONS"""
    
    # Documentos obrigatórios baseados em ANEEL RN 964/2021 e ONS
    documents = [
        # ANEEL RN 964/2021 - Documentos Obrigatórios
        {
            "id": "ANEEL-001",
            "name": "Política de Segurança Cibernética",
            "category": "Política",
            "status": "missing",
            "priority": "P0",
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, I",
            "deadline": "Imediato",
            "description": "Política corporativa de segurança cibernética aprovada pela diretoria"
        },
        {
            "id": "ANEEL-002", 
            "name": "Plano de Resposta a Incidentes Cibernéticos",
            "category": "Plano",
            "status": "missing",
            "priority": "P0",
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, II",
            "deadline": "Imediato",
            "description": "Plano detalhado para resposta a incidentes de segurança cibernética"
        },
        {
            "id": "ANEEL-003",
            "name": "Procedimento de Gestão de Vulnerabilidades",
            "category": "Procedimento", 
            "status": "missing",
            "priority": "P0",
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, III",
            "deadline": "Imediato",
            "description": "Procedimentos para identificação, classificação e correção de vulnerabilidades"
        },
        {
            "id": "ANEEL-004",
            "name": "Política de Controle de Acesso",
            "category": "Política",
            "status": "missing", 
            "priority": "P0",
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, IV",
            "deadline": "Imediato",
            "description": "Política de controle de acesso a sistemas e informações"
        },
        {
            "id": "ANEEL-005",
            "name": "Procedimento de Backup e Recuperação",
            "category": "Procedimento",
            "status": "missing",
            "priority": "P0", 
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, V",
            "deadline": "Imediato",
            "description": "Procedimentos para backup e recuperação de dados críticos"
        },
        {
            "id": "ANEEL-006",
            "name": "Plano de Continuidade de Negócio",
            "category": "Plano",
            "status": "missing",
            "priority": "P0",
            "framework": "ANEEL RN 964/2021", 
            "article": "Art. 4º, VI",
            "deadline": "Imediato",
            "description": "Plano para manutenção das operações em caso de incidentes cibernéticos"
        },
        {
            "id": "ANEEL-007",
            "name": "Política de Gestão de Terceiros",
            "category": "Política",
            "status": "missing",
            "priority": "P1",
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, VII", 
            "deadline": "6 meses",
            "description": "Política para gestão de riscos cibernéticos de fornecedores e terceiros"
        },
        {
            "id": "ANEEL-008",
            "name": "Procedimento de Monitoramento Contínuo",
            "category": "Procedimento",
            "status": "missing",
            "priority": "P0",
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, VIII",
            "deadline": "Imediato", 
            "description": "Procedimentos para monitoramento contínuo da segurança cibernética"
        },
        {
            "id": "ANEEL-009",
            "name": "Política de Treinamento e Conscientização",
            "category": "Política",
            "status": "missing",
            "priority": "P1",
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 4º, IX",
            "deadline": "6 meses",
            "description": "Política de treinamento em segurança cibernética para colaboradores"
        },
        {
            "id": "ANEEL-010",
            "name": "Relatório Anual de Segurança Cibernética",
            "category": "Relatório",
            "status": "missing",
            "priority": "P1", 
            "framework": "ANEEL RN 964/2021",
            "article": "Art. 5º",
            "deadline": "Anual",
            "description": "Relatório anual sobre o estado da segurança cibernética para ANEEL"
        },
        
        # ONS - Controles de Segurança
        {
            "id": "ONS-001",
            "name": "Controle 1 - Inventário de Ativos",
            "category": "Controle",
            "status": "approved",
            "priority": "P0",
            "framework": "ONS Controle 1",
            "article": "ONS-1",
            "deadline": "Contínuo",
            "description": "Inventário completo e atualizado de todos os ativos de TI e OT"
        },
        {
            "id": "ONS-002", 
            "name": "Controle 2 - Classificação de Informações",
            "category": "Controle",
            "status": "missing",
            "priority": "P0",
            "framework": "ONS Controle 2", 
            "article": "ONS-2",
            "deadline": "Imediato",
            "description": "Classificação e proteção de informações críticas"
        },
        {
            "id": "ONS-003",
            "name": "Controle 3 - Gestão de Acessos",
            "category": "Controle",
            "status": "missing",
            "priority": "P0",
            "framework": "ONS Controle 3",
            "article": "ONS-3", 
            "deadline": "Imediato",
            "description": "Controle rigoroso de acessos a sistemas e informações"
        },
        {
            "id": "ONS-004",
            "name": "Controle 4 - Monitoramento e Logs",
            "category": "Controle",
            "status": "missing",
            "priority": "P0",
            "framework": "ONS Controle 4",
            "article": "ONS-4",
            "deadline": "Imediato",
            "description": "Monitoramento contínuo e registro de atividades"
        },
        {
            "id": "ONS-005",
            "name": "Controle 5 - Segmentação de Rede",
            "category": "Controle", 
            "status": "missing",
            "priority": "P0",
            "framework": "ONS Controle 5",
            "article": "ONS-5",
            "deadline": "Imediato",
            "description": "Segmentação adequada da rede OT conforme modelo Purdue"
        },
        {
            "id": "ONS-006",
            "name": "Controle 6 - Gestão de Vulnerabilidades",
            "category": "Controle",
            "status": "missing",
            "priority": "P0",
            "framework": "ONS Controle 6",
            "article": "ONS-6",
            "deadline": "Imediato", 
            "description": "Identificação e correção de vulnerabilidades"
        },
        {
            "id": "ONS-007",
            "name": "Controle 7 - Backup e Recuperação",
            "category": "Controle",
            "status": "missing",
            "priority": "P0",
            "framework": "ONS Controle 7",
            "article": "ONS-7",
            "deadline": "Imediato",
            "description": "Backup regular e procedimentos de recuperação"
        },
        {
            "id": "ONS-008",
            "name": "Controle 8 - Gestão de Incidentes",
            "category": "Controle",
            "status": "missing",
            "priority": "P0",
            "framework": "ONS Controle 8",
            "article": "ONS-8",
            "deadline": "Imediato",
            "description": "Processo estruturado de gestão de incidentes de segurança"
        },
        {
            "id": "ONS-009",
            "name": "Controle 9 - Treinamento e Conscientização",
            "category": "Controle",
            "status": "missing",
            "priority": "P1",
            "framework": "ONS Controle 9",
            "article": "ONS-9",
            "deadline": "6 meses",
            "description": "Programa de treinamento em segurança cibernética"
        },
        {
            "id": "ONS-010",
            "name": "Controle 10 - Gestão de Terceiros",
            "category": "Controle",
            "status": "missing",
            "priority": "P1",
            "framework": "ONS Controle 10",
            "article": "ONS-10",
            "deadline": "6 meses",
            "description": "Gestão de riscos cibernéticos de fornecedores"
        },
        
        # IEC 62443 - Framework Internacional
        {
            "id": "IEC-001",
            "name": "IEC 62443-2-1 - Política de Segurança",
            "category": "Política",
            "status": "missing",
            "priority": "P1",
            "framework": "IEC 62443",
            "article": "IEC 62443-2-1",
            "deadline": "12 meses",
            "description": "Política de segurança baseada em IEC 62443-2-1"
        },
        {
            "id": "IEC-002",
            "name": "IEC 62443-3-3 - Zonas e Conduítes",
            "category": "Controle",
            "status": "missing",
            "priority": "P0",
            "framework": "IEC 62443",
            "article": "IEC 62443-3-3",
            "deadline": "Imediato",
            "description": "Implementação de zonas de segurança conforme IEC 62443-3-3"
        },
        {
            "id": "IEC-003",
            "name": "IEC 62443-4-2 - Requisitos Técnicos",
            "category": "Controle",
            "status": "missing",
            "priority": "P1",
            "framework": "IEC 62443",
            "article": "IEC 62443-4-2",
            "deadline": "12 meses",
            "description": "Implementação de requisitos técnicos de segurança"
        }
    ]
    
    # Calcular estatísticas
    total_docs = len(documents)
    missing_docs = len([d for d in documents if d["status"] == "missing"])
    approved_docs = len([d for d in documents if d["status"] == "approved"])
    draft_docs = len([d for d in documents if d["status"] == "draft"])
    review_docs = len([d for d in documents if d["status"] == "review"])
    
    return {
        "documents": documents,
        "stats": {
            "total": total_docs,
            "missing": missing_docs,
            "approved": approved_docs,
            "draft": draft_docs,
            "review": review_docs,
            "completion_rate": round((approved_docs / total_docs) * 100, 1)
        },
        "frameworks": {
            "aneel": len([d for d in documents if d["framework"] == "ANEEL RN 964/2021"]),
            "ons": len([d for d in documents if d["framework"] == "ONS Controle 1"]),
            "iec": len([d for d in documents if d["framework"] == "IEC 62443"])
        }
    }

@router.get("/ons-controls")
async def get_ons_controls():
    """Retorna status dos controles ONS baseado na análise real da rede TBE"""
    
    # Baseado na análise real dos dados TBE
    controls = [
        {
            "id": "ONS-1",
            "name": "Inventário de Ativos",
            "status": "approved",
            "completion": 100,
            "description": "Inventário completo de 14.606 ativos importados",
            "evidence": "14.606 ativos catalogados no sistema",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-2", 
            "name": "Classificação de Informações",
            "status": "in_progress",
            "completion": 25,
            "description": "Classificação parcial - 59 VLANs identificadas",
            "evidence": "59 VLANs mapeadas, classificação Purdue em andamento",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-3",
            "name": "Gestão de Acessos", 
            "status": "missing",
            "completion": 0,
            "description": "Sistema de gestão de acessos não implementado",
            "evidence": "Ausência de controle de acesso centralizado",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-4",
            "name": "Monitoramento e Logs",
            "status": "missing", 
            "completion": 0,
            "description": "Sistema de monitoramento não implementado",
            "evidence": "Ausência de SIEM ou sistema de logs centralizado",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-5",
            "name": "Segmentação de Rede",
            "status": "critical",
            "completion": 5,
            "description": "Modelo Purdue não implementado - GAP CRÍTICO",
            "evidence": "109 subnets não classificados, 1.345 conexões não analisadas",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-6",
            "name": "Gestão de Vulnerabilidades",
            "status": "missing",
            "completion": 0,
            "description": "Processo de gestão de vulnerabilidades não implementado",
            "evidence": "Ausência de scanner de vulnerabilidades OT",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-7",
            "name": "Backup e Recuperação",
            "status": "missing",
            "completion": 0,
            "description": "Plano de backup não documentado",
            "evidence": "Ausência de procedimentos de backup documentados",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-8",
            "name": "Gestão de Incidentes",
            "status": "missing",
            "completion": 0,
            "description": "Processo de gestão de incidentes não implementado",
            "evidence": "Ausência de CSIRT ou processo estruturado",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-9",
            "name": "Treinamento e Conscientização",
            "status": "missing",
            "completion": 0,
            "description": "Programa de treinamento não implementado",
            "evidence": "Ausência de programa de conscientização em segurança",
            "last_updated": "2025-01-27"
        },
        {
            "id": "ONS-10",
            "name": "Gestão de Terceiros",
            "status": "missing",
            "completion": 0,
            "description": "Gestão de riscos de terceiros não implementada",
            "evidence": "Ausência de processo de avaliação de fornecedores",
            "last_updated": "2025-01-27"
        }
    ]
    
    # Calcular estatísticas
    total_controls = len(controls)
    approved_controls = len([c for c in controls if c["status"] == "approved"])
    missing_controls = len([c for c in controls if c["status"] == "missing"])
    critical_controls = len([c for c in controls if c["status"] == "critical"])
    in_progress_controls = len([c for c in controls if c["status"] == "in_progress"])
    
    return {
        "controls": controls,
        "stats": {
            "total": total_controls,
            "approved": approved_controls,
            "missing": missing_controls,
            "critical": critical_controls,
            "in_progress": in_progress_controls,
            "compliance_rate": round((approved_controls / total_controls) * 100, 1)
        }
    }

@router.get("/aneel-requirements")
async def get_aneel_requirements():
    """Retorna status dos requisitos ANEEL RN 964/2021"""
    
    requirements = [
        {
            "id": "ANEEL-ART-4-I",
            "article": "Art. 4º, I",
            "requirement": "Política de Segurança Cibernética",
            "status": "missing",
            "deadline": "Imediato",
            "penalty": "Multa de até R$ 100.000,00",
            "description": "Política corporativa de segurança cibernética aprovada pela diretoria"
        },
        {
            "id": "ANEEL-ART-4-II",
            "article": "Art. 4º, II", 
            "requirement": "Plano de Resposta a Incidentes",
            "status": "missing",
            "deadline": "Imediato",
            "penalty": "Multa de até R$ 100.000,00",
            "description": "Plano detalhado para resposta a incidentes de segurança cibernética"
        },
        {
            "id": "ANEEL-ART-4-III",
            "article": "Art. 4º, III",
            "requirement": "Gestão de Vulnerabilidades",
            "status": "missing",
            "deadline": "Imediato", 
            "penalty": "Multa de até R$ 100.000,00",
            "description": "Procedimentos para identificação e correção de vulnerabilidades"
        },
        {
            "id": "ANEEL-ART-4-IV",
            "article": "Art. 4º, IV",
            "requirement": "Controle de Acesso",
            "status": "missing",
            "deadline": "Imediato",
            "penalty": "Multa de até R$ 100.000,00",
            "description": "Política de controle de acesso a sistemas e informações"
        },
        {
            "id": "ANEEL-ART-4-V",
            "article": "Art. 4º, V",
            "requirement": "Backup e Recuperação",
            "status": "missing",
            "deadline": "Imediato",
            "penalty": "Multa de até R$ 100.000,00",
            "description": "Procedimentos para backup e recuperação de dados críticos"
        },
        {
            "id": "ANEEL-ART-4-VI",
            "article": "Art. 4º, VI",
            "requirement": "Continuidade de Negócio",
            "status": "missing",
            "deadline": "Imediato",
            "penalty": "Multa de até R$ 100.000,00",
            "description": "Plano para manutenção das operações em caso de incidentes"
        },
        {
            "id": "ANEEL-ART-5",
            "article": "Art. 5º",
            "requirement": "Relatório Anual",
            "status": "missing",
            "deadline": "Anual",
            "penalty": "Multa de até R$ 50.000,00",
            "description": "Relatório anual sobre o estado da segurança cibernética"
        }
    ]
    
    return {
        "requirements": requirements,
        "total_penalties": "R$ 650.000,00",
        "critical_requirements": len([r for r in requirements if r["status"] == "missing"])
    }
