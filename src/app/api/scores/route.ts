import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(5)
    
    if (error) throw error
    
    return NextResponse.json(scores)
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('scores')
      .insert({
        player_name: body.player_name,
        score: body.score
      })
      .select()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error saving score:', error)
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }
}