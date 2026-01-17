import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://gsybshuufwmgbjvhakrp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeWJzaHV1ZndtZ2Jqdmhha3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDM4OTYsImV4cCI6MjA4Mzk3OTg5Nn0.pTnmd2rqlbd3Pz2evc4U7uSjcZEd6VEAmAUr0qsIpV0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
