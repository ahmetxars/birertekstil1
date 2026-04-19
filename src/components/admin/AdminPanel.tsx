'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Phone,
  MapPin,
  Mail,
  LogOut,
  MessageSquare,
  CheckCheck,
  Clock,
  RefreshCw,
  Save,
  ExternalLink,
  ChevronRight,
  Menu,
  Sparkles,
  TrendingUp,
  Eye,
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
import { useRouter } from 'next/navigation'
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
  parentId?: string | null
  parent?: { id: string; name: string; slug: string } | null
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
  viewCount: number
  category: { id: string; groupNumber: number; name: string; slug: string }
}

interface ProductFormData {
  name: string
  description: string
  image: string
  images: string[]   // ek görseller
  categoryId: string
  featured: boolean
  order: number
}

interface ContentFormData {
  heroTitle: string
  heroSubtitle: string
  aboutText: string
  seoTitle: string
  seoDescription: string
}

interface ContactMessage {
  id: string
  name: string
  phone: string
  message: string
  read: boolean
  createdAt: string
}

interface SiteSettingsData {
  whatsappNumber: string
  phone: string
  address: string
  email: string
  instagramUrl: string
  heroTitle: string
  heroSubtitle: string
  aboutText: string
}

interface SettingsFormData {
  siteName: string
  whatsappNumber: string
  phone: string
  address: string
  email: string
  instagramUrl: string
  facebookUrl: string
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
  { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
  { id: 'content', label: 'İçerik', icon: FileText },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
]

const emptyProductForm: ProductFormData = {
  name: '',
  description: '',
  image: '',
  images: [],
  categoryId: '',
  featured: false,
  order: 0,
}

const defaultContentForm: ContentFormData = {
  heroTitle: 'Birer Tekstil',
  heroSubtitle: 'Kaliteli Ev Tekstili Ürünleri | İstanbul',
  aboutText: '',
  seoTitle: 'Birer Tekstil - Ev Tekstili',
  seoDescription: 'Birer Tekstil ev tekstili ürünleri',
}

const defaultSettingsForm: SettingsFormData = {
  siteName: 'Birer Tekstil',
  whatsappNumber: '+905332423665',
  phone: '+90 533 242 36 65',
  address: 'İstanbul, Türkiye',
  email: 'info@birertekstil.com',
  instagramUrl: '',
  facebookUrl: '',
}

const tabLabels: Record<AdminTab, string> = {
  dashboard: 'Gösterge Paneli',
  products: 'Ürünler',
  categories: 'Kategoriler',
  messages: 'Gelen Mesajlar',
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

  /* ---- Bulk select state ---- */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  /* ---- Category form state ---- */
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', parentId: '' })
  const [categorySaving, setCategorySaving] = useState(false)
  const [categoryDeleteTarget, setCategoryDeleteTarget] = useState<Category | null>(null)

  /* ---- Content & Settings form state ---- */
  const [contentForm, setContentForm] = useState<ContentFormData>(defaultContentForm)
  const [contentSaving, setContentSaving] = useState(false)
  const [settingsForm, setSettingsForm] = useState<SettingsFormData>(defaultSettingsForm)
  const [settingsSaving, setSettingsSaving] = useState(false)

  /* ---- Messages state ---- */
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)

  /* ================================================================ */
  /*  Data Fetching                                                    */
  /* ================================================================ */

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, categoriesRes, settingsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      const settingsData = await settingsRes.json()
      setProducts(productsData)
      setCategories(categoriesData)
      if (settingsData && !settingsData.error) {
        setSettingsForm({
          siteName: 'Birer Tekstil',
          whatsappNumber: settingsData.whatsappNumber || '',
          phone: settingsData.phone || '',
          address: settingsData.address || '',
          email: settingsData.email || '',
          instagramUrl: settingsData.instagramUrl || '',
          facebookUrl: '',
        })
        setContentForm({
          heroTitle: settingsData.heroTitle || '',
          heroSubtitle: settingsData.heroSubtitle || '',
          aboutText: settingsData.aboutText || '',
          seoTitle: 'Birer Tekstil - Ev Tekstili',
          seoDescription: 'Birer Tekstil ev tekstili ürünleri',
        })
      }
    } catch {
      toast.error('Veriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    fetchMessages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ================================================================ */
  /*  Handlers                                                         */
  /* ================================================================ */

  const fetchMessages = async () => {
    setMessagesLoading(true)
    try {
      const res = await fetch('/api/contact')
      const data = await res.json()
      setMessages(data)
    } catch {
      toast.error('Mesajlar yüklenemedi')
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: 'PATCH' })
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m))
  }

  const handleDeleteMessage = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: 'DELETE' })
    setMessages((prev) => prev.filter((m) => m.id !== id))
    toast.success('Mesaj silindi')
  }

  const handleTabChange = (tab: AdminTab) => {
    setAdminTab(tab)
    setMobileSidebarOpen(false)
    if (tab === 'messages') fetchMessages()
  }

  const handleBackToSite = () => {
    router.push('/')
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  /* ---- Category handlers ---- */

  const slugify = (str: string) =>
    str.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const openAddCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ name: '', slug: '', description: '', parentId: '' })
    setCategoryDialogOpen(true)
  }

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat)
    setCategoryForm({ name: cat.name, slug: cat.slug, description: cat.description || '', parentId: cat.parentId || '' })
    setCategoryDialogOpen(true)
  }

  const closeCategoryDialog = () => {
    setCategoryDialogOpen(false)
    setEditingCategory(null)
    setCategoryForm({ name: '', slug: '', description: '', parentId: '' })
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      toast.error('Kategori adı zorunludur')
      return
    }
    const slug = categoryForm.slug || slugify(categoryForm.name)
    setCategorySaving(true)
    try {
      let res: Response
      if (editingCategory) {
        res = await fetch(`/api/categories/${editingCategory.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: categoryForm.name, slug, description: categoryForm.description }),
        })
      } else {
        const nextGroup = categories.length > 0
          ? Math.max(...categories.map((c) => c.groupNumber)) + 1
          : 1
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: categoryForm.name,
            slug,
            description: categoryForm.description,
            groupNumber: nextGroup,
            parentId: categoryForm.parentId || null,
          }),
        })
      }
      if (res.ok) {
        toast.success(editingCategory ? 'Kategori güncellendi' : 'Kategori oluşturuldu')
        closeCategoryDialog()
        fetchData()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Bir hata oluştu')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setCategorySaving(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!categoryDeleteTarget) return
    try {
      const res = await fetch(`/api/categories/${categoryDeleteTarget.slug}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Kategori silindi')
        setCategories((prev) => prev.filter((c) => c.id !== categoryDeleteTarget.id))
        setCategoryDeleteTarget(null)
      } else {
        const err = await res.json()
        toast.error(err.error || 'Silinirken hata oluştu')
      }
    } catch {
      toast.error('Bağlantı hatası')
    }
  }

  /* ---- Product handlers ---- */

  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm(emptyProductForm)
    setProductDialogOpen(true)
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    let parsedImages: string[] = []
    try { parsedImages = JSON.parse((product as unknown as { images?: string }).images ?? '[]') } catch { parsedImages = [] }
    setProductForm({
      name: product.name,
      description: product.description || '',
      image: product.image,
      images: parsedImages,
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
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.url) urls.push(data.url)
      }

      if (urls.length > 0) {
        setProductForm((prev) => {
          if (!prev.image) {
            // İlk görsel ana görsel olsun
            return { ...prev, image: urls[0], images: [...prev.images, ...urls.slice(1)] }
          }
          return { ...prev, images: [...prev.images, ...urls] }
        })
        toast.success(`${urls.length} görsel yüklendi`)
      } else {
        toast.error('Görsel yüklenemedi')
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
        body: JSON.stringify({
          ...productForm,
          images: JSON.stringify(productForm.images),
        }),
      })

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

  /* ---- Bulk operations ---- */

  const toggleSelectProduct = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleting(true)
    try {
      await Promise.all(
        [...selectedIds].map((id) => fetch(`/api/products/${id}`, { method: 'DELETE' }))
      )
      setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)))
      setSelectedIds(new Set())
      toast.success(`${selectedIds.size} ürün silindi`)
    } catch {
      toast.error('Toplu silme sırasında hata oluştu')
    } finally {
      setBulkDeleting(false)
    }
  }

  const handleBulkFeature = async (featured: boolean) => {
    if (selectedIds.size === 0) return
    try {
      await Promise.all(
        [...selectedIds].map((id) =>
          fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ featured }),
          })
        )
      )
      setProducts((prev) =>
        prev.map((p) => selectedIds.has(p.id) ? { ...p, featured } : p)
      )
      setSelectedIds(new Set())
      toast.success(featured ? 'Öne çıkan olarak işaretlendi' : 'Öne çıkarılandan kaldırıldı')
    } catch {
      toast.error('Toplu güncelleme sırasında hata oluştu')
    }
  }

  const handleSeed = async () => {
    try {
      const res = await fetch('/api/seed', { method: 'POST' })
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

  const handleContentSave = async () => {
    setContentSaving(true)
    try {
      const payload: Partial<SiteSettingsData> = {
        heroTitle: contentForm.heroTitle,
        heroSubtitle: contentForm.heroSubtitle,
        aboutText: contentForm.aboutText,
      }
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success('İçerik ayarları kaydedildi')
      } else {
        toast.error('Kaydedilemedi')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setContentSaving(false)
    }
  }

  const handleSettingsSave = async () => {
    setSettingsSaving(true)
    try {
      const payload: Partial<SiteSettingsData> = {
        whatsappNumber: settingsForm.whatsappNumber,
        phone: settingsForm.phone,
        address: settingsForm.address,
        email: settingsForm.email,
        instagramUrl: settingsForm.instagramUrl,
      }
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success('Site ayarları kaydedildi')
      } else {
        toast.error('Kaydedilemedi')
      }
    } catch {
      toast.error('Bağlantı hatası')
    } finally {
      setSettingsSaving(false)
    }
  }

  /* ================================================================ */
  /*  Computed                                                          */
  /* ================================================================ */

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const totalProducts = products.length
  const totalCategories = categories.length
  const totalParentCategories = categories.filter((c) => !c.parentId).length
  const totalFeatured = products.filter((p) => p.featured).length
  const totalViews = products.reduce((sum, p) => sum + (p.viewCount ?? 0), 0)
  const unreadMessages = messages.filter((m) => !m.read).length
  const topViewedProducts = [...products]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .filter((p) => (p.viewCount ?? 0) > 0)
    .slice(0, 5)

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
        label: `Kategoriler (${totalParentCategories} ana)`,
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
        label: 'Toplam Görüntülenme',
        value: totalViews.toLocaleString('tr-TR'),
        icon: Eye,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
      },
      {
        label: unreadMessages > 0 ? `${unreadMessages} okunmamış mesaj` : 'Gelen Mesajlar',
        value: unreadMessages > 0 ? unreadMessages : '—',
        icon: MessageSquare,
        color: unreadMessages > 0 ? 'text-blue-600' : 'text-[#8b7355]',
        bg: unreadMessages > 0 ? 'bg-blue-100' : 'bg-[#8b7355]/10',
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

        {/* Top Viewed Products */}
        {topViewedProducts.length > 0 && (
          <Card className="border-[#e8e0d4] bg-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-[#3d2c1e] text-base">En Çok Görüntülenen Ürünler</CardTitle>
              </div>
              <CardDescription className="text-[#8b7355]">Son güncelleme: gerçek zamanlı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topViewedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f0ebe3] transition-colors cursor-pointer"
                    onClick={() => openEditProduct(product)}
                  >
                    <span className="text-xs font-bold text-[#c4b49a] w-5 text-center shrink-0">
                      #{index + 1}
                    </span>
                    <div className="w-8 h-8 rounded bg-[#e8e0d4] overflow-hidden shrink-0 relative">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="32px" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-3 w-3 text-[#a67c52]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#3d2c1e] truncate">{product.name}</p>
                      <p className="text-xs text-[#8b7355] truncate">{product.category.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 shrink-0">
                      <Eye className="h-3.5 w-3.5" />
                      <span className="text-sm font-semibold">{(product.viewCount ?? 0).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#3d2c1e] text-white flex-wrap"
        >
          <span className="text-sm font-medium shrink-0">
            {selectedIds.size} ürün seçildi
          </span>
          <div className="flex gap-2 ml-auto flex-wrap">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBulkFeature(true)}
              className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 h-8"
            >
              <Star className="h-3.5 w-3.5 mr-1.5 fill-amber-500 text-amber-500" />
              Öne Çıkar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleBulkFeature(false)}
              className="bg-white/10 text-white hover:bg-white/20 h-8"
            >
              Normalleştir
            </Button>
            <Button
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="bg-red-500 hover:bg-red-600 text-white h-8"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              {bulkDeleting ? 'Siliniyor...' : 'Seçilenleri Sil'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              className="text-white/70 hover:text-white hover:bg-white/10 h-8"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      )}

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
                    <th className="p-4 w-10">
                      <Checkbox
                        checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Tümünü seç"
                      />
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Ürün
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-[#8b7355] uppercase tracking-wider">
                      Görüntülenme
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
                      className={`hover:bg-[#f8f5f0]/50 transition-colors ${selectedIds.has(product.id) ? 'bg-[#f8f5f0]' : ''}`}
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={() => toggleSelectProduct(product.id)}
                          aria-label={`Seç: ${product.name}`}
                        />
                      </td>
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
                        <div className="flex items-center gap-1.5 text-[#8b7355]">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="text-sm">
                            {(product.viewCount ?? 0) > 0
                              ? (product.viewCount).toLocaleString('tr-TR')
                              : <span className="text-[#c4b49a]">—</span>
                            }
                          </span>
                        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#3d2c1e]">Kategoriler</h2>
          <p className="text-sm text-[#8b7355] mt-1">
            {totalCategories} kategori listeleniyor
          </p>
        </div>
        <Button
          onClick={openAddCategory}
          className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Kategori Ekle
        </Button>
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
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe3]">
                  {categories.map((cat, i) => {
                    const isChild = !!cat.parentId
                    return (
                      <motion.tr
                        key={cat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`hover:bg-[#f8f5f0]/50 transition-colors ${isChild ? 'bg-[#faf8f5]' : ''}`}
                      >
                        <td className="p-4">
                          <span className={`text-sm font-bold ${isChild ? 'text-[#c4b49a]' : 'text-[#a67c52]'}`}>
                            {isChild ? '└' : cat.groupNumber}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-sm ${isChild ? 'text-[#8b7355] pl-4' : 'text-[#3d2c1e]'}`}>
                            {isChild && <span className="text-[#c4b49a] mr-1">↳</span>}
                            {cat.name}
                          </span>
                          {isChild && cat.parent && (
                            <span className="text-[10px] text-[#c4b49a] block pl-4 mt-0.5">
                              {cat.parent.name}
                            </span>
                          )}
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
                        <td className="p-4">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditCategory(cat)}
                              className="h-8 w-8 text-[#8b7355] hover:text-[#a67c52]"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setCategoryDeleteTarget(cat)}
                              className="h-8 w-8 text-[#8b7355] hover:text-red-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#f0ebe3]">
              {categories.map((cat) => {
                const isChild = !!cat.parentId
                return (
                  <div key={cat.id} className={`p-4 ${isChild ? 'bg-[#faf8f5] pl-8' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isChild ? 'bg-[#f0ebe3]' : 'bg-[#a67c52]/10'}`}>
                          <span className={`text-sm font-bold ${isChild ? 'text-[#c4b49a] text-base' : 'text-[#a67c52]'}`}>
                            {isChild ? '↳' : cat.groupNumber}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className={`font-medium text-sm ${isChild ? 'text-[#8b7355]' : 'text-[#3d2c1e]'}`}>
                            {cat.name}
                          </p>
                          {isChild && cat.parent && (
                            <p className="text-[10px] text-[#c4b49a]">{cat.parent.name}</p>
                          )}
                          <p className="text-xs text-[#8b7355] mt-0.5">
                            {cat.description || 'Açıklama yok'}
                          </p>
                          <Badge className="bg-[#a67c52]/10 text-[#a67c52] border-0 text-xs mt-1">
                            {cat._count?.products ?? 0} ürün
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditCategory(cat)}
                          className="h-8 w-8 text-[#8b7355] hover:text-[#a67c52]"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCategoryDeleteTarget(cat)}
                          className="h-8 w-8 text-[#8b7355] hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
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

        {/* SEO Section */}
        <Card className="border-[#e8e0d4] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3d2c1e] text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#a67c52]" />
              SEO Ayarları
            </CardTitle>
            <CardDescription className="text-[#8b7355]">
              Arama motoru optimizasyonu metinlerini düzenleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle" className="text-[#3d2c1e]">
                SEO Başlığı
              </Label>
              <Input
                id="seoTitle"
                value={contentForm.seoTitle}
                onChange={(e) =>
                  setContentForm({ ...contentForm, seoTitle: e.target.value })
                }
                placeholder="SEO başlığı"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription" className="text-[#3d2c1e]">
                SEO Açıklaması
              </Label>
              <Textarea
                id="seoDescription"
                value={contentForm.seoDescription}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    seoDescription: e.target.value,
                  })
                }
                placeholder="SEO açıklaması"
                rows={3}
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20 resize-none"
              />
              <p className="text-xs text-[#8b7355]">
                {contentForm.seoDescription.length}/160 karakter
              </p>
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
  /*  Messages Tab                                                      */
  /* ================================================================ */

  const renderMessages = () => {
    const unread = messages.filter((m) => !m.read).length

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#3d2c1e]">Gelen Mesajlar</h2>
            <p className="text-sm text-[#8b7355] mt-1">
              {unread > 0 ? `${unread} okunmamış mesaj` : 'Tüm mesajlar okundu'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchMessages}
            className="border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>

        {messagesLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-[#f0ebe3] animate-pulse" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <Card className="border-[#e8e0d4] bg-white">
            <CardContent className="py-16 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-[#e8e0d4] mb-4" />
              <p className="text-[#8b7355] font-medium">Henüz mesaj yok</p>
              <p className="text-sm text-[#c4b49a] mt-1">İletişim formundan gelen mesajlar burada görünür</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`border transition-all ${msg.read ? 'border-[#e8e0d4] bg-white' : 'border-[#a67c52]/30 bg-[#a67c52]/5'}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#a67c52]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-sm font-bold text-[#a67c52]">
                          {msg.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-[#3d2c1e]">{msg.name}</span>
                          {!msg.read && (
                            <Badge className="bg-[#a67c52] text-white text-xs border-0 px-1.5 py-0">
                              Yeni
                            </Badge>
                          )}
                          <span className="text-xs text-[#c4b49a] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(msg.createdAt).toLocaleString('tr-TR', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <a
                          href={`tel:${msg.phone}`}
                          className="text-sm text-[#a67c52] hover:underline flex items-center gap-1 mb-2"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {msg.phone}
                        </a>

                        <p className="text-sm text-[#3d2c1e] leading-relaxed bg-[#f8f5f0] rounded-lg p-3">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Merhaba ${msg.name}, mesajınızı aldım.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="w-full text-white text-xs"
                          style={{ backgroundColor: '#25D366' }}
                        >
                          <svg className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Yanıtla
                        </Button>
                      </a>

                      {!msg.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkRead(msg.id)}
                          className="w-full text-xs border-[#e8e0d4] text-[#8b7355] hover:bg-[#f0ebe3]"
                        >
                          <CheckCheck className="h-3.5 w-3.5 mr-1" />
                          Okundu
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Sil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

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
              <Label htmlFor="siteName" className="text-[#3d2c1e]">
                Site Adı
              </Label>
              <Input
                id="siteName"
                value={settingsForm.siteName}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, siteName: e.target.value })
                }
                placeholder="Site adı"
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
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card className="border-[#e8e0d4] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#3d2c1e] text-base flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#a67c52]" />
              İletişim Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-[#3d2c1e] flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                WhatsApp Numarası
              </Label>
              <Input
                id="whatsapp"
                value={settingsForm.whatsappNumber}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    whatsappNumber: e.target.value,
                  })
                }
                placeholder="+905xxxxxxxxx"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#3d2c1e] flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                Telefon
              </Label>
              <Input
                id="phone"
                value={settingsForm.phone}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, phone: e.target.value })
                }
                placeholder="Telefon numarası"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#3d2c1e] flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                Adres
              </Label>
              <Textarea
                id="address"
                value={settingsForm.address}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, address: e.target.value })
                }
                placeholder="Açık adres"
                rows={3}
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="border-[#e8e0d4] bg-white shadow-sm lg:col-span-2">
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
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-[#3d2c1e]">
                  Facebook URL
                </Label>
                <Input
                  id="facebook"
                  value={settingsForm.facebookUrl}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      facebookUrl: e.target.value,
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
                />
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
      case 'messages':
        return renderMessages()
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
        <div className="px-5 py-4 border-b border-white/10">
          <button
            onClick={handleBackToSite}
            className="flex flex-col items-start group"
          >
            <Image
              src="/logo.png"
              alt="Birer Tekstil"
              width={120}
              height={48}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-1">
              Yönetim Paneli
            </span>
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          {renderSidebarNav(handleTabChange)}
        </ScrollArea>

        {/* Back to Site + Logout */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <button
            onClick={handleBackToSite}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Ana Sayfaya Dön</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </button>
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
          <div className="px-5 py-4 border-b border-white/10">
            <button
              onClick={handleBackToSite}
              className="flex flex-col items-start"
            >
              <Image
                src="/logo.png"
                alt="Birer Tekstil"
                width={120}
                height={48}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-1">
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
            <button
              onClick={handleBackToSite}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ana Sayfaya Dön</span>
            </button>
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
                    {/* Show leaf categories (subcategories) first, then parent-only ones */}
                    {categories.filter(c => c.parentId).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        ↳ {cat.parent?.name ? `${cat.parent.name} › ` : ''}{cat.name}
                      </SelectItem>
                    ))}
                    {categories.filter(c => !c.parentId).map((cat) => (
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

            {/* Image Upload — çoklu görsel */}
            <div className="space-y-3">
              <Label className="text-[#3d2c1e]">
                Ürün Görselleri
                <span className="ml-2 text-xs text-[#8b7355] font-normal">
                  (ilk görsel ana görsel, birden fazla seçebilirsiniz)
                </span>
              </Label>

              {/* Mevcut görseller grid */}
              {(productForm.image || productForm.images.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {/* Ana görsel */}
                  {productForm.image && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#a67c52] group">
                      <Image src={productForm.image} alt="Ana görsel" fill className="object-cover" sizes="96px" />
                      <div className="absolute top-0.5 left-0.5 bg-[#a67c52] text-white text-[9px] px-1 rounded">Ana</div>
                      <button
                        onClick={() => setProductForm((p) => ({ ...p, image: p.images[0] ?? '', images: p.images.slice(1) }))}
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"
                      >
                        <X className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                      </button>
                    </div>
                  )}
                  {/* Ek görseller */}
                  {productForm.images.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#e8e0d4] group">
                      <Image src={url} alt={`Görsel ${i + 2}`} fill className="object-cover" sizes="96px" />
                      <button
                        onClick={() => setProductForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"
                      >
                        <X className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
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
                  {uploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                </Button>
                {(productForm.image || productForm.images.length > 0) && (
                  <span className="text-xs text-[#8b7355]">
                    {1 + productForm.images.length} görsel
                  </span>
                )}
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

      {/* ============================================================ */}
      {/*  Category Form Dialog                                         */}
      {/* ============================================================ */}
      <Dialog open={categoryDialogOpen} onOpenChange={(open) => !open && closeCategoryDialog()}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#3d2c1e]">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </DialogTitle>
            <DialogDescription className="text-[#8b7355]">
              {editingCategory
                ? 'Kategori bilgilerini güncelleyin.'
                : 'Yeni bir ürün kategorisi oluşturun.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cat-parent" className="text-[#3d2c1e]">
                Üst Kategori (Ana Kategori)
              </Label>
              <Select
                value={categoryForm.parentId || 'none'}
                onValueChange={(value) =>
                  setCategoryForm((prev) => ({ ...prev, parentId: value === 'none' ? '' : value }))
                }
              >
                <SelectTrigger className="border-[#e8e0d4] focus:ring-[#a67c52]/20">
                  <SelectValue placeholder="Ana kategori (üst kategori yok)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Ana Kategori (Bağımsız) —</SelectItem>
                  {categories
                    .filter((c) => !c.parentId)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.groupNumber}. {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-[#8b7355]">Bir üst kategori seçin (alt kategori) veya boş bırakın (ana kategori).</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-name" className="text-[#3d2c1e]">
                Kategori Adı <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) => {
                  const name = e.target.value
                  setCategoryForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.slug || slugify(name),
                  }))
                }}
                placeholder="Örn: Nevresim Takımları"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-slug" className="text-[#3d2c1e]">
                Slug (URL)
              </Label>
              <Input
                id="cat-slug"
                value={categoryForm.slug}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="nevresim-takimlari"
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20 font-mono text-sm"
              />
              <p className="text-xs text-[#8b7355]">URL&apos;de görünecek kısım. Boş bırakılırsa otomatik oluşturulur.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat-desc" className="text-[#3d2c1e]">
                Açıklama
              </Label>
              <Textarea
                id="cat-desc"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Kategori hakkında kısa bir açıklama..."
                rows={3}
                className="border-[#e8e0d4] focus:border-[#a67c52] focus:ring-[#a67c52]/20 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeCategoryDialog}
              className="border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3]"
            >
              İptal
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={categorySaving}
              className="bg-[#a67c52] hover:bg-[#a67c52]/90 text-white min-w-[120px]"
            >
              {categorySaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kaydediliyor...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingCategory ? 'Güncelle' : 'Kaydet'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/*  Category Delete Confirmation                                  */}
      {/* ============================================================ */}
      <AlertDialog
        open={!!categoryDeleteTarget}
        onOpenChange={(open) => !open && setCategoryDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3d2c1e]">Kategoriyi Sil</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7355]">
              <strong className="text-[#3d2c1e]">{categoryDeleteTarget?.name}</strong> adlı
              kategoriyi silmek istediğinizden emin misiniz?
              {(categoryDeleteTarget?._count?.products ?? 0) > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Bu kategoride {categoryDeleteTarget?._count?.products} ürün var. Önce ürünleri silmelisiniz.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#e8e0d4] text-[#3d2c1e] hover:bg-[#f0ebe3]">
              İptal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={(categoryDeleteTarget?._count?.products ?? 0) > 0}
              className="bg-red-600 hover:bg-red-700 text-white border-0 disabled:opacity-50"
            >
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
