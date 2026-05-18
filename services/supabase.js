import { createClient } from "@supabase/supabase-js";

// Your active Workmate-Backend Supabase credentials
const supabaseUrl = "https://gzlzracnfomsnfdaxndl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bHpyYWNuZm9tc25mZGF4bmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMDkwMzUsImV4cCI6MjA5NDU4NTAzNX0.KBjyMxjpsRC8d8OnSCr0CyUvMPSdvnfZOdbCvPeuYRU";

export const supabase = createClient(supabaseUrl, supabaseKey);
