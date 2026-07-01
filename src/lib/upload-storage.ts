import { access, mkdir, readFile, writeFile } from 'fs/promises'
import { constants } from 'fs'
import { extname, join } from 'path'
import { homedir, tmpdir } from 'os'

const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/pjpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

function getStorageCandidates() {
  const envDir = process.env.UPLOAD_STORAGE_DIR

  return [
    envDir,
    join(process.cwd(), 'public', 'uploads', 'products'),
    join(process.cwd(), 'data', 'uploads', 'products'),
    join(homedir(), '.birer-tekstil', 'uploads', 'products'),
    join(tmpdir(), 'birer-tekstil', 'uploads', 'products'),
  ].filter((value): value is string => Boolean(value))
}

export function getPublicUploadUrl(filename: string) {
  return `/uploads/products/${filename}`
}

export function getExtensionForMimeType(mimeType: string) {
  return MIME_TO_EXTENSION[mimeType]
}

export function buildUploadFilename(originalName: string, mimeType: string) {
  const originalExtension = extname(originalName).toLowerCase()
  const resolvedExtension = originalExtension || getExtensionForMimeType(mimeType) || '.bin'
  const safeBaseName = originalName
    .replace(originalExtension, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image'

  return `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName}${resolvedExtension}`
}

export async function ensureUploadStorageDir() {
  let lastError: unknown

  for (const dir of getStorageCandidates()) {
    try {
      await mkdir(dir, { recursive: true })
      await access(dir, constants.W_OK)
      return dir
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Yazilabilir upload klasoru bulunamadi')
}

export async function saveUploadedFile(filename: string, buffer: Buffer) {
  const dir = await ensureUploadStorageDir()
  const filepath = join(dir, filename)

  await writeFile(filepath, buffer)

  return filepath
}

export async function readUploadedFile(filename: string) {
  let lastError: unknown

  for (const dir of getStorageCandidates()) {
    try {
      const filepath = join(dir, filename)
      return await readFile(filepath)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Dosya okunamadi')
}
