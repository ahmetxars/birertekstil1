import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Admin: tüm mesajları getir
export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Contact GET error:', error)
    return NextResponse.json({ error: 'Mesajlar yüklenirken hata oluştu' }, { status: 500 })
  }
}

// Public: yeni mesaj gönder (WhatsApp yönlendirmeli formdan da gelebilir, saklamak için)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, message } = body

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 })
    }

    const contactMessage = await db.contactMessage.create({
      data: { name, phone, message },
    })

    return NextResponse.json(contactMessage, { status: 201 })
  } catch (error) {
    console.error('Contact POST error:', error)
    return NextResponse.json({ error: 'Mesaj gönderilirken hata oluştu' }, { status: 500 })
  }
}
