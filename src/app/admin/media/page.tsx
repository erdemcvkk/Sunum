'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { getMediaItems, deleteMediaItem } from '@/app/actions/media'
import { Trash2, Upload, Loader2, Image as ImageIcon, Search, X, Calendar, HardDrive, Eye } from 'lucide-react'

interface MediaItem {
  id: string
  fileName: string
  url: string
  mimeType: string
  size: number
  createdAt: Date | string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(d: Date | string) {
  const date = new Date(d)
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMediaItems()
      setItems(data as MediaItem[])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploading(true)
    setUploadProgress(0)

    let completed = 0
    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        await fetch('/api/upload', { method: 'POST', body: formData })
      } catch {
        console.error('Upload failed:', file.name)
      }
      completed++
      setUploadProgress(Math.round((completed / acceptedFiles.length) * 100))
    }

    await loadItems()
    setUploading(false)
    setUploadProgress(0)
  }, [loadItems])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
  })

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`"${item.fileName}" dosyasını kalıcı olarak silmek istediğinize emin misiniz?`)) return
    setDeleting(item.id)
    try {
      await deleteMediaItem(item.id)
      await loadItems()
    } catch {
      alert('Silme sırasında hata oluştu.')
    }
    setDeleting(null)
  }

  const filteredItems = searchQuery.trim()
    ? items.filter(m => m.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
    : items

  const totalSize = items.reduce((acc, m) => acc + m.size, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fantas-dark">Ortam Kütüphanesi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Yüklediğiniz tüm görselleri buradan yönetebilirsiniz. Portfolyo ve galeri formlarında bu görselleri seçebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="font-semibold">{items.length} dosya</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
            <HardDrive className="w-3.5 h-3.5" />
            <span className="font-semibold">{formatSize(totalSize)}</span>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 shadow-inner'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm font-semibold text-blue-700">Yükleniyor... %{uploadProgress}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-1">
              <Upload className="w-7 h-7 text-blue-600" />
            </div>
            <p className="text-sm font-bold text-gray-700">
              {isDragActive ? 'Dosyaları buraya bırakın!' : 'Görselleri sürükleyip bırakın'}
            </p>
            <p className="text-xs text-gray-400">veya tıklayarak seçin · JPEG, PNG, WebP, GIF · Maks 10MB</p>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Dosya adı ile arayın..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 opacity-40" />
            </div>
            <p className="text-sm font-semibold">
              {searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz yüklenmiş dosya yok.'}
            </p>
            <p className="text-xs mt-1">Yukarıdaki alana görseller sürükleyerek başlayabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 p-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.fileName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5">
                  {/* Top Actions */}
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewItem(item) }}
                      className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
                      title="Önizle"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item) }}
                      disabled={deleting === item.id}
                      className="w-8 h-8 bg-red-500/90 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors shadow-sm disabled:opacity-50"
                      title="Sil"
                    >
                      {deleting === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div>
                    <p className="text-white text-[11px] font-medium truncate">{item.fileName}</p>
                    <div className="flex items-center gap-2 text-white/60 text-[10px] mt-0.5">
                      <span>{formatSize(item.size)}</span>
                      <span>·</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview */}
      {previewItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <button
            onClick={() => setPreviewItem(null)}
            className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-[1] max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewItem.url}
              alt={previewItem.fileName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-3 text-center">
              <p className="text-white font-semibold text-sm">{previewItem.fileName}</p>
              <div className="flex items-center justify-center gap-3 text-white/50 text-xs mt-1">
                <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {formatSize(previewItem.size)}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(previewItem.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
