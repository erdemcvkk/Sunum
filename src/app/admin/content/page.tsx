'use client'

import { useState, useEffect } from 'react'
import { getSiteContent, updateSiteContent } from '@/app/actions/content'
import { Loader2, Save } from 'lucide-react'

type ContentItem = { id: string, sectionKey: string, textValue: string | null, primaryImageUrl: string | null }

const predefinedKeys = [
  { key: 'hero_title', label: 'Hero Başlık', type: 'text' },
  { key: 'hero_subtitle', label: 'Hero Alt Başlık', type: 'textarea' },
  { key: 'about_text', label: 'Hakkımızda Metni', type: 'textarea' },
  { key: 'contact_phone', label: 'İletişim Telefon', type: 'text' },
  { key: 'contact_email', label: 'İletişim E-posta', type: 'text' },
  { key: 'contact_address', label: 'İletişim Adres', type: 'textarea' },
  { key: 'footer_text', label: 'Footer Metni', type: 'text' },
]

export default function ContentPage() {
  const [content, setContent] = useState<Record<string, ContentItem>>({})
  const [loading, setLoading] = useState(true)
  const [savingKeys, setSavingKeys] = useState<Record<string, boolean>>({})

  // Form states locally initialized from loaded content
  const [localValues, setLocalValues] = useState<Record<string, string>>({})

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getSiteContent()
      const contentMap: Record<string, ContentItem> = {}
      const valMap: Record<string, string> = {}
      
      data.forEach(item => {
        contentMap[item.sectionKey] = item
        valMap[item.sectionKey] = item.textValue || ''
      })
      
      setContent(contentMap)
      setLocalValues(valMap)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (key: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async (key: string) => {
    setSavingKeys(prev => ({ ...prev, [key]: true }))
    try {
      await updateSiteContent(key, { textValue: localValues[key] || '' })
      // Optionally show a quick success toast here
    } catch (error) {
      alert('Kaydedilirken hata oluştu')
    } finally {
      setSavingKeys(prev => ({ ...prev, [key]: false }))
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-fantas-blue w-8 h-8" /></div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-fantas-dark">Site İçerikleri</h1>
        <p className="text-fantas-text-light text-sm mt-1">Web sitesindeki sabit metinleri buradan güncelleyebilirsiniz.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-fantas-border overflow-hidden">
        <div className="divide-y divide-fantas-border">
          {predefinedKeys.map(item => {
            const val = localValues[item.key] ?? ''
            const isSaving = savingKeys[item.key]
            
            return (
              <div key={item.key} className="p-6 flex flex-col sm:flex-row gap-4 sm:items-start transition-colors hover:bg-gray-50">
                <div className="sm:w-1/3">
                  <h3 className="font-medium text-fantas-dark">{item.label}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">{item.key}</p>
                </div>
                
                <div className="sm:w-2/3 flex flex-col gap-3">
                  {item.type === 'textarea' ? (
                    <textarea
                      value={val}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-fantas-border rounded-lg focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                      placeholder={`${item.label} girin...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full px-3 py-2 border border-fantas-border rounded-lg focus:ring-2 focus:ring-fantas-blue focus:border-fantas-blue outline-none text-sm"
                      placeholder={`${item.label} girin...`}
                    />
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave(item.key)}
                      disabled={isSaving}
                      className="flex items-center px-4 py-2 bg-fantas-blue text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
