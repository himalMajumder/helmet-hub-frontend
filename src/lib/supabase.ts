import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgrmzxgfnvjfukvotofi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRncm16eGdmbnZqZnVrdm90b2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0NjE5NzAsImV4cCI6MjAyNDAzNzk3MH0.Vx2mTqwxqxqL9Z3FmFU4YZFdxV4M9mb5NhlBqhCqB4Y';

export const supabase = createClient(supabaseUrl, supabaseKey);