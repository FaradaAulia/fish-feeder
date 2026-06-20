import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  const { error } = await supabase
    .from('control')
    .update({
      feed: 0
    })
    .eq('id', 1)

  if (error) {
    return res.status(500).json(error)
  }

  return res.status(200).json({
    success: true
  })
}