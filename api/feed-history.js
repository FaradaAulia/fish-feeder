import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res)
{
  const { data } = await supabase
    .from('feed_logs')
    .select('*')
    .order('created_at', {
      ascending: false
    })
    .limit(10)

  res.status(200).json(data)
}