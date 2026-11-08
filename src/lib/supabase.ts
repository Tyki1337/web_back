import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;

const secretkey = process.env.SUPABASE_ADMIN_KEY;

if (!url || !secretkey) {
  throw new Error('Не настроены переменные Supabase в .env');
}

export const supabase = createClient(url, secretkey);
