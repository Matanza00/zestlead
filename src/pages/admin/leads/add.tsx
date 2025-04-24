import { useState } from "react";
import Papa from "papaparse";
import AdminLayout from "@/layouts/AdminLayout";

export default function AddLeadsPage(props) {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [leadType, setLeadType] = useState("BUYER");
  const [audioMode, setAudioMode] = useState<"url" | "upload">("url");
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [manualForm, setManualForm] = useState<any>({
    name: "",
    contact: "",
    email: "",
    propertyType: "",
    beds: "",
    baths: "",
    desireArea: "",
    priceRange: "",
    paymentMethod: "",
    preApproved: "false",
    timeline: "",
    hasRealtor: "false",
    specialReq: "",
    notes: "",
    audioFileUrl: "",
    price:"",
    leadType: "BUYER"
  });

  const [csvData, setCsvData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");

  const handleManualSubmit = async (e: any) => {
    e.preventDefault();

    let audioUrl = manualForm.audioFileUrl;
    if (audioMode === "upload" && audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("leadType", leadType);

      const uploadRes = await fetch("/api/upload/audio", {
        method: "POST",
        body: formData
      });
      const result = await uploadRes.json();
      audioUrl = result.url; // ✅ use the exact URL returned by Cloudflare R2

    }

    const payload = { ...manualForm, leadType, audioFileUrl: audioUrl };
    const res = await fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) alert("Lead added successfully");
    else alert("Error creating lead");
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const handleCsvUpload = async () => {
    const res = await fetch("/api/admin/leads/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(csvData),
    });
    if (res.ok) {
      alert("Bulk leads uploaded successfully!");
      setCsvData([]);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Lead</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded ${mode === "manual" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setMode("csv")}
            className={`px-4 py-2 rounded ${mode === "csv" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Upload CSV
          </button>
        </div>

        {mode === "manual" ? (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Lead Type</label>
              <select
                className="w-full p-2 border rounded"
                value={leadType}
                onChange={(e) => {
                  setLeadType(e.target.value);
                  setManualForm({ ...manualForm, leadType: e.target.value });
                }}
              >
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
              </select>
            </div>

            {Object.entries(manualForm).map(([key, value]) => {
              const hideForSeller = ["paymentMethod", "preApproved", "timeline"].includes(key);
              if (leadType === "SELLER" && hideForSeller) return null;
              if (key === "audioFileUrl" || key === "leadType") return null;
              return (
                <div key={key}>
                  <label className="block text-sm mb-1 capitalize">{key}</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={value}
                    onChange={(e) => setManualForm({ ...manualForm, [key]: e.target.value })}
                  />
                </div>
              );
            })}

            <div>
              <label className="block text-sm mb-1">Audio File</label>
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setAudioMode("url")}
                  className={`px-3 py-1 text-sm rounded ${audioMode === "url" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >Enter URL</button>
                <button
                  type="button"
                  onClick={() => setAudioMode("upload")}
                  className={`px-3 py-1 text-sm rounded ${audioMode === "upload" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >Upload File</button>
              </div>
              {audioMode === "url" ? (
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full p-2 border rounded"
                  value={manualForm.audioFileUrl}
                  onChange={(e) => setManualForm({ ...manualForm, audioFileUrl: e.target.value })}
                />
              ) : (
                <div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAudioFile(file);
                      if (file) {
                        const audioPreview = URL.createObjectURL(file);
                        setManualForm({ ...manualForm, audioFileUrl: audioPreview });
                      }
                    }}
                    className="w-full border rounded p-2"
                  />
                  {audioFile && (
                    <audio controls className="w-full mt-2 rounded">
                      <source src={manualForm.audioFileUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              )}
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Submit Lead
            </button>
          </form>
        ) : (
          <div>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
            {csvData.length > 0 && (
              <>
                <p className="text-sm text-gray-600 mb-2">
                  Preview from: <strong>{fileName}</strong> ({csvData.length} rows)
                </p>
                <table className="table-auto w-full border mb-4 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      {Object.keys(csvData[0]).map((key) => (
                        <th key={key} className="border p-2">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="border p-2">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleCsvUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit {csvData.length} Leads
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}