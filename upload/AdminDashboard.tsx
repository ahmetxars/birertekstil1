import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, FolderOpen, Award } from "lucide-react";

export default function AdminDashboard() {
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products } = trpc.products.list.useQuery();
  const { data: settings } = trpc.settings.get.useQuery();

  const stats = [
    {
      label: "Toplam Ürün",
      value: products?.length || 0,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Kategoriler",
      value: categories?.length || 0,
      icon: FolderOpen,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Deneyim Yılı",
      value: settings?.experienceYears || 0,
      icon: Award,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gösterge Paneli</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`p-6 ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <Icon className="w-12 h-12 opacity-20" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Links */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hızlı Erişim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/urunler"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Ürünleri Yönet</p>
              <p className="text-sm text-gray-600 mt-1">Ürün ekle, düzenle veya sil</p>
            </a>
            <a
              href="/admin/kategoriler"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Kategorileri Yönet</p>
              <p className="text-sm text-gray-600 mt-1">Kategori adı ve sırasını değiştir</p>
            </a>
            <a
              href="/admin/icerik"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium text-gray-900">İçeriği Düzenle</p>
              <p className="text-sm text-gray-600 mt-1">Ana sayfa başlık ve açıklamalarını değiştir</p>
            </a>
            <a
              href="/admin/ayarlar"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <p className="font-medium text-gray-900">Site Ayarları</p>
              <p className="text-sm text-gray-600 mt-1">Logo, iletişim bilgileri ve daha fazlası</p>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
