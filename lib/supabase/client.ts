import { createClientComponentClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export function createClient() {
  return createClientComponentClient<Database>();
}

