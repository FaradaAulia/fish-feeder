import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  const { data, error } = await supabase
    .from('sensor_data')
    .insert([
      {
        suhu: 30,
        kelembapan: 70
      }
    ])
    .select()

  return res.status(200).json({
    data,
    error
  })
}