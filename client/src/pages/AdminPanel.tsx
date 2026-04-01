import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    featured: false,
  });

  // Queries
  const { data: products, isLoading: isLoadingProducts, refetch } = trpc.products.list.useQuery();

  // Mutations
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Ürün başarıyla oluşturuldu");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Ürün oluşturulamadı");
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Ürün başarıyla güncellendi");
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Ürün güncellenemedi");
    },
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Ürün başarıyla silindi");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Ürün silinemedi");
    },
  });

  // If not authenticated, show login button
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Paneli</CardTitle>
            <CardDescription>Giriş yapmanız gerekiyor</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">Giriş Yap</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not admin, show error
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erişim Reddedildi</CardTitle>
            <CardDescription>Bu sayfaya erişim yetkiniz yok</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      featured: false,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Ürün adı gereklidir");
      return;
    }

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      title: product.title,
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      featured: product.featured,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#3D2817] mb-2">Admin Paneli</h1>
          <p className="text-[#8B6F47]">Ürünleri yönetin ve düzenleyin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3D2817] mb-1">
                    Ürün Adı *
                  </label>
                  <Input
                    placeholder="Örn: Pamuklu Yatak Takımı"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3D2817] mb-1">
                    Açıklama
                  </label>
                  <Textarea
                    placeholder="Ürün hakkında kısa açıklama..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3D2817] mb-1">
                    Resim URL
                  </label>
                  <Input
                    placeholder="https://cdn.example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked === true })
                    }
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-[#3D2817] cursor-pointer">
                    Öne Çıkarılan Ürün
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#C17A5C] hover:bg-[#A86548]"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : editingId ? (
                      "Güncelle"
                    ) : (
                      "Ekle"
                    )}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      İptal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ürünler ({products?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C17A5C]" />
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-start justify-between p-3 bg-[#F5F1ED] rounded-lg border border-[#E8DFD5]"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[#3D2817]">{product.title}</h4>
                            {product.featured && (
                              <span className="text-xs bg-[#C17A5C] text-white px-2 py-1 rounded">
                                Öne Çıkartılmış
                              </span>
                            )}
                          </div>
                          {product.description && (
                            <p className="text-sm text-[#8B6F47] mt-1">{product.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#8B6F47]">Henüz ürün eklenmemiş</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
