import { NextRequest, NextResponse } from 'next/server'
import { extname } from 'path'
import { readUploadedFile } from '@/lib/upload-storage'

export const runtime = 'nodejs'

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    if (!filename || filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
      return NextResponse.json({ error: 'Geçersiz dosya adı' }, { status: 400 })
    }

    const file = await readUploadedFile(filename)
    const contentType = CONTENT_TYPES[extname(filename).toLowerCase()] || 'application/octet-stream'

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Media read error:', error)
    return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 404 })
  }
}
