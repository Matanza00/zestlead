import Papa from "papaparse";
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";

export default function AddLeadsPage() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");

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

  const handleUpload = async () => {
    const res = await fetch("/api/admin/leads/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(csvData),
    });

    if (res.ok) {
      alert("Leads uploaded successfully!");
      setCsvData([]);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Upload Leads (CSV)</h1>

        <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />

        {csvData.length > 0 && (
          <div>
            <p className="mb-2 font-medium text-sm text-gray-600">
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
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit {csvData.length} Leads
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
