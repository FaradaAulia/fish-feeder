import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed'
    })
  }

  const { error } = await supabase
    .from('control')
    .update({
      feed: 1
    })
    .eq('id', 1)

  if (error) {
    return res.status(500).json(error)
  }

  return res.status(200).json({
    success: true
  })
}