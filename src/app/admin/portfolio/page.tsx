'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/app/actions/portfolio'
import { Trash2, Upload, Plus, Loader2, Edit2, X, Check, Eye, FolderOpen, GripVertical } from 'lucide-react'
import MediaPicker from '@/app/admin/components/MediaPicker'

type PortfolioItem = {
  id: string
  clientName: string
  username: string
  category: string
  bio: string
  link: string
  postsCount: number
  followers: string
  following: number
  mockupImageUrl: string
  imagesJson: string
  order: number
}

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)

  // Form States
  const [clientName, setClientName] = useState('')
  const [username, setUsername] = useState('')
  const [category, setCategory] = useState('Sürücü Kursu & Sürüş Eğitimi')
  const [bioText, setBioText] = useState("🚗 Geleceğin Sürücülerini Yetiştiriyoruz\n🔑 Ehliyet Eğitimleri\n🏆 High Pass Rate\n📍 Tekirdağ")
  const [link, setLink] = useState('')
  const [postsCount, setPostsCount] = useState(120)
  const [followers, setFollowers] = useState('4.850')
  const [following, setFollowing] = useState(95)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [gridImages, setGridImages] = useState<string[]>([])

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingGrid, setUploadingGrid] = useState(false)

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'avatar' | 'grid'>('grid')

  // Drag reorder state
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await getPortfolioItems()
      setItems(data as PortfolioItem[])
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
    setClientName('')
    setUsername('')
    setCategory('Sürücü Kursu & Sürüş Eğitimi')
    setBioText("🚗 Geleceğin Sürücülerini Yetiştiriyoruz\n🔑 Ehliyet Eğitimleri\n🏆 High Pass Rate\n📍 Tekirdağ")
    setLink('')
    setPostsCount(120)
    setFollowers('4.850')
    setFollowing(95)
    setAvatarUrl('')
    setGridImages([])
  }

  // Populate edit form
  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item)
    setClientName(item.clientName)
    setUsername(item.username || '')
    setCategory(item.category || 'Sürücü Kursu')
    
    try {
      const parsedBio = JSON.parse(item.bio || '[]')
      setBioText(Array.isArray(parsedBio) ? parsedBio.join('\n') : item.bio)
    } catch {
      setBioText(item.bio || '')
    }

    setLink(item.link || '')
    setPostsCount(item.postsCount || 120)
    setFollowers(item.followers || '2.500')
    setFollowing(item.following || 75)
    setAvatarUrl(item.mockupImageUrl || '')
    
    try {
      setGridImages(JSON.parse(item.imagesJson || '[]'))
    } catch {
      setGridImages([])
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Avatar Upload Dropzone
  const onAvatarDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploadingAvatar(true)
    const formData = new FormData()
    formData.append('file', acceptedFiles[0])

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) setAvatarUrl(data.url)
      else alert(data.error || 'Yükleme başarısız')
    } catch {
      alert('Yükleme hatası')
    } finally {
      setUploadingAvatar(false)
    }
  }, [])

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps, isDragActive: isAvatarDragActive } = useDropzone({
    onDrop: onAvatarDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  })

  // Grid Images Upload Dropzone
  const onGridDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    setUploadingGrid(true)

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

    setGridImages(prev => [...prev, ...uploadedUrls])
    setUploadingGrid(false)
  }, [])

  const { getRootProps: getGridRootProps, getInputProps: getGridInputProps, isDragActive: isGridDragActive } = useDropzone({
    onDrop: onGridDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
  })

  const removeGridImage = (indexToRemove: number) => {
    setGridImages(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Drag reorder handlers
  const handleDragStart = (idx: number) => {
    setDragIndex(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === idx) return
    setGridImages(prev => {
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

  // Media Picker handlers
  const openMediaPickerForGrid = () => {
    setMediaPickerTarget('grid')
    setMediaPickerOpen(true)
  }

  const openMediaPickerForAvatar = () => {
    setMediaPickerTarget('avatar')
    setMediaPickerOpen(true)
  }

  const handleMediaSelect = (urls: string[]) => {
    if (mediaPickerTarget === 'avatar') {
      if (urls.length > 0) setAvatarUrl(urls[0])
    } else {
      setGridImages(prev => [...prev, ...urls.filter(u => !prev.includes(u))])
    }
  }

  // Form submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName) {
      alert('Marka/Müşteri adı zorunludur')
      return
    }

    setSaving(true)

    const bioLinesArray = bioText.split('\n').filter(line => line.trim() !== '')

    if (editingItem) {
      // Update existing item
      try {
        await updatePortfolioItem(editingItem.id, {
          clientName,
          username,
          category,
          bio: JSON.stringify(bioLinesArray),
          link,
          postsCount,
          followers,
          following,
          mockupImageUrl: avatarUrl,
          imagesJson: JSON.stringify(gridImages),
        })
        resetForm()
        await loadItems()
      } catch (err) {
        alert('Güncellenirken hata oluştu')
      } finally {
        setSaving(false)
      }
    } else {
      // Create new item
      const formData = new FormData()
      formData.append('clientName', clientName)
      formData.append('username', username)
      formData.append('category', category)
      formData.append('bio', JSON.stringify(bioLinesArray))
      formData.append('link', link)
      formData.append('postsCount', postsCount.toString())
      formData.append('followers', followers)
      formData.append('following', following.toString())
      formData.append('mockupImageUrl', avatarUrl)
      formData.append('imagesJson', JSON.stringify(gridImages))

      try {
        await createPortfolioItem(formData)
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
    if (!confirm('Bu markayı ve tüm Instagram bilgilerini silmek istediğinize emin misiniz?')) return
    await deletePortfolioItem(id)
    await loadItems()
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fantas-dark">Portfolyo & Instagram Mockup Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Anasayfadaki Instagram telefon mockup&apos;larında görüntülenecek markaları ve detaylarını buradan ekleyebilirsiniz.
          </p>
        </div>
      </div>
      
      {/* Form Area */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-fantas-border">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-fantas-dark flex items-center gap-2">
            {editingItem ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
            {editingItem ? `${editingItem.clientName} Markasını Düzenle` : 'Yeni Marka / Instagram Profili Ekle'}
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
          
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Marka / Kurum Adı *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                placeholder="Örn: Marmara Sürücü Kursu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instagram Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                placeholder="Örn: marmarasurucukursu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori / Slogan</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                placeholder="Örn: Sürücü Kursu & Sürüş Eğitimi"
              />
            </div>
          </div>

          {/* Stats & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gönderi Sayısı</label>
              <input
                type="number"
                value={postsCount}
                onChange={(e) => setPostsCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Takipçi Sayısı</label>
              <input
                type="text"
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                placeholder="Örn: 4.850"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Takip Edilen</label>
              <input
                type="number"
                value={following}
                onChange={(e) => setFollowing(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Web Sitesi / Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                placeholder="Örn: marmaraehliyet.com"
              />
            </div>
          </div>

          {/* Bio Text area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Instagram Biyografisi (Her satıra bir madde yazın)
            </label>
            <textarea
              rows={4}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm font-sans"
              placeholder={'🚗 Geleceğin Sürücülerini Yetiştiriyoruz\n🔑 Ehliyet Eğitimleri\n📍 Tekirdağ / Merkez'}
            />
          </div>

          {/* Avatar & Grid Images Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Avatar Dropzone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profil / Logo Görseli (Opsiyonel)</label>
              <div 
                {...getAvatarRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors h-36 flex flex-col items-center justify-center
                  ${isAvatarDragActive ? 'border-fantas-blue bg-blue-50' : 'border-gray-300 hover:border-fantas-blue hover:bg-gray-50'}`}
              >
                <input {...getAvatarInputProps()} />
                {uploadingAvatar ? (
                  <Loader2 className="animate-spin w-6 h-6 text-fantas-blue" />
                ) : avatarUrl ? (
                  <div className="relative w-20 h-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover rounded-full shadow-md border" />
                  </div>
                ) : (
                  <div className="text-gray-400 space-y-1">
                    <Upload className="w-6 h-6 mx-auto" />
                    <span className="text-xs block">Logo seçin veya sürükleyin</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={openMediaPickerForAvatar}
                className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Kütüphaneden Seç
              </button>
            </div>

            {/* Multi-Image Grid Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Instagram Gönderi Görselleri (Telefon Grid&apos;inde Gözükecek)
              </label>
              
              {/* Upload + Media Library Buttons Row */}
              <div className="flex gap-2 mb-3">
                <div 
                  {...getGridRootProps()} 
                  className={`flex-1 border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors
                    ${isGridDragActive ? 'border-fantas-blue bg-blue-50' : 'border-gray-300 hover:border-fantas-blue hover:bg-gray-50'}`}
                >
                  <input {...getGridInputProps()} />
                  {uploadingGrid ? (
                    <div className="flex items-center justify-center gap-2 text-fantas-blue">
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span className="text-xs font-semibold">Yükleniyor...</span>
                    </div>
                  ) : (
                    <div className="text-gray-500 flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium">Bilgisayardan Yükle</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={openMediaPickerForGrid}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 rounded-xl text-xs font-semibold text-indigo-700 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Kütüphaneden Seç</span>
                </button>
              </div>

              {/* Uploaded Grid Preview with drag reorder */}
              {gridImages.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500">
                      {gridImages.length} görsel · Sıralamak için sürükleyin
                    </span>
                    <button
                      type="button"
                      onClick={() => setGridImages([])}
                      className="text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors"
                    >
                      Tümünü Kaldır
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {gridImages.map((img, idx) => (
                      <div
                        key={`${img}-${idx}`}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`relative aspect-square rounded-lg overflow-hidden group border-2 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                          dragIndex === idx
                            ? 'border-blue-500 opacity-50 scale-95'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Grid ${idx}`} className="w-full h-full object-cover" />
                        
                        {/* Drag handle indicator */}
                        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/50 backdrop-blur-sm rounded p-0.5">
                            <GripVertical className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        {/* Order number */}
                        <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold rounded px-1.5 py-0.5">
                            {idx + 1}
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeGridImage(idx) }}
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
              disabled={saving || uploadingAvatar || uploadingGrid}
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
                  {editingItem ? 'Marka Bilgilerini Güncelle' : 'Markayı Kaydet ve Mockup Oluştur'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* List Existing Items */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-fantas-border">
        <h2 className="text-lg font-bold text-fantas-dark mb-6">Mevcut Markalar & Instagram Profilleri ({items.length})</h2>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-fantas-blue w-8 h-8" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Henüz marka eklenmemiş. Yukarıdaki formu kullanarak ilk markanızı ekleyebilirsiniz.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => {
              let images: string[] = []
              try { images = JSON.parse(item.imagesJson || '[]') } catch { images = [] }

              return (
                <div key={item.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fantas-blue to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow">
                          {item.clientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{item.clientName}</h3>
                          <p className="text-xs text-blue-600 font-semibold">@{item.username || 'kullanici_adi'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
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

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-gray-100 text-center mb-4 text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Gönderi</span>
                        <span className="font-bold text-gray-800">{item.postsCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Takipçi</span>
                        <span className="font-bold text-gray-800">{item.followers}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">Takip</span>
                        <span className="font-bold text-gray-800">{item.following}</span>
                      </div>
                    </div>

                    {/* Images preview */}
                    <div className="mb-2">
                      <span className="text-[11px] font-semibold text-gray-500 mb-1.5 block">Yüklü Gönderi Görselleri ({images.length})</span>
                      <div className="grid grid-cols-6 gap-1.5">
                        {images.slice(0, 6).map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-md overflow-hidden bg-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {images.length > 6 && (
                          <div className="aspect-square rounded-md bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            +{images.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                    <span>Kategori: {item.category}</span>
                    <a href="/#calismalarimiz" target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                      <Eye className="w-3.5 h-3.5" /> Anasayfada Gör
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        multiple={mediaPickerTarget === 'grid'}
        selectedUrls={mediaPickerTarget === 'grid' ? gridImages : avatarUrl ? [avatarUrl] : []}
      />
    </div>
  )
}
