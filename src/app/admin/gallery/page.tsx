'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { getGalleryImages, createGalleryImage, deleteGalleryImage } from '@/app/actions/gallery'
import { getGalleryCategories, createGalleryCategory, deleteGalleryCategory } from '@/app/actions/gallery-categories'
import { Trash2, Upload, Plus, Loader2, Image as ImageIcon, Tag, Folder } from 'lucide-react'

type GalleryImage = { id: string, category: string, imageUrl: string, title: string | null, order: number }
type GalleryCategory = { id: string, name: string, order: number }

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('Tümü')
  
  // Category management state
  const [newCatName, setNewCatName] = useState('')
  const [savingCat, setSavingCat] = useState(false)

  // Image upload state
  const [selectedCategory, setSelectedCategory] = useState('')
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getGalleryImages()
      setItems(data)
      const cats = await getGalleryCategories()
      setCategories(cats)
      if (cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].name)
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setImageUrl(data.url)
      } else {
        alert(data.error || 'Yükleme başarısız')
      }
    } catch (err) {
      alert('Yükleme hatası')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) {
      alert('Görsel zorunludur')
      return
    }
    if (!selectedCategory) {
      alert('Lütfen bir kategori seçin veya önce yeni bir kategori ekleyin.')
      return
    }

    setSaving(true)
    const formData = new FormData()
    formData.append('category', selectedCategory)
    formData.append('imageUrl', imageUrl)
    if (title) formData.append('title', title)

    try {
      await createGalleryImage(formData)
      setTitle('')
      setImageUrl('')
      await loadData()
    } catch (err) {
      alert('Kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    setSavingCat(true)
    try {
      await createGalleryCategory(newCatName)
      setNewCatName('')
      await loadData()
    } catch (err: any) {
      alert(err.message || 'Kategori eklenirken hata oluştu')
    } finally {
      setSavingCat(false)
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (name === 'Sürücü Kursu') {
      alert('Varsayılan "Sürücü Kursu" kategorisi silinemez.');
      return;
    }
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz? Bu kategorideki görseller silinmez ancak kategorisi boş kalır.`)) return
    
    try {
      await deleteGalleryCategory(id)
      if (selectedCategory === name) {
        setSelectedCategory('')
      }
      await loadData()
    } catch (err) {
      alert('Kategori silinirken hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Görseli silmek istediğinize emin misiniz?')) return
    await deleteGalleryImage(id)
    await loadData()
  }

  const filteredItems = activeTab === 'Tümü' ? items : items.filter(i => i.category === activeTab)
  const displayCategories = ['Tümü', ...categories.map(c => c.name)]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fantas-dark">Galeri Yönetimi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Add Image & Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Image Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-fantas-border">
            <h2 className="text-lg font-semibold mb-4 text-fantas-dark flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-fantas-blue" /> Yeni Görsel Ekle
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-fantas-text mb-1">Kategori / Marka Adı (Zorunlu)</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-fantas-border rounded-lg focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none bg-white"
                  >
                    {categories.length === 0 ? (
                      <option value="">Kategori bulunamadı, önce ekleyin</option>
                    ) : (
                      categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-fantas-text mb-1">Başlık / Açıklama (İsteğe bağlı)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-fantas-border rounded-lg focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none"
                    placeholder="Görsel başlığı"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-fantas-text mb-1">Görsel</label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-fantas-blue bg-blue-50' : 'border-gray-300 hover:border-fantas-blue hover:bg-gray-50'}`}
                >
                  <input {...getInputProps()} />
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 text-fantas-blue">
                      <Loader2 className="animate-spin w-8 h-8" />
                      <span className="text-sm">Yükleniyor...</span>
                    </div>
                  ) : imageUrl ? (
                    <div className="relative w-full h-40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Görseli sürükleyin veya seçmek için tıklayın</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving || uploading || !selectedCategory}
                  className="flex items-center px-4 py-2 bg-fantas-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  {saving ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Category Management */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-fantas-border">
            <h2 className="text-lg font-semibold mb-4 text-fantas-dark flex items-center gap-2">
              <Folder className="w-5 h-5 text-fantas-blue" /> Kategori / Marka Yönetimi
            </h2>
            
            {/* Add Category Form */}
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Yeni kategori/marka"
                className="flex-1 px-3 py-1.5 border border-fantas-border rounded-lg text-sm focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none"
              />
              <button
                type="submit"
                disabled={savingCat || !newCatName.trim()}
                className="bg-fantas-blue hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
              >
                {savingCat ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>

            {/* Categories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors">
                  <span className="text-sm font-medium text-fantas-dark flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> {c.name}
                  </span>
                  {c.name !== 'Sürücü Kursu' && (
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Kategoriyi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Gallery Images List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-fantas-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold text-fantas-dark">Galeri Görselleri</h2>
          <div className="flex overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto space-x-2 scrollbar-hide">
            {displayCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === cat 
                    ? 'bg-fantas-dark text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-fantas-blue w-8 h-8" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center">
            <ImageIcon className="w-12 h-12 mb-3 text-gray-300" />
            <p>Bu kategoride henüz görsel bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="group relative rounded-lg overflow-hidden border border-fantas-border bg-gray-50 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt={item.title || item.category} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                  <span className="bg-fantas-blue/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">{item.category}</span>
                  <p className="text-white text-xs font-medium mb-2 text-center truncate w-full px-1">{item.title || 'Başlıksız'}</p>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors transform scale-0 group-hover:scale-100 duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
