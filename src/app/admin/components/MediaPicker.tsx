'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { getMediaItems } from '@/app/actions/media'
import { X, Upload, Loader2, Check, Image as ImageIcon, Search } from 'lucide-react'

interface MediaItem {
  id: string
  fileName: string
  url: string
  mimeType: string
  size: number
  createdAt: Date | string
}

interface MediaPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (urls: string[]) => void
  multiple?: boolean
  selectedUrls?: string[]
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function MediaPicker({ open, onClose, onSelect, multiple = true, selectedUrls = [] }: MediaPickerProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedUrls))
  const [searchQuery, setSearchQuery] = useState('')

  const loadMedia = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMediaItems()
      setMediaItems(data as MediaItem[])
    } catch (err) {
      console.error('Media load error:', err)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (open) {
      loadMedia()
      setSelected(new Set(selectedUrls))
    }
  }, [open, loadMedia, selectedUrls])

  const toggleSelect = (url: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(url)) {
        next.delete(url)
      } else {
        if (!multiple) next.clear()
        next.add(url)
      }
      return next
    })
  }

  const handleConfirm = () => {
    onSelect(Array.from(selected))
    onClose()
  }

  // Upload inside the picker
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploading(true)

    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        await fetch('/api/upload', { method: 'POST', body: formData })
      } catch {
        console.error('Upload failed:', file.name)
      }
    }

    await loadMedia()
    setUploading(false)
  }, [loadMedia])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
  })

  const filteredItems = searchQuery.trim()
    ? mediaItems.filter(m => m.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
    : mediaItems

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ortam Kütüphanesi</h2>
              <p className="text-xs text-gray-500">{mediaItems.length} dosya · {selected.size} seçili</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search + Upload Bar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-50 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Dosya adı ile ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div
            {...getRootProps()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer text-sm font-semibold transition-colors ${
              isDragActive
                ? 'bg-blue-100 text-blue-700 border-2 border-dashed border-blue-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{uploading ? 'Yükleniyor...' : 'Yeni Yükle'}</span>
          </div>
        </div>

        {/* Grid Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ImageIcon className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">
                {searchQuery ? 'Arama sonucunda dosya bulunamadı.' : 'Henüz yüklenmiş dosya yok.'}
              </p>
              <p className="text-xs mt-1">Yukarıdaki butonu kullanarak yeni görseller yükleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {filteredItems.map((item) => {
                const isSelected = selected.has(item.url)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                        : 'border-transparent hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Selection Check */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}

                    {/* Hover Overlay with file info */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-medium truncate">{item.fileName}</p>
                      <p className="text-white/60 text-[9px]">{formatSize(item.size)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0">
          <p className="text-xs text-gray-500">
            {selected.size > 0 ? `${selected.size} görsel seçildi` : 'Görsel seçin veya yeni yükleyin'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-500/20"
            >
              Seçilenleri Ekle ({selected.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
