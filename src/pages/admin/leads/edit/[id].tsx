'use client';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Mail, Phone, Bed, Bath, Tag, AudioLines, Save, Plus,
  MapPin, DollarSign, TrendingUpDown, HandCoins } from "lucide-react";

export default function EditLeadPage(props) {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (id) {
      fetch(`/api/admin/leads/${id}`)
        .then(res => res.json())
        .then(data => {
          setForm(data);
          setTags(Array.isArray(data.tags) ? data.tags.map((t: any) => ({ id: t.id, name: t.name })) : []);
        });
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let audioUrl = form.audioFileUrl;

    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("leadType", form.leadType || "BUYER");

      const uploadRes = await fetch("/api/upload/audio", { method: "POST", body: formData });
      const result = await uploadRes.json();
      if (result.url) audioUrl = result.url;
    }

    const { tags: _ignored, ...formWithoutTags } = form;
    const updatedForm = {
      ...formWithoutTags,
      audioFileUrl: audioUrl,
      beds: parseFloat(form.beds || 0),
      baths: parseFloat(form.baths || 0),
      preApproved: form.preApproved === "true" || form.preApproved === true,
      hasRealtor: form.hasRealtor === "true" || form.hasRealtor === true,
      price: parseFloat(form.price || 0),
    };

    delete updatedForm.createdAt;
    delete updatedForm.updatedAt;
    delete updatedForm.deletedAt;

    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedForm),
    });

    if (res.ok) router.push(`/admin/leads/view/${id}`);
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    const res = await fetch(`/api/admin/leads/${id}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag.trim() }),
    });
    if (res.ok) {
      const result = await res.json();
      if (result.tag) setTags(prev => [...prev, result.tag]);
      setNewTag("");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    const res = await fetch(`/api/admin/leads/${id}/tags/${tagId}`, { method: "DELETE" });
    if (res.ok) setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const renderInputField = (key: string, value: any) => {
  const handleChange = (e: any) => setForm({ ...form, [key]: e.target.value });

  const inputWithIcon = (Icon: React.ElementType, type: string = "text", placeholder = "") => (
  <div key={key} className="border border-[#D1D5DC] rounded p-3 bg-gray-50">
    <label className="text-[13px] font-semibold text-gray-800 mb-2 block capitalize">
      {key.replace(/([A-Z])/g, ' $1')}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type={type}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm bg-white"
      />
    </div>
  </div>
);


  // Specialized fields
  if (key === "email") return inputWithIcon(Mail, "email");
  if (key === "contact") return inputWithIcon(Phone, "tel");
  if (key === "beds") return inputWithIcon(Bed, "number");
  if (key === "baths") return inputWithIcon(Bath, "number");
  if (key === "price") return inputWithIcon(DollarSign, "number");
  if (key === "priceRange") return inputWithIcon(TrendingUpDown, "text");
  if (key === "paymentMethod") return inputWithIcon(HandCoins, "text");
  if (key === "desireArea") return inputWithIcon(MapPin, "text", "Search or choose on map");

  // Boolean fields - styled as toggles, no wrapper
  if (key === "preApproved" || key === "hasRealtor") {
    return (
      <div key={key} className="flex items-center gap-3">
        <label className="text-[13px] font-semibold text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
        <input
          type="checkbox"
          checked={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
          className="scale-125 accent-green-600"
        />
      </div>
    );
  }

  // Multiline fields
  if (key === "notes" || key === "specialReq") {
    return (
      <div key={key} className="border border-[#D1D5DC] rounded p-3 bg-gray-50 col-span-full">
        <label className="text-[13px] font-semibold text-gray-800 mb-2 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
        <textarea
          rows={4}
          value={value || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
        />
      </div>
    );
  }

  // Fallback input
  return (
    <div key={key} className="border border-[#D1D5DC] rounded p-3 bg-gray-50">
      <label className="text-[13px] font-semibold text-gray-800 mb-2 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
      <input
        type="text"
        value={value || ""}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
      />
    </div>
  );
};



  const IconInput = ({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder = "",
}: {
  icon: React.ElementType;
  type?: string;
  value: any;
  onChange: (e: any) => void;
  placeholder?: string;
}) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm bg-white"
    />
  </div>
);


  if (!form) return <AdminLayout><p className="p-6">Loading...</p></AdminLayout>;
  if (!isClient) return null;

  const groupedFields = {
    'Client Information': ['name', 'contact', 'email'],
    'Property Information': ['propertyType', 'beds', 'baths', 'desireArea'],
    'Price & Timeline': ['price', 'priceRange', 'paymentMethod', 'timeline', 'preApproved'],
    'Additional Info': ['hasRealtor', 'specialReq', 'notes'],
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-semibold bg-[radial-gradient(190.64%_199.6%_at_-3.96%_130%,#3A951B_0%,#1CDAF4_100%)]
            bg-clip-text text-transparent">
            Edit Lead
          </h1>
        </div>

        {Object.entries(groupedFields).map(([section, fields]) => (
          <div key={section} className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">{section}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map(key => renderInputField(key, form[key]))}
            </div>
          </div>
        ))}

        {/* Audio block */}
        <div className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Audio Note</h2>
          <div className="border border-[#D1D5DC] rounded p-3 bg-gray-50">
            {form.audioFileUrl && (
              <audio controls className="w-full rounded mb-3">
                <source src={form.audioFileUrl} type="audio/mpeg" />
              </audio>
            )}
            <input
              type="text"
              value={form.audioFileUrl || ""}
              onChange={(e) => setForm({ ...form, audioFileUrl: e.target.value })}
              className="w-full px-3 py-2 mb-2 rounded border border-gray-300 text-sm"
            />
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
            />
          </div>
        </div>

        {/* Tag section */}
        <div className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => (
              <div key={tag.id} className="border border-[#D1D5DC] bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <span>{tag.name}</span>
                <button type="button" onClick={() => handleDeleteTag(tag.id)} className="text-red-500">&times;</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter new tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} /> Add Tag
            </button>
          </div>

        </div>

        {/* Submit */}
        <div className="text-right">
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            Update Lead
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
