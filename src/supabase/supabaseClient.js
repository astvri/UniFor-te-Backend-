import 'dotenv/config'; // Garante que o .env será carregado
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // ou use PUBLIC_KEY para o frontend

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL ou SUPABASE_SECRET_KEY não definidos no .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
