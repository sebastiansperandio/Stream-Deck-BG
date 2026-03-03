import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { session_id, event_name, event_data } = body;

    // Basic validation
    if (!session_id || typeof session_id !== 'string') {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }
    if (!event_name || typeof event_name !== 'string') {
      return NextResponse.json({ error: 'Missing event_name' }, { status: 400 });
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        session_id,
        event_name,
        event_data: event_data || {},
      });

    if (error) {
      console.error('Analytics insert error:', error);
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
