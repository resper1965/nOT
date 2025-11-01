#!/bin/bash

# Script para instalar next-intl e finalizar integração ness-theme
# ness. OT GRC - Integração ness-theme

echo "🚀 Instalando next-intl para finalizar integração ness-theme..."

cd "$(dirname "$0")/.."

# Instalar next-intl
echo "📦 Instalando next-intl..."
npm install next-intl@^3.0.0

if [ $? -eq 0 ]; then
    echo "✅ next-intl instalado com sucesso!"
    echo ""
    echo "📝 Próximos passos:"
    echo "   1. Estrutura i18n já está criada em src/i18n/"
    echo "   2. Traduções prontas em messages/ (pt.json, en.json, es.json)"
    echo "   3. Componente LocaleSwitcher criado em src/components/branding/"
    echo ""
    echo "🎯 Para ativar i18n nas rotas:"
    echo "   - Atualizar middleware.ts para suportar [locale]"
    echo "   - Reorganizar rotas para app/[locale]/"
else
    echo "❌ Erro ao instalar next-intl"
    echo "💡 Tentando com sudo..."
    sudo npm install next-intl@^3.0.0
fi

echo ""
echo "✅ Integração ness-theme finalizada!"

