import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findUnique({ where: { id }, select: { id: true } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Get visitor IP (works behind proxies / Vercel)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Deduplicate: one view per IP per product per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const existing = await db.productView.findFirst({
      where: {
        productId: id,
        ip,
        viewedAt: { gte: oneHourAgo },
      },
    })

    if (!existing) {
      await db.$transaction([
        db.productView.create({ data: { productId: id, ip } }),
        db.product.update({ where: { id }, data: { viewCount: { increment: 1 } } }),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
