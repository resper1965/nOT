# 📦 Instalação do GitHub Spec Kit

## ✅ Pré-requisitos Instalados

- ✅ Python 3.12.3 (requerido: 3.11+)
- ✅ Git 2.43.0
- ✅ uv (gerenciador de pacotes Python) instalado

## 🚀 Como Usar o Spec Kit

O GitHub Spec Kit é uma ferramenta para especificação de projetos com assistência de IA.

### Uso Básico

O Spec Kit não precisa ser "instalado" permanentemente. Ele é executado via `uvx` diretamente do GitHub:

```bash
# Certifique-se de que o PATH inclui ~/.local/bin
export PATH="$HOME/.local/bin:$PATH"

# Para inicializar um novo projeto
uvx --from git+https://github.com/github/spec-kit.git specify init <NOME_DO_PROJETO>

# Para inicializar no diretório atual
uvx --from git+https://github.com/github/spec-kit.git specify init .

# Ou usar o flag --here
uvx --from git+https://github.com/github/spec-kit.git specify init --here
```

### Exemplos

```bash
# Adicionar ao PATH (adicione ao ~/.bashrc ou ~/.zshrc para persistir)
export PATH="$HOME/.local/bin:$PATH"

# Inicializar projeto no diretório atual
cd /home/resper/TBE-OT
uvx --from git+https://github.com/github/spec-kit.git specify init --here

# Inicializar novo projeto
uvx --from git+https://github.com/github/spec-kit.git specify init meu-projeto

# Com agente de IA específico (Claude)
uvx --from git+https://github.com/github/spec-kit.git specify init meu-projeto --ai claude
```

## 📚 Documentação

Para mais informações:
- [Documentação Oficial](https://github.github.com/spec-kit/)
- [Repositório GitHub](https://github.com/github/spec-kit)

## ⚙️ Agentes de IA Suportados

- Claude Code
- GitHub Copilot
- Gemini CLI

---

**Nota**: O Spec Kit é executado sob demanda via `uvx`, não requer instalação permanente.

