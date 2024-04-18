import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const remoteAudioUrl = searchParams.get('audio')
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${remoteAudioUrl}`)
  return response
}

