'use client'

import { useState, useEffect } from 'react'
import { getPackages, updatePackage, createPackage, deletePackage } from '@/app/actions/packages'
import { Trash2, Plus, Loader2, Save, Star, Upload } from 'lucide-react'

type Package = { 
  id: string, 
  title: string, 
  postCount: number, 
  price: string, 
  features: string, // JSON string
  thumbnailImages: string, // JSON string
  isPopular: boolean,
  order: number 
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  
  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getPackages()
      setPackages(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async () => {
    const formData = new FormData()
    formData.append('title', 'Yeni Paket')
    formData.append('postCount', '12')
    formData.append('price', '₺10,000')
    formData.append('features', JSON.stringify(['Özellik 1', 'Özellik 2']))
    formData.append('thumbnailImages', JSON.stringify([]))
    formData.append('isPopular', 'false')

    try {
      await createPackage(formData)
      await loadData()
    } catch (err) {
      alert('Oluşturulamadı')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await deletePackage(id)
    await loadData()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-fantas-dark">Paket Yönetimi</h1>
          <p className="text-fantas-text-light text-sm mt-1">Sosyal medya paketlerini buradan düzenleyebilirsiniz.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-fantas-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Paket Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-fantas-blue w-8 h-8" /></div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-fantas-border">
          <p className="text-gray-500 mb-4">Henüz paket bulunmuyor.</p>
          <button onClick={handleCreate} className="px-4 py-2 bg-fantas-blue text-white rounded-lg text-sm">İlk Paketi Oluştur</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} onDelete={() => handleDelete(pkg.id)} onUpdate={loadData} />
          ))}
        </div>
      )}
    </div>
  )
}

function PackageCard({ pkg, onDelete, onUpdate }: { pkg: Package, onDelete: () => void, onUpdate: () => void }) {
  const [title, setTitle] = useState(pkg.title)
  const [postCount, setPostCount] = useState(pkg.postCount.toString())
  const [price, setPrice] = useState(pkg.price)
  const [isPopular, setIsPopular] = useState(pkg.isPopular)
  const [features, setFeatures] = useState<string[]>(() => {
    try { return JSON.parse(pkg.features) } catch { return [] }
  })
  const [thumbnails, setThumbnails] = useState<string[]>(() => {
    try { return JSON.parse(pkg.thumbnailImages) } catch { return [] }
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleAddFeature = () => {
    setFeatures([...features, 'Yeni Özellik'])
  }

  const handleUpdateFeature = (index: number, val: string) => {
    const newF = [...features]
    newF[index] = val
    setFeatures(newF)
  }

  const handleRemoveFeature = (index: number) => {
    const newF = [...features]
    newF.splice(index, 1)
    setFeatures(newF)
  }

  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setThumbnails([...thumbnails, data.url])
      }
    } catch (err) {
      alert('Yükleme hatası')
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleRemoveThumbnail = (index: number) => {
    const newT = [...thumbnails]
    newT.splice(index, 1)
    setThumbnails(newT)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePackage(pkg.id, {
        title,
        postCount: parseInt(postCount) || 0,
        price,
        isPopular,
        features: JSON.stringify(features),
        thumbnailImages: JSON.stringify(thumbnails)
      })
      await onUpdate()
    } catch (err) {
      alert('Kaydedilirken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${isPopular ? 'border-fantas-blue ring-1 ring-fantas-blue' : 'border-fantas-border'} overflow-hidden flex flex-col`}>
      <div className={`p-4 ${isPopular ? 'bg-blue-50' : 'bg-gray-50'} border-b border-fantas-border flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPopular}
            onChange={(e) => setIsPopular(e.target.checked)}
            className="rounded border-gray-300 text-fantas-blue focus:ring-fantas-blue"
            id={`popular-${pkg.id}`}
          />
          <label htmlFor={`popular-${pkg.id}`} className="text-sm font-medium flex items-center text-fantas-dark">
            <Star className={`w-4 h-4 mr-1 ${isPopular ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
            Popüler
          </label>
        </div>
        <button onClick={onDelete} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex-1 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Paket Adı</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-lg font-bold border border-fantas-border rounded-lg focus:ring-2 focus:ring-fantas-blue outline-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Post Sayısı</label>
            <input
              type="number"
              value={postCount}
              onChange={e => setPostCount(e.target.value)}
              className="w-full px-3 py-2 border border-fantas-border rounded-lg focus:ring-2 focus:ring-fantas-blue outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Fiyat</label>
            <input
              type="text"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-fantas-border rounded-lg focus:ring-2 focus:ring-fantas-blue outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-medium text-gray-500">Özellikler</label>
            <button onClick={handleAddFeature} className="text-xs text-fantas-blue font-medium flex items-center">
              <Plus className="w-3 h-3 mr-1" /> Ekle
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-sm">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-md focus:border-fantas-blue outline-none"
                />
                <button onClick={() => handleRemoveFeature(idx)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {features.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Özellik eklenmemiş</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Görseller ({thumbnails.length})</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {thumbnails.map((url, idx) => (
              <div key={idx} className="relative flex-shrink-0 w-16 h-16 rounded-md border border-gray-200 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemoveThumbnail(idx)}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="flex-shrink-0 w-16 h-16 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-fantas-blue hover:text-fantas-blue text-gray-400 transition-colors">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              <input type="file" className="hidden" accept="image/*" onChange={handleUploadThumbnail} disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-fantas-border">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center py-2 px-4 bg-fantas-dark text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  )
}
