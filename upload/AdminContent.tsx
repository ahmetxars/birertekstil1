import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminContent() {
  const { data: content } = trpc.homepage.getContent.useQuery();
  const updateContent = trpc.homepage.updateContent.useMutation();
  const [formData, setFormData] = useState({
    heroTitle: content?.heroTitle || "",
    heroSubtitle: content?.heroSubtitle || "",
    heroButtonText: content?.heroButtonText || "",
    featuredTitle: content?.featuredTitle || "",
    categoriesTitle: content?.categoriesTitle || "",
    contactTitle: content?.contactTitle || "",
    contactDescription: content?.contactDescription || "",
    whatsappCTAText: content?.whatsappCTAText || "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updateContent.mutateAsync(formData);
      toast.success("İçerik güncellendi");
    } catch (error) {
      toast.error("İçerik güncellenemedi");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ana Sayfa İçeriğini Düzenle</h1>

        <Card className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Section */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Bölümü</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Başlığı
                  </label>
                  <input
                    type="text"
                    name="heroTitle"
                    value={formData.heroTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Açıklaması
                  </label>
                  <input
                    type="text"
                    name="heroSubtitle"
                    value={formData.heroSubtitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Butonu Metni
                  </label>
                  <input
                    type="text"
                    name="heroButtonText"
                    value={formData.heroButtonText}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section Titles */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bölüm Başlıkları</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Öne Çıkan Ürünler Başlığı
                  </label>
                  <input
                    type="text"
                    name="featuredTitle"
                    value={formData.featuredTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoriler Başlığı
                  </label>
                  <input
                    type="text"
                    name="categoriesTitle"
                    value={formData.categoriesTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İletişim Başlığı
                  </label>
                  <input
                    type="text"
                    name="contactTitle"
                    value={formData.contactTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bölümü</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İletişim Açıklaması
                  </label>
                  <textarea
                    name="contactDescription"
                    value={formData.contactDescription}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp CTA</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Butonu Metni
                </label>
                <input
                  type="text"
                  name="whatsappCTAText"
                  value={formData.whatsappCTAText}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Değişiklikleri Kaydet
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}
