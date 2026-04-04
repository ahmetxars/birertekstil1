import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { LayoutDashboard, Package, FolderOpen, FileText, Settings, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Yönetim paneline erişim izniniz yok</p>
          <Link href="/">
            <a>
              <Button>Ana Sayfa'ya Dön</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Gösterge Paneli", icon: LayoutDashboard },
    { href: "/admin/urunler", label: "Ürünler", icon: Package },
    { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderOpen },
    { href: "/admin/icerik", label: "İçerik", icon: FileText },
    { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin">
            <a className="text-xl font-bold">İlgi Tuhafiye</a>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Yönetim Paneli</p>
        </div>

        <nav className="p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-64 p-6 border-t border-gray-800">
          <div className="mb-4 pb-4 border-b border-gray-800">
            <p className="text-sm text-gray-400">Giriş Yapan</p>
            <p className="text-white font-medium">{user.name || user.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24">
        {children}
      </main>
    </div>
  );
}
