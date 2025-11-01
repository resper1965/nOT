// Script de teste para verificar conexão com Supabase
// Execute: npx ts-node test-supabase-connection.ts

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.log('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas no .env.local');
  process.exit(1);
}

console.log('🔗 Testando conexão com Supabase...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Teste simples: tentar listar uma tabela ou verificar a conexão
async function testConnection() {
  try {
    // Tenta fazer uma query simples para verificar a conexão
    // Isso testa se a API do Supabase está respondendo
    const { data, error } = await supabase
      .from('_realtime')
      .select('*')
      .limit(0);

    if (error && error.code !== 'PGRST116') { // PGRST116 é "no rows returned", que é OK
      console.error('❌ Erro na conexão:', error.message);
      console.error('Código:', error.code);
      return false;
    }

    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    console.log('📊 Projeto configurado corretamente.');
    return true;
  } catch (err: any) {
    console.error('❌ Erro ao conectar:', err.message);
    return false;
  }
}

testConnection()
  .then((success) => {
    if (success) {
      console.log('\n✨ Tudo pronto! O Supabase está configurado corretamente.');
    } else {
      console.log('\n⚠️  Verifique suas credenciais e a configuração do projeto.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error('Erro inesperado:', err);
    process.exit(1);
  });

