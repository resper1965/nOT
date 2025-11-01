# GitHub Spec Kit - ness. OT GRC

Este diretório contém as especificações do projeto **ness. OT GRC** usando o **GitHub Spec Kit**.

## 📁 Estrutura

- `config.toml` - Configuração do Spec Kit
- `project.md` - Especificação geral do projeto
- `requirements.md` - Requisitos funcionais e não-funcionais
- `architecture.md` - Arquitetura do sistema
- `README.md` - Este arquivo

## 🔧 Como Usar

### Comandos Principais

```bash
# Certifique-se de que o PATH inclui ~/.local/bin
export PATH="$HOME/.local/bin:$PATH"

# Inicializar especificação (já feito)
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai cursor-agent

# Criar nova especificação
uvx --from git+https://github.com/github/spec-kit.git specify create <nome-da-spec>

# Atualizar especificação existente
uvx --from git+https://github.com/github/spec-kit.git specify update <nome-da-spec>

# Listar especificações
uvx --from git+https://github.com/github/spec-kit.git specify list

# Validar especificações
uvx --from git+https://github.com/github/spec-kit.git specify validate
```

## 🤖 Agente de IA Configurado

O projeto está configurado para usar o **Cursor AI Agent** (`cursor-agent`).

Outros agentes disponíveis:
- `copilot` - GitHub Copilot
- `claude` - Claude Code
- `gemini` - Gemini CLI
- `qwen` - Qwen Code
- E mais...

## 📝 Convenções

### Nomenclatura
- Arquivos de spec: `kebab-case.md`
- Componentes: `PascalCase`
- Funções: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

### Estrutura de Specs
1. **Visão Geral**: O que é o componente/feature
2. **Requisitos**: O que deve fazer
3. **Arquitetura**: Como está implementado
4. **Testes**: Como validar

## 🔗 Links Úteis

- [Documentação Spec Kit](https://github.github.com/spec-kit/)
- [Repositório GitHub](https://github.com/github/spec-kit)
- [Documentação do Projeto](../README.md)

## 📚 Próximos Passos

1. Criar specs para features específicas
2. Validar especificações regularmente
3. Atualizar specs quando features mudarem
4. Usar specs para documentar decisões de arquitetura

---

**Configurado para**: ness. OT GRC - Governance, Risk & Compliance  
**Agente de IA**: Cursor  
**Data de criação**: 2025-01-27

