import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {

  return res.status(200).json({
    url: process.env.SUPABASE_URL,
    keyExists: !!process.env.SUPABASE_ANON_KEY
  })

}