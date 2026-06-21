import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  const { data, error } = await supabase
    .from('control')
    .select('*')
    .eq('id', 1)
    .single()

  if (error) {
    return res.status(500).json(error)
  }

  if (data.feed == 1)
  {
    await supabase
      .from('control')
      .update({ feed: 0 })
      .eq('id', 1)

    return res.status(200).json({
      id: 1,
      feed: 1,
      auto: data.auto || 0
    })
  }

  return res.status(200).json({
    id: 1,
    feed: 0,
    auto: data.auto || 0
  })
}