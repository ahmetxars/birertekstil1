import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowUp, ArrowDown, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const { data: categories, refetch } = trpc.categories.list.useQuery();
  const updateCategory = trpc.categories.update.useMutation();

  const handleReorder = async (category: any, direction: "up" | "down") => {
    const currentOrder = category.displayOrder;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    try {
      await updateCategory.mutateAsync({
        id: category.id,
        displayOrder: newOrder,
      });
      toast.success("Kategori sırası güncellendi");
      refetch();
    } catch (error) {
      toast.error("Sıra güncellenemedi");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategorileri Yönet</h1>

        {/* Categories Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kategori Adı</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Açıklama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sıra</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{category.name}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.displayOrder}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReorder(category, "up")}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Yukarı Taşı"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReorder(category, "down")}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Aşağı Taşı"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Düzenle">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {!categories || categories.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Henüz kategori eklenmemiş</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
