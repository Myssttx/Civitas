import { createServerComponentClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from './database.types';

export async function createServerClient() {
  const cookieStore = await cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

