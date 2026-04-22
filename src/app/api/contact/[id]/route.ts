import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Okundu olarak işaretle
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const msg = await db.contactMessage.update({
      where: { id },
      data: { read: true },
    })
    return NextResponse.json(msg)
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 })
  }
}

// Mesajı sil
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.contactMessage.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 })
  }
}
