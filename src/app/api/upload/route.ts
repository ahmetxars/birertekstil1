import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from '@/lib/auth'

// ── Cloudinary (optional) ──────────────────────────────────────────────────
// Set these env vars to enable Cloudinary. If not set, falls back to local disk.
//   CLOUDINARY_CLOUD_NAME=your_cloud_name
//   CLOUDINARY_API_KEY=your_api_key
//   CLOUDINARY_API_SECRET=your_api_secret
const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  const { v2: cloudinary } = await import('cloudinary')

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'birer-tekstil/products',
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto', width: 1200, crop: 'limit' }],
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('Cloudinary upload failed'))
        else resolve(result.secure_url)
      }
    )
    uploadStream.end(buffer)
  })
}

async function uploadToLocal(buffer: Buffer, originalName: string): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(uploadDir, { recursive: true })

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const ext = originalName.split('.').pop()
  const filename = `${uniqueSuffix}.${ext}`
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, buffer)
  return `/uploads/products/${filename}`
}

// ── Route handler ──────────────────────────────────────────────────────────
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Sadece JPG, PNG, WebP veya GIF yükleyebilirsiniz' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10 MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Dosya boyutu 10 MB\'ı geçemez' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const url = useCloudinary
      ? await uploadToCloudinary(buffer, file.name)
      : await uploadToLocal(buffer, file.name)

    return NextResponse.json({ url }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Dosya yüklenirken hata oluştu' }, { status: 500 })
  }
}
