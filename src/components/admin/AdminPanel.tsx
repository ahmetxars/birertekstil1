'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  FileText,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Upload,
  ImageIcon,
  Star,
  X,
  Search,
  ArrowLeft,
  Home,
  Mail,
  RefreshCw,
  Save,
  ExternalLink,
  ChevronRight,
  Menu,
  Sparkles,
  TrendingUp,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { useStore, type AdminTab } from '@/store/useStore'
import { toast } from 'sonner'
import Image from 'next/image'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Category {
  id: string
  groupNumber: number
  name: string
  slug: string
  description?: string | null
  order?: number
  _count?: { products: number }
}

interface Product {
  id: string
  name: string
  description: string | null
  image: string
  categoryId: string
  featured: boolean
  order: number
  category: { id: string; groupNumber: number; name: string; slug: string }
}

interface ProductFormData {
  name: string
  description: string
  image: string
  categoryId: string
  featured: boolean
  order: number
}

interface ContentFormData {
  heroTitle: string
  heroSubtitle: string
  aboutText: string
}

interface SettingsFormData {
  whatsappNumber: string
  phone: string
  address: string
  email: string
  instagramUrl: string
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const sidebarItems: {
  id: AdminTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { id: 'dashboard', label: 'Gösterge Paneli', icon: LayoutDashboard },
  { id: 'products', label: 'Ürünler', icon: Package },
  { id: 'categories', label: 'Kategoriler', icon: FolderOpen },
  { id: 'content', label: 'İçerik', icon: FileText },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
]

const emptyProductForm: ProductFormData = {
  name: '',
  description: '',
  image: '',
  categoryId: '',
  featured: false,
  order: 0,
}

const defaultContentForm: ContentFormData = {
  heroTitle: "İstanbul'da Üreticiden Kaliteli Ev Tekstili Ürünleri",
  heroSubtitle: 'Birer Tekstil İstanbul',
  aboutText: '',
}

const defaultSettingsForm: SettingsFormData = {
  whatsappNumber: '+905332423665',
  phone: '+90 533 242 36 65',
  address: 'İstanbul, Türkiye',
  email: 'info@birertekstil.com',
  instagramUrl: '',
}

const tabLabels: Record<AdminTab, string> = {
  dashboard: 'Gösterge Paneli',
  products: 'Ürünler',
  categories: 'Kategoriler',
  content: 'İçerik Yönetimi',
  settings: 'Ayarlar',
}

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const fadeSlideVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

const sidebarItemVariants = {
  active: { x: 0, opacity: 1 },
  inactive: { x: 0, opacity: 0.7 },
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function AdminPanel() {
  const router = useRouter()
  const { adminTab, setAdminTab } = useStore()

  /* ---- Data state ---- */
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  /* ---- UI state ---- */
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [productSearch, setProductSearch] = useState('')

  /* ---- Product form state ---- */
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProductForm)
  const [productSaving, setProductSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---- Delete state ---- */
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  /* ---- Content & Settings form state ---- */
  const [contentForm, setContentForm] = useState<ContentFormData>(defaultContentForm)
  const [contentSaving, setContentSaving] = useState(false)
  const [settingsForm, setSettingsForm] = useState<SettingsFormData>(defaultSettingsForm)
  const [settingsSaving, setSettingsSaving] = useState(false)

  /* ================================================================ */
  /*  Data Fetching                                                    */
  /* ================================================================ */

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/site-settings'),
      ])

      if ([productsRes, categoriesRes, settingsRes].some((response) => response.status === 401)) {
        router.push('/giris?next=/yonetim')
        return
      }

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const settingsData = await settingsRes.json()
      setProducts(productsData)
      setCategories(categoriesData)
      setContentForm({
        heroTitle: settingsData.heroTitle || defaultContentForm.heroTitle,
        heroSubtitle: settingsData.heroSubtitle || defaultContentForm.heroSubtitle,
        aboutText: settingsData.aboutText || '',
      })
      setSettingsForm({
        whatsappNumber: settingsData.whatsappNumber || defaultSettingsForm.whatsappNumber,
        phone: settingsData.phone || defaultSettingsForm.phone,
        address: settingsData.address || defaultSettingsForm.address,
        email: settingsData.email || defaultSettingsForm.email,
        instagramUrl: settingsData.instagramUrl || '',
      })
    } catch {
      toast.error('Veriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  /* ================================================================ */
  /*  Handlers                                                         */
  /* ================================================================ */

  const handleTabChange = (tab: AdminTab) => {
    setAdminTab(tab)
    setMobileSidebarOpen(false)
  }

  const handleBackToSite = () => {
    router.push('/')
  }

  /* ---- Product handlers ---- */

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm(emptyProductForm)
    setProductDialogOpen(true)
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      image: product.image,
      categoryId: product.categoryId,
      featured: product.featured,
      order: product.order,
    })
    setProductDialogOpen(true)
  }

  const closeProductDialog = () => {
    setProductDialogOpen(false)
    setEditingProduct(null)
    setProductForm(emptyProductForm)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.status === 401) {
        router.push('/giris?next=/yonetim')
        return
      }
      const data = await res.json()
      if (data.url) {
        setProductForm((prev) => ({ ...prev, image: data.url }))
        toast.success('Resim başarıyla yüklendi')
      } else {
        toast.error('Resim yüklenirken hata oluştu')
      }
    } catch {
      toast.error('Dosya yüklenirken hata oluştu')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleProductSave = async () => {
    if (!productForm.name || !productForm.categoryId) {
      toast.error('Ürün adı ve kategori zorunludur')
      return
    }

    setProductSaving(true)
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      })

      if (res.status === 401) {
        router.push('/giris?next=/yonetim')
        return
      }

      if (res.ok) {
        toast.success(editingProduct ? 'Ürün güncellendi' : 'Ürün oluşturuldu')
        closeProductDialog()
        fetchData()
      } else {
        toast.error('Bir hata oluştu')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setProductSaving(false)
    }
  }

  const handleProductDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (res.status === 401) {
        router.push('/giris?next=/yonetim')
        return
      }
      if (res.ok) {
        toast.success('Ürün silindi')
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        setDeleteTarget(null)
      } else {
        toast.error('Silinirken hata oluştu')
      }
    } catch {
      toast.error('Bağlantı hatası')
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured }),
      })
      if (res.status === 401) {
        router.push('/giris?next=/yonetim')
        return
      }
      if (res.ok) {
        toast.success(
          product.featured
            ? 'Öne çıkarıldan kaldırıldı'
            : 'Öne çıkan olarak işaretlendi'
        )
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, featured: !p.featured } : p
          )
        )
      }
    } catch {
      toast.error('Güncellenirken hata oluştu')
    }
  }

  const handleSeed = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
      if (res.status === 401) {
        router.push('/giris?next=/yonetim')
        return
      }
      if (res.ok) {
        toast.success('Veriler başarıyla yenilendi')
        fetchData()
      } else {
        toast.error('Veriler yenilenirken hata oluştu')
      }
    } catch {
      toast.error('Bağlantı hatası')
    }
  }

  /* ---- Content & Settings handlers ---- */

  const handleContentSave = () => {
    return handleSettingsPersist('İçerik ayarları kaydedildi', setContentSaving)
  }

  const handleSettingsSave = () => {
    return handleSettingsPersist('Site ayarları kaydedildi', setSettingsSaving)
  }

  const handleSettingsPersist = async (
    successMessage: string,
    setSaving: (value: boolean) => void
  ) => {
    setSaving(true)
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contentForm,
          ...settingsForm,
        }),
      })

      if (res.status === 401) {
        router.push('/giris?next=/yonetim')
        return
      }

      if (res.ok) {
        toast.success(successMessage)
      } else {
        toast.error('Ayarlar kaydedilirken hata oluştu')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/giris')
    router.refresh()
  }

  /* ================================================================ */
  /*  Computed                                                          */
  /* ================================================================ */

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const totalProducts = products.length
  const totalCategories = categories.length
  const totalFeatured = products.filter((p) => p.featured).length

  /* ================================================================ */
  /*  Sidebar Content (shared between desktop & mobile sheet)          */
  /* ================================================================ */

  const renderSidebarNav = (onItemClick: (tab: AdminTab) => void) => (
    <nav className="flex flex-col gap-1 px-3">
      {sidebarItems.map((item) => {
        const isActive = adminTab === item.id
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/60 hover:bg-white/8 hover:text-white/90'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="ml-auto h-2 w-2 rounded-full bg-[#a67c52]"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )

  /* ================================================================ */
  /*  Loading Skeleton                                                  */
  /* ================================================================ */

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )

  /* ================================================================ */
  /*  Dashboard Tab                                                     */
  /* ================================================================ */

  const renderDashboard = () => {
    const statCards = [
      {
        label: 'Toplam Ürün',
        value: totalProducts,
        icon: Package,
        color: 'text-[#a67c52]',
        bg: 'bg-[#a67c52]/10',
      },
      {
        label: 'Kategoriler',
        value: totalCategories,
        icon: FolderOpen,
        color: 'text-[#8b7355]',
        bg: 'bg-[#8b7355]/10',
      },
      {
        label: 'Öne Çıkan',
        value: totalFeatured,
        icon: Star,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
      },
      {
        label: 'Lead Kanalı',
        value: 'WA',
        icon: TrendingUp,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
      },
    ]

    const quickActions = [
      { label: 'Ürün Ekle', icon: Plus, tab: 'products' as AdminTab, action: openAddProduct },
      { label: 'Ürünleri Görüntüle', icon: Package, tab: 'products' as AdminTab },
      { label: 'Kategorileri Görüntüle', icon: FolderOpen, tab: 'categories' as AdminTab },
      { label: 'Site Ayarları', icon: Settings, tab: 'settings' as AdminTab },
    ]

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-[#3d2c1e]">Gösterge Paneli</h2>
          <p className="text-sm text-[#8b7355] mt-1">
            Sitenizin genel durumuna göz atın
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border-[#e8e0d4] bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 lg:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-[#3d2c1e]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#8b7355] mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="border-[#e8e0d4] bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#3d2c1e] text-base">
                Hızlı İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    onClick={() => {
                      if (action.action) {
                        action.action()
                      }
                      if (action.tab === 'products' && !action.action) {
                        setAdminTab('products')
                      } else if (action.tab !== 'products') {
                        setAdminTab(action.tab)
                      }
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-lg text-left hover:bg-[#f0ebe3] transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-[#a67c52]/10 group-hover:bg-[#a67c52]/20 transition-colors">
                      <Icon className="h-4 w-4 text-[#a67c52]" />
                    </div>
                    <span className="text-sm font-medium text-[#3d2c1e]">
                      {action.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#c4b49a] ml-auto" />
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="border-[#e8e0d4] bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#3d2c1e] text-base">
                Sistem Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b7355]">Sürüm</span>
                <Badge variant="outline" className="border-[#e8e0d4] text-[#3d2c1e]">
                  v1.0.0
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b7355]">Veritabanı</span>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                  Aktif
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8b7355]">Son Yedekleme</span>
                <span className="text-sm text-[#3d2c1e]">Bugün</span>
              </div>
              <Separator />
              <Button
                variant="outline"
                onClick={handleSeed}
                className="w-full border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3] hover:border-[#a67c52]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Verileri Yenile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        {products.length > 0 && (
          <Card className="border-[#e8e0d4] bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#3d2c1e] text-base">
                  Son Eklenen Ürünler
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAdminTab('products')}
                  className="text-[#a67c52] hover:text-[#a67c52]/80"
                >
                  Tümünü Gör
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f5f0] hover:bg-[#f0ebe3] transition-colors cursor-pointer"
                    onClick={() => openEditProduct(product)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#e8e0d4] overflow-hidden shrink-0 relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-[#a67c52]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#3d2c1e] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#8b7355] truncate">
                        {product.category.name}
                      </p>
                    </div>
                    {product.featured && (
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  /* ================================================================ */
  /*  Products Tab                                                      */
  /* ================================================================ */

  const renderProducts = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#3d2c1e]">Ürünler</h2>
          <p className="text-sm text-[#8b7355] mt-1">
            {totalProducts} ürün listeleniyor
          </p>
        </div>
        <Button
          onClick={openAddProduct}
          className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white shadow-sm w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ürün Ekle
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b7355]" />
        <Input
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder="Ürün adı ile ara..."
          className="pl-10 border-[#e8e0d4] bg-white focus:border-[#a67c52] focus:ring-[#a67c52]/20"
        />
        {productSearch && (
          <button
            onClick={() => setProductSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b7355] hover:text-[#3d2c1e]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Product List */}
      <Card className="border-[#e8e0d4] bg-white shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-[#e8e0d4] mb-4" />
            <p className="text-[#8b7355] font-medium">
              {productSearch ? 'Aramanızla eşleşen ürün bulunamadı' : 'Henüz ürün eklenmemiş'}
            </p>
            {!productSearch && (
              <Button
                onClick={openAddProduct}
                variant="outline"
                className="mt-4 border-[#a67c52] text-[#a67c52] hover:bg-[#a67c52]/5"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Ürünü Ekle
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e8e0d4] bg-[#f8f5f0]/80">
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Ürün
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="text-right p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe3]">
                  {filteredProducts.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-[#f8f5f0]/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-[#f0ebe3] overflow-hidden shrink-0 relative">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-[#a67c52]" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#3d2c1e] text-sm truncate max-w-[200px]">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-xs text-[#8b7355] truncate max-w-[200px] mt-0.5">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="border-[#e8e0d4] text-[#8b7355] text-xs bg-[#f8f5f0]"
                        >
                          {product.category.groupNumber}. {product.category.name}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className="inline-flex items-center gap-1.5"
                        >
                          {product.featured ? (
                            <Badge className="bg-amber-100 text-amber-700 text-xs border-0 hover:bg-amber-200 transition-colors">
                              <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                              Öne Çıkan
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-[#e8e0d4] text-[#8b7355] text-xs hover:border-[#a67c52] transition-colors cursor-pointer"
                            >
                              Normal
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditProduct(product)}
                            className="h-8 w-8 text-[#8b7355] hover:text-[#a67c52] hover:bg-[#a67c52]/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(product)}
                            className="h-8 w-8 text-[#8b7355] hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#f0ebe3]">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-16 h-16 rounded-lg bg-[#f0ebe3] overflow-hidden shrink-0 relative cursor-pointer"
                      onClick={() => openEditProduct(product)}
                    >
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-[#a67c52]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-medium text-[#3d2c1e] text-sm truncate cursor-pointer hover:text-[#a67c52] transition-colors"
                        onClick={() => openEditProduct(product)}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs text-[#8b7355] mt-0.5">
                        {product.category.groupNumber}. {product.category.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleToggleFeatured(product)}>
                          {product.featured ? (
                            <Badge className="bg-amber-100 text-amber-700 text-xs border-0">
                              <Star className="h-2.5 w-2.5 mr-1 fill-amber-500 text-amber-500" />
                              Öne Çıkan
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs border-[#e8e0d4] text-[#8b7355]"
                            >
                              Normal
                            </Badge>
                          )}
                        </button>
                        <div className="ml-auto flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditProduct(product)}
                            className="h-7 w-7 text-[#8b7355] hover:text-[#a67c52]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(product)}
                            className="h-7 w-7 text-[#8b7355] hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )

  /* ================================================================ */
  /*  Categories Tab                                                    */
  /* ================================================================ */

  const renderCategories = () => (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#3d2c1e]">Kategoriler</h2>
        <p className="text-sm text-[#8b7355] mt-1">
          {totalCategories} kategori listeleniyor
        </p>
      </div>

      {/* Categories Table */}
      <Card className="border-[#e8e0d4] bg-white shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-[#e8e0d4] mb-4" />
            <p className="text-[#8b7355] font-medium">Henüz kategori bulunmuyor</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e8e0d4] bg-[#f8f5f0]/80">
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      #
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Kategori Adı
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="text-right p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Ürün Sayısı
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe3]">
                  {categories.map((cat, i) => (
                    <motion.tr
                      key={cat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-[#f8f5f0]/50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="text-sm font-bold text-[#a67c52]">
                          {cat.groupNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-[#3d2c1e] text-sm">
                          {cat.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <code className="text-xs text-[#8b7355] bg-[#f8f5f0] px-2 py-1 rounded">
                          {cat.slug}
                        </code>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-[#8b7355] truncate max-w-[200px] block">
                          {cat.description || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Badge className="bg-[#a67c52]/10 text-[#a67c52] border-0 text-xs">
                          {cat._count?.products ?? 0} ürün
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#f0ebe3]">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#a67c52]/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-[#a67c52]">
                          {cat.groupNumber}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#3d2c1e] text-sm">
                          {cat.name}
                        </p>
                        <p className="text-xs text-[#8b7355] mt-0.5">
                          {cat.description || 'Açıklama yok'}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-[#a67c52]/10 text-[#a67c52] border-0 text-xs shrink-0">
                      {cat._count?.products ?? 0}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )

  /* ================================================================ */
  /*  Content Tab                                                       */
  /* ================================================================ */

  const renderContent = () => (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#3d2c1e]">İçerik Yönetimi</h2>
        <p className="text-sm text-[#8b7355] mt-1">
          Ana sayfa ve genel içerik ayarlarını düzenleyin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <Card className="border-[#e8e0d4] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3d2c1e] text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#a67c52]" />
              Hero Bölümü
            </CardTitle>
            <CardDescription className="text-[#8b7355]">
              Ana sayfa hero bölümü metinlerini düzenleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle" className="text-[#3d2c1e]">
                Ana Başlık
              </Label>
              <Input
                id="heroTitle"
                value={contentForm.heroTitle}
                onChange={(e) =>
                  setContentForm({ ...contentForm, heroTitle: e.target.value })
                }
                placeholder="Ana başlık"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle" className="text-[#3d2c1e]">
                Alt Başlık
              </Label>
              <Input
                id="heroSubtitle"
                value={contentForm.heroSubtitle}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    heroSubtitle: e.target.value,
                  })
                }
                placeholder="Alt başlık"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card className="border-[#e8e0d4] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#3d2c1e] text-base">Hakkımızda Metni</CardTitle>
          <CardDescription className="text-[#8b7355]">
            Sitenizde görüntülenecek hakkımızda metnini düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={contentForm.aboutText}
            onChange={(e) =>
              setContentForm({ ...contentForm, aboutText: e.target.value })
            }
            placeholder="Hakkımızda metnini buraya yazın..."
            rows={6}
            className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20 resize-none"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleContentSave}
          disabled={contentSaving}
          className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white min-w-[140px]"
        >
          {contentSaving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Kaydediliyor...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Kaydet
            </span>
          )}
        </Button>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  Settings Tab                                                      */
  /* ================================================================ */

  const renderSettings = () => (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#3d2c1e]">Ayarlar</h2>
        <p className="text-sm text-[#8b7355] mt-1">
          Genel site ayarlarını ve iletişim bilgilerini düzenleyin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="border-[#e8e0d4] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3d2c1e] text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-[#a67c52]" />
              Genel Ayarlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber" className="text-[#3d2c1e]">
                WhatsApp Numarası
              </Label>
              <Input
                id="whatsappNumber"
                value={settingsForm.whatsappNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                }
                placeholder="+905xxxxxxxxx"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#3d2c1e]">
                Telefon Numarası
              </Label>
              <Input
                id="phone"
                value={settingsForm.phone}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, phone: e.target.value })
                }
                placeholder="+90 5xx xxx xx xx"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#3d2c1e] flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                value={settingsForm.email}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, email: e.target.value })
                }
                placeholder="E-posta adresi"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#3d2c1e]">
                Adres
              </Label>
              <Textarea
                id="address"
                value={settingsForm.address}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, address: e.target.value })
                }
                placeholder="İstanbul, Türkiye"
                rows={3}
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="border-[#e8e0d4] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3d2c1e] text-base flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-[#a67c52]" />
              Sosyal Medya
            </CardTitle>
            <CardDescription className="text-[#8b7355]">
              Sosyal medya hesap bağlantılarınızı ekleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-[#3d2c1e]">
                  Instagram URL
                </Label>
                <Input
                  id="instagram"
                  value={settingsForm.instagramUrl}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      instagramUrl: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
                />
              </div>
              <div className="rounded-2xl border border-dashed border-[#e8e0d4] p-4 bg-[#f8f5f0]">
                <p className="text-sm font-medium text-[#3d2c1e] mb-1">SEO Notu</p>
                <p className="text-sm text-[#8b7355]">
                  Sayfa başlıkları, açıklamalar, sitemap ve canonical yapısı artık otomatik
                  üretiliyor. Bu alanda ekstra işlem yapmanız gerekmiyor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSettingsSave}
          disabled={settingsSaving}
          className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white min-w-[140px]"
        >
          {settingsSaving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Kaydediliyor...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Kaydet
            </span>
          )}
        </Button>
      </div>
    </div>
  )

  /* ================================================================ */
  /*  Tab Content Router                                                */
  /* ================================================================ */

  const renderTabContent = () => {
    switch (adminTab) {
      case 'dashboard':
        return renderDashboard()
      case 'products':
        return renderProducts()
      case 'categories':
        return renderCategories()
      case 'content':
        return renderContent()
      case 'settings':
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  /* ================================================================ */
  /*  Main JSX Return                                                   */
  /* ================================================================ */

  return (
    <div className="min-h-screen flex bg-[#f8f5f0]">
      {/* ============================================================ */}
      {/*  Desktop Sidebar                                               */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:w-64 bg-[#3d2c1e] z-40">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <button
            onClick={handleBackToSite}
            className="flex flex-col items-start group"
          >
            <span className="text-xl font-bold text-[#a67c52] tracking-wide group-hover:text-[#c49a6c] transition-colors">
              Birer Tekstil
            </span>
            <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-0.5">
              Yönetim Paneli
            </span>
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          {renderSidebarNav(handleTabChange)}
        </ScrollArea>

        {/* Back to Site */}
        <div className="p-4 border-t border-white/10">
          <div className="space-y-2">
            <button
              onClick={handleBackToSite}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ana Sayfaya Dön</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/*  Mobile Sidebar Sheet                                          */}
      {/* ============================================================ */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-72 bg-[#3d2c1e] text-white border-none p-0 [&>button]:text-white/60 [&>button]:hover:text-white"
        >
          <SheetTitle className="sr-only">Yönetim Menüsü</SheetTitle>

          {/* Brand */}
          <div className="px-5 py-5 border-b border-white/10">
            <button
              onClick={handleBackToSite}
              className="flex flex-col items-start"
            >
              <span className="text-xl font-bold text-[#a67c52] tracking-wide">
                Birer Tekstil
              </span>
              <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-0.5">
                Yönetim Paneli
              </span>
            </button>
          </div>

          {/* Navigation */}
          <div className="py-4">
            {renderSidebarNav(handleTabChange)}
          </div>

          {/* Back to Site */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <div className="space-y-2">
              <button
                onClick={handleBackToSite}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Ana Sayfaya Dön</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ============================================================ */}
      {/*  Main Content Area                                             */}
      {/* ============================================================ */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#e8e0d4] px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(true)}
              className="text-[#3d2c1e] hover:bg-[#f0ebe3] h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm font-semibold text-[#3d2c1e]">
                {tabLabels[adminTab]}
              </p>
              <p className="text-[10px] text-[#8b7355]">Birer Tekstil</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToSite}
            className="text-[#8b7355] hover:text-[#a67c52] hover:bg-[#f0ebe3] h-9 w-9"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 xl:p-8">
          {loading ? (
            renderLoadingSkeleton()
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={adminTab}
                variants={fadeSlideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Product Add/Edit Dialog                                       */}
      {/* ============================================================ */}
      <Dialog open={productDialogOpen} onOpenChange={(open) => !open && closeProductDialog()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#3d2c1e]">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </DialogTitle>
            <DialogDescription className="text-[#8b7355]">
              {editingProduct
                ? 'Ürün bilgilerini güncelleyin'
                : 'Yeni bir ürün eklemek için formu doldurun'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-name" className="text-[#3d2c1e]">
                  Ürün Adı <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="prod-name"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  placeholder="Ürün adını giriniz"
                  className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#3d2c1e]">
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={productForm.categoryId}
                  onValueChange={(value) =>
                    setProductForm({ ...productForm, categoryId: value })
                  }
                >
                  <SelectTrigger className="border-[#e8e0d4] focus:ring-[#a67c52]/20">
                    <SelectValue placeholder="Kategori seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.groupNumber}. {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="prod-desc" className="text-[#3d2c1e]">
                Açıklama
              </Label>
              <Textarea
                id="prod-desc"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({ ...productForm, description: e.target.value })
                }
                placeholder="Ürün açıklamasını giriniz"
                rows={3}
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label className="text-[#3d2c1e]">Ürün Görseli</Label>
              {productForm.image ? (
                <div className="relative w-full max-w-[240px] h-48 rounded-xl overflow-hidden border border-[#e8e0d4] group">
                  <Image
                    src={productForm.image}
                    alt="Ürün görseli"
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <button
                      onClick={() =>
                        setProductForm({ ...productForm, image: '' })
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[240px] h-48 rounded-xl border-2 border-dashed border-[#e8e0d4] flex items-center justify-center hover:border-[#a67c52]/40 transition-colors">
                  <div className="text-center">
                    <ImageIcon className="h-10 w-10 mx-auto text-[#c4b49a] mb-2" />
                    <p className="text-xs text-[#8b7355]">Henüz görsel yüklenmedi</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="border-[#e8e0d4] hover:bg-[#f0ebe3] hover:border-[#a67c52]"
                >
                  {uploading ? (
                    <span className="h-4 w-4 border-2 border-[#a67c52]/30 border-t-[#a67c52] rounded-full animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
                </Button>
              </div>
            </div>

            {/* Featured & Order */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="featured"
                  checked={productForm.featured}
                  onCheckedChange={(checked) =>
                    setProductForm({
                      ...productForm,
                      featured: checked === true,
                    })
                  }
                  className="border-[#e8e0d4] data-[state=checked]:bg-[#a67c52] data-[state=checked]:border-[#a67c52]"
                />
                <Label
                  htmlFor="featured"
                  className="flex items-center gap-1.5 cursor-pointer text-[#3d2c1e]"
                >
                  <Star className="h-4 w-4 text-amber-500" />
                  Öne Çıkan Ürün
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="order" className="text-[#3d2c1e] text-sm whitespace-nowrap">
                  Sıra:
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={productForm.order}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-20 border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={closeProductDialog}
              className="border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3]"
            >
              İptal
            </Button>
            <Button
              onClick={handleProductSave}
              disabled={productSaving}
              className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white min-w-[120px]"
            >
              {productSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kaydediliyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingProduct ? 'Güncelle' : 'Kaydet'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/*  Delete Confirmation Dialog                                     */}
      {/* ============================================================ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3d2c1e]">Ürünü Sil</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7355]">
              <strong className="text-[#3d2c1e]">{deleteTarget?.name}</strong> adlı ürünü
              silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3]">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProductDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
