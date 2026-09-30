import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kfspesvqffrbzsjzcifu.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Xy48NkQuEFPzK5m6apYwnw_yQudG6FU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
