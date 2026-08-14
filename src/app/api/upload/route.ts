import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

function detectMimeType(file: File): string {
  // Prefer the browser-provided type
  if (file.type && ALLOWED_TYPES.includes(file.type)) {
    return file.type
  }
  // Fallback: derive from file extension
  const ext = path.extname(file.name).toLowerCase()
  return EXT_TO_MIME[ext] || ''
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Gather all file entries from both 'file' and 'files' keys
    const files: File[] = []
    for (const key of ['file', 'files']) {
      for (const entry of formData.getAll(key)) {
        if (entry instanceof File && entry.size > 0) {
          files.push(entry)
        }
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 })
    }

    let uploadDir = path.join(/* turbopackIgnore: true */ process.cwd(), 'public', 'uploads')
    if (existsSync('/app/data')) {
      uploadDir = '/app/data/uploads'
    }
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const results: { id: string; url: string; fileName: string; mimeType: string; size: number }[] = []

    for (const file of files) {
      const mimeType = detectMimeType(file)
      if (!mimeType) {
        continue // skip unsupported types
      }

      if (file.size > 10 * 1024 * 1024) {
        continue // skip files over 10MB
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000)
      const ext = path.extname(file.name) || MIME_TO_EXT[mimeType] || '.jpg'
      const fileName = `${timestamp}-${random}${ext}`
      
      const filePath = path.join(uploadDir, fileName)
      await writeFile(filePath, buffer)

      const url = `/uploads/${fileName}`

      // Save to Media table
      try {
        const media = await prisma.media.create({
          data: {
            fileName: file.name,
            url,
            mimeType,
            size: file.size,
          }
        })

        results.push({
          id: media.id,
          url: media.url,
          fileName: media.fileName,
          mimeType: media.mimeType,
          size: media.size,
        })
      } catch (dbError) {
        // If DB save fails, still return the URL (file was saved successfully)
        console.error('Media DB save error:', dbError)
        results.push({
          id: '',
          url,
          fileName: file.name,
          mimeType,
          size: file.size,
        })
      }
    }

    if (results.length === 0) {
      return NextResponse.json({ error: 'Hiçbir dosya yüklenemedi. Desteklenen formatlar: JPEG, PNG, WebP, GIF' }, { status: 400 })
    }

    // Backward compatible: if single file, return flat object with 'url' key
    if (results.length === 1) {
      return NextResponse.json(results[0])
    }

    return NextResponse.json({ files: results })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Dosya yüklenirken hata oluştu: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 })
  }
}
