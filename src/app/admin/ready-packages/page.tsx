'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  getReadyPackages,
  createReadyPackage,
  updateReadyPackage,
  deleteReadyPackage
} from '@/app/actions/ready-packages'
import {
  Trash2,
  Upload,
  Plus,
  Loader2,
  Edit2,
  X,
  Check,
  Eye,
  FolderOpen,
  GripVertical,
  Boxes,
  Tag,
  Flame
} from 'lucide-react'
import MediaPicker from '@/app/admin/components/MediaPicker'

type ReadyPackage = {
  id: string
  title: string
  description: string
  price: string
  badge: string
  imagesJson: string
  isFeatured: boolean
  isSold: boolean
  order: number
}

export default function ReadyPackagesAdminPage() {
  const [items, setItems] = useState<ReadyPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<ReadyPackage | null>(null)

  // Form States
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('1.499')
  const [badge, setBadge] = useState('Hazır Tasarım Seti')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isSold, setIsSold] = useState(false)
  const [packageImages, setPackageImages] = useState<string[]>([])

  const [uploadingImages, setUploadingImages] = useState(false)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await getReadyPackages()
      setItems(data as ReadyPackage[])
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  // Reset form
  const resetForm = () => {
    setEditingItem(null)
    setTitle('')
    setDescription('')
    setPrice('1.499')
    setBadge('Hazır Tasarım Seti')
    setIsFeatured(false)
    setIsSold(false)
    setPackageImages([])
  }

  // Populate edit form
  const handleEdit = (item: ReadyPackage) => {
    setEditingItem(item)
    setTitle(item.title)
    setDescription(item.description || '')
    setPrice(item.price || '1.499')
    setBadge(item.badge || 'Hazır Tasarım Seti')
    setIsFeatured(item.isFeatured || false)
    setIsSold(item.isSold || false)

    try {
      setPackageImages(JSON.parse(item.imagesJson || '[]'))
    } catch {
      setPackageImages([])
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Multi-Image Upload Dropzone
  const onImagesDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploadingImages(true)

    const uploadedUrls: string[] = []

    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.url) uploadedUrls.push(data.url)
      } catch {
        console.error('File upload failed', file.name)
      }
    }

    setPackageImages(prev => [...prev, ...uploadedUrls])
    setUploadingImages(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onImagesDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  })

  const removeImage = (indexToRemove: number) => {
    setPackageImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Drag reorder handlers
  const handleDragStart = (idx: number) => {
    setDragIndex(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === idx) return
    setPackageImages(prev => {
      const next = [...prev]
      const dragged = next[dragIndex]
      next.splice(dragIndex, 1)
      next.splice(idx, 0, dragged)
      return next
    })
    setDragIndex(idx)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  const handleMediaSelect = (urls: string[]) => {
    setPackageImages(prev => [...prev, ...urls.filter(u => !prev.includes(u))])
  }

  // Form submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      alert('Paket başlığı zorunludur')
      return
    }

    setSaving(true)

    if (editingItem) {
      // Update existing
      try {
        await updateReadyPackage(editingItem.id, {
          title,
          description,
          price,
          badge,
          imagesJson: JSON.stringify(packageImages),
          isFeatured,
          isSold,
        })
        resetForm()
        await loadItems()
      } catch (err) {
        alert('Güncellenirken hata oluştu')
      } finally {
        setSaving(false)
      }
    } else {
      // Create new
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('badge', badge)
      formData.append('imagesJson', JSON.stringify(packageImages))
      formData.append('isFeatured', String(isFeatured))
      formData.append('isSold', String(isSold))

      try {
        await createReadyPackage(formData)
        resetForm()
        await loadItems()
      } catch (err) {
        alert('Kaydedilirken hata oluştu')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hazır paket tasarımını silmek istediğinize emin misiniz?')) return
    await deleteReadyPackage(id)
    await loadItems()
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fantas-dark flex items-center gap-2.5">
            <Boxes className="w-7 h-7 text-fantas-blue" />
            Hazır Paket Tasarımlar Yönetimi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Doğrudan satılabilecek hazır tasarım paketlerini ekleyebilir, fiyatlandırabilir ve anasayfada sergileyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-fantas-border">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-fantas-dark flex items-center gap-2">
            {editingItem ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
            {editingItem ? `"${editingItem.title}" Paketini Düzenle` : 'Yeni Hazır Paket Tasarımı Ekle'}
          </h2>
          {editingItem && (
            <button
              onClick={resetForm}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
            >
              <X className="w-3.5 h-3.5" /> İptal Et
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Paket Tasarım Başlığı *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                placeholder="Örn: 12 Adet Ehliyet Kayıt Dönemi Sosyal Medya Şablon Seti"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fiyat (₺)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm font-bold"
                placeholder="Örn: 1.499"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Etiket / Rozet Metni</label>
              <div className="relative">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                  placeholder="Örn: ⚡ Çok Satan Paket"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Paket Açıklaması / Detaylar</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                placeholder="Örn: Sürücü kursları için özel hazırlanan yüksek dönüşümlü şablon seti."
              />
            </div>
          </div>

          {/* Fırsat Paketi & Satıldı Toggle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fırsat Paketi Toggle */}
            <div className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
              isFeatured 
                ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 shadow-md shadow-orange-200/40' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isFeatured ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-400/30' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">🔥 Fırsat Paketi Olarak Öne Çıkar</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Aktif edildiğinde bu paket en üstte vurgulanır.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 ${
                    isFeatured ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-400/30' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                    isFeatured ? 'left-7' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* Satıldı Toggle */}
            <div className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
              isSold 
                ? 'border-rose-400 bg-gradient-to-r from-rose-50 to-red-50 shadow-md shadow-rose-200/40' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isSold ? 'bg-rose-600 text-white shadow-lg shadow-rose-400/30' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">🚫 Satıldı Olarak İşaretle</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      İşaretlendiğinde paket sitede görünür ancak detay inceleme kapatılır.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSold(!isSold)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 ${
                    isSold ? 'bg-rose-600 shadow-lg shadow-rose-400/30' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                    isSold ? 'left-7' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Package Images Upload & Library Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Paket Önizleme Görselleri (Müşterilerin göreceği tasarımlar)
            </label>

            <div className="flex gap-2 mb-3">
              <div
                {...getRootProps()}
                className={`flex-1 border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-fantas-blue bg-blue-50' : 'border-gray-300 hover:border-fantas-blue hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                {uploadingImages ? (
                  <div className="flex items-center justify-center gap-2 text-fantas-blue">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span className="text-xs font-semibold">Görseller Yükleniyor...</span>
                  </div>
                ) : (
                  <div className="text-gray-500 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium">Bilgisayardan Dosya Yükle</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 rounded-xl text-xs font-semibold text-indigo-700 transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Kütüphaneden Seç</span>
              </button>
            </div>

            {/* Uploaded Images Preview Grid */}
            {packageImages.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {packageImages.length} tasarım eklendi · Sıralamak için sürükleyin
                  </span>
                  <button
                    type="button"
                    onClick={() => setPackageImages([])}
                    className="text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors"
                  >
                    Tümünü Kaldır
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {packageImages.map((img, idx) => (
                    <div
                      key={`${img}-${idx}`}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`relative aspect-[4/5] rounded-lg overflow-hidden group border-2 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                        dragIndex === idx ? 'border-blue-500 opacity-50 scale-95' : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Tasarım ${idx + 1}`} className="w-full h-full object-cover" />

                      <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 backdrop-blur-sm rounded p-0.5">
                          <GripVertical className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold rounded px-1.5 py-0.5">
                          {idx + 1}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(idx)
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {editingItem && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Vazgeç
              </button>
            )}
            <button
              type="submit"
              disabled={saving || uploadingImages}
              className="flex items-center px-6 py-2.5 bg-fantas-blue text-white font-bold rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {editingItem ? 'Paket Bilgilerini Güncelle' : 'Hazır Paketi Kaydet ve Yayınla'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List Existing Ready Packages */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-fantas-border">
        <h2 className="text-lg font-bold text-fantas-dark mb-6">Mevcut Hazır Paket Tasarımlar ({items.length})</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-fantas-blue w-8 h-8" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Henüz hazır paket tasarımı eklenmemiş. Yukarıdaki formu kullanarak ilk paketi ekleyebilirsiniz.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => {
              let images: string[] = []
              try {
                images = JSON.parse(item.imagesJson || '[]')
              } catch {
                images = []
              }

              return (
                <div key={item.id} className={`rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow ${
                  item.isFeatured 
                    ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 shadow-md' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                          {item.isFeatured && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                              <Flame className="w-3 h-3" /> FIRSAT PAKETİ
                            </span>
                          )}
                          {item.isSold && (
                            <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                              🚫 SATILDI
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-600 hover:text-fantas-blue hover:bg-white rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-[11px] font-semibold text-gray-500 mb-1.5 block">
                        Paket Tasarımları ({images.length})
                      </span>
                      <div className="grid grid-cols-6 gap-1.5">
                        {images.slice(0, 6).map((img, idx) => (
                          <div key={idx} className="aspect-[4/5] rounded-md overflow-hidden bg-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {images.length > 6 && (
                          <div className="aspect-[4/5] rounded-md bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            +{images.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
                    <span className="font-extrabold text-base text-gray-900">₺{item.price}</span>
                    <a href="/#hazir-paketler" target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                      <Eye className="w-3.5 h-3.5" /> Anasayfada Gör
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        multiple={true}
        selectedUrls={packageImages}
      />
    </div>
  )
}
