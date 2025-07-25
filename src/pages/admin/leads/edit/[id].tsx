import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

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
          if (Array.isArray(data.tags)) {
            setTags(data.tags.map((t: any) => ({ id: t.id, name: t.name })));
          } else {
            setTags([]);
          }
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

      const uploadRes = await fetch("/api/upload/audio", {
        method: "POST",
        body: formData
      });

      const result = await uploadRes.json();
      if (result.url) audioUrl = result.url;
    }

    const { tags: _ignoreTags, ...formWithoutTags } = form;
    const updatedForm: any = { ...formWithoutTags, audioFileUrl: audioUrl };
    delete updatedForm.createdAt;
    delete updatedForm.updatedAt;
    delete updatedForm.deletedAt;
    updatedForm.beds = parseFloat(updatedForm.beds || 0);
    updatedForm.baths = parseFloat(updatedForm.baths || 0);
    updatedForm.preApproved = updatedForm.preApproved === "true" || updatedForm.preApproved === true;
    updatedForm.hasRealtor = updatedForm.hasRealtor === "true" || updatedForm.hasRealtor === true;
    updatedForm.price = parseFloat(form.price || 0);

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
      if (result.tag) {
        setTags(prev => [...prev, result.tag]);
      }
      setNewTag("");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    const res = await fetch(`/api/admin/leads/${id}/tags/${tagId}`, {
      method: "DELETE"
    });
    if (res.ok) {
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    }
  };

  if (!form) return <AdminLayout><p>Loading...</p></AdminLayout>;
if (!isClient) return null;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Edit Lead</h1>
        {Object.entries(form).map(([key, value]) => {
          if (["id","createdAt", "updatedAt", "deletedAt", "tags"].includes(key)) return null;

          if (key === "audioFileUrl") {
            return (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1 capitalize">{key}</label>
                {value && (
                  <audio controls className="w-full rounded mb-2">
                    <source src={value} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <input
                  type="text"
                  value={value || ""}
                  className="w-full p-2 border rounded mb-2"
                  onChange={(e) => setForm({ ...form, audioFileUrl: e.target.value })}
                />
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="w-full border rounded p-2"
                />
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1 capitalize">{key}</label>
              <input
                type="text"
                value={value || ""}
                className="w-full p-2 border rounded"
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          );
        })}

        {isClient && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div key={tag.id} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{tag.name}</span>
                  <button type="button" onClick={() => handleDeleteTag(tag.id)} className="text-red-500">&times;</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button type="button" onClick={handleAddTag} className="px-4 bg-blue-600 text-white rounded">
                Add Tag
              </button>
            </div>
          </div>
        )}

        <button className="bg-green-600 text-white px-4 py-2 rounded">Update Lead</button>
      </form>
    </AdminLayout>
  );
}
