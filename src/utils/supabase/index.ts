import { cookies } from "next/headers";
import { createClient } from "./server";

const supabase = createClient(cookies())

export default  supabase