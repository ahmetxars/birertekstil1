import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Edit2, Trash2, Plus, Star } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const { data: products, refetch } = trpc.products.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const deleteProduct = trpc.products.delete.useMutation();
  const updateProduct = trpc.products.update.useMutation();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        await deleteProduct.mutateAsync({ id });
        toast.success("Ürün silindi");
        refetch();
      } catch (error) {
        toast.error("Ürün silinemedi");
      }
    }
  };

  const handleToggleFeatured = async (product: any) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        isFeatured: !product.isFeatured,
      });
      toast.success(product.isFeatured ? "Öne çıkan listesinden kaldırıldı" : "Öne çıkanlara eklendi");
      refetch();
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ürünleri Yönet</h1>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yeni Ürün Ekle
          </Button>
        </div>

        {showForm && (
          <Card className="p-6 mb-8 bg-blue-50">
            <p className="text-gray-600">
              Yeni ürün ekleme formu henüz geliştiriliyor. Lütfen daha sonra tekrar deneyin.
            </p>
          </Card>
        )}

        {/* Products Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ürün Adı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kategori</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Durum</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  const category = categories?.find((c) => c.id === product.categoryId);
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{category?.name || "-"}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            product.isFeatured
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <Star className="w-3 h-3" />
                          {product.isFeatured ? "Öne Çıkan" : "Normal"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {!products || products.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Henüz ürün eklenmemiş</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
