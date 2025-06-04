import 'dotenv/config'; // Garante que o .env será carregado
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // aqui: SUPABASE_ANON_KEY conforme seu .env

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL ou SUPABASE_ANON_KEY não definidos no .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
