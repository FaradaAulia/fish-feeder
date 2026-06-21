import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res)
{
  const { data } = await supabase
    .from('sensor_data')
    .select('*')
    .order('id', {
      ascending: false
    })
    .limit(20)

  res.status(200).json(data.reverse())
}