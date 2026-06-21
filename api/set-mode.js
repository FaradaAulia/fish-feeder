import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { autoMode } = req.body;
  
  const { error } = await supabase
    .from('control')
    .update({ auto: autoMode ? 1 : 0 })
    .eq('id', 1)

  if (error) {
    return res.status(500).json(error)
  }

  res.status(200).json({ success: true, autoMode })
}
