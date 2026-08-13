import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await params
    const filename = resolvedParams.filename

    // Prevent directory traversal
    const safeFilename = path.basename(filename)

    // Check potential file location paths
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', safeFilename),
      path.join('/app', 'public', 'uploads', safeFilename),
      path.join('/app', 'data', 'uploads', safeFilename),
    ]

    let filePath: string | null = null
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        filePath = p
        break
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: 'Görsel bulunamadı.' }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)
    const fileStat = await stat(filePath)
    const ext = path.extname(safeFilename).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving upload:', error)
    return NextResponse.json({ error: 'Görsel sunulurken hata oluştu.' }, { status: 500 })
  }
}
