import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  buildUploadFilename,
  getExtensionForMimeType,
  getPublicUploadUrl,
  saveUploadedFile,
} from '@/lib/upload-storage'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!isValidAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece JPG, PNG, WebP veya GIF yükleyebilirsiniz' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Dosya boyutu 10 MB\'ı geçemez' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = buildUploadFilename(file.name, file.type)

    if (!getExtensionForMimeType(file.type) && !file.name.includes('.')) {
      return NextResponse.json({ error: 'Dosya uzantısı çözümlenemedi' }, { status: 400 })
    }

    await saveUploadedFile(filename, buffer)
    await db.mediaAsset.upsert({
      where: { filename },
      update: {
        mimeType: file.type,
        data: buffer,
      },
      create: {
        filename,
        mimeType: file.type,
        data: buffer,
      },
    })

    return NextResponse.json({ url: getPublicUploadUrl(filename) }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Dosya sunucuya kaydedilemedi' }, { status: 500 })
  }
}
