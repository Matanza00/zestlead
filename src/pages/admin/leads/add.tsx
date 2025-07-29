// pages/admin/leads/add.tsx
'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui2/button'
import { ArrowLeft, Upload, List } from 'lucide-react'


export default function AddLeadsPage(props) {
  const [mode, setMode] = useState<'manual'|'csv'>('manual')
  const [leadType, setLeadType] = useState<'BUYER'|'SELLER'>('BUYER')
  const [audioMode, setAudioMode] = useState<'url'|'upload'>('url')
  const [audioFile, setAudioFile] = useState<File|null>(null)
  type ManualLeadForm = {
  name: string;
  contact: string;
  email: string;
  propertyType: string;
  beds: string;
  baths: string;
  desireArea: string;
  priceRange: string;
  price: string;
  paymentMethod: string;
  preApproved: string;
  timeline: string;
  hasRealtor: string;
  specialReq: string;
  notes: string;
  audioFileUrl: string;
  leadType: 'BUYER' | 'SELLER';
};

const [manualForm, setManualForm] = useState<ManualLeadForm>({
  name: '', contact: '', email: '', propertyType: '', beds: '', baths: '',
  desireArea: '', priceRange: '', price: '', paymentMethod: '', preApproved: 'false',
  timeline: '', hasRealtor: 'false', specialReq: '', notes: '', audioFileUrl: '',
  leadType: 'BUYER',
});

  const [csvData, setCsvData] = useState<any[]>([])
  const [fileName, setFileName] = useState('')

  const handleManualSubmit = async (e:any) => {
    e.preventDefault()
    // … same upload logic …
  }

  const handleFileUpload = (e:any) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFileName(f.name)
   Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<Record<string, string>>) => {
        setCsvData(result.data);
      },
    })
  }

  // const [mode, setMode] = useState<'manual' | 'csv'>('manual')
  // const [leadType, setLeadType] = useState<'BUYER'|'SELLER'>('BUYER')
  // const [audioMode, setAudioMode] = useState<'url' | 'upload'>('url')
  // const [audioFile, setAudioFile] = useState<File | null>(null)
  // const [manualForm, setManualForm] = useState<any>({
  //   name: '', contact:'', email:'', propertyType:'', beds:'', baths:'',
  //   desireArea:'', priceRange:'', paymentMethod:'', preApproved:'false',
  //   timeline:'', hasRealtor:'false', specialReq:'', notes:'', audioFileUrl:'',
  //   price:'', leadType: 'BUYER'
  // })
  // const [csvData, setCsvData] = useState<any[]>([])
  // const [fileName, setFileName] = useState('')

  // const handleManualSubmit = async (e:any) => {
  //   e.preventDefault()
  //   let audioUrl = manualForm.audioFileUrl
  //   if (audioMode==='upload' && audioFile) {
  //     const fd = new FormData()
  //     fd.append('file', audioFile)
  //     const res = await fetch('/api/upload/audio', { method:'POST', body:fd })
  //     const { url } = await res.json()
  //     audioUrl = url
  //   }
  //   const payload = { ...manualForm, leadType, audioFileUrl: audioUrl }
  //   await fetch('/api/admin/leads',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
  //     .then(r=> r.ok ? alert('Lead added!') : alert('Error'))
  // }

  // const handleFileUpload = (e:any) => {
  //   const f = e.target.files?.[0]
  //   if (!f) return
  //   setFileName(f.name)
  //   Papa.parse(f, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: ({ data }) => setCsvData(data as any[])
  //   })
  // }
  const handleCsvUpload = async () => {
    await fetch('/api/admin/leads/bulk',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(csvData)})
      .then(r=> r.ok ? alert('Bulk upload success') : alert('Upload failed'))
    setCsvData([])
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold bg-[radial-gradient(190.64%_199.6%_at_-3.96%_130%,#3A951B_0%,#1CDAF4_100%)]
              bg-clip-text text-transparent">
            Add New Lead
          </h1>
          
            <Button
              asChild
              variant="outline"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href="/admin/leads">
                <ArrowLeft size={18} /> Back
              </Link>
            </Button>
          
        </div>

        {/* Mode Switch */}
        <div className="rounded-lg bg-white shadow p-4 flex gap-4">
          {(['manual','csv'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`
                flex-1 py-2 text-center font-medium rounded
                ${mode === m
                  ? 'bg-clip-text text-transparent bg-gradient-to-br from-green-600 to-blue-400'
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              {m==='manual' ? <><List className="inline mr-1" /> Manual</> 
                           : <><Upload className="inline mr-1" /> CSV</>}
            </button>
          ))}
        </div>

        {/* Manual Entry Form */}
        {mode === 'manual' ? (
          <div className="rounded-lg bg-white shadow overflow-hidden">
            <form onSubmit={handleManualSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead type selector spans both columns */}
              <div className="col-span-full">
                <label className="block font-medium text-sm mb-2">Lead Type</label>
                <select
                  className="w-full rounded-lg border px-4 py-2"
                  value={leadType}
                  onChange={e => {
                    setLeadType(e.target.value as any)
                    setManualForm((f: ManualLeadForm) => ({ ...f, paymentMethod: e.target.value }))
                  }}
                >
                  <option>BUYER</option>
                  <option>SELLER</option>
                </select>
              </div>

              {/* Text inputs */}
              {[
                'name','contact','email','propertyType',
                'beds','baths','desireArea',
                'priceRange','price'
              ].map(field => (
                <div key={field}>
                  <label className="block text-sm mb-1 capitalize">{field.replace(/([A-Z])/g,' $1')}</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2 focus:ring-1 focus:ring-green-400"
                    value={manualForm[field]}
                    onChange={e => setManualForm(f => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}

              {/* Conditional seller-only */}
              {leadType === 'BUYER' && (
                <>
                  <div>
                    <label className="block text-sm mb-1">Payment Method</label>
                    <input type="text" className="w-full rounded-lg border px-4 py-2" 
                      value={manualForm.paymentMethod}
                      onChange={e=>setManualForm(f=>({...f,paymentMethod:e.target.value}))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Timeline</label>
                    <input type="text" className="w-full rounded-lg border px-4 py-2"
                      value={manualForm.timeline}
                      onChange={e=>setManualForm(f=>({...f,timeline:e.target.value}))}
                    />
                  </div>
                </>
              )}

              {/* Audio controls span both columns */}
              <div className="col-span-full">
                <label className="block font-medium text-sm mb-2">Audio</label>
                <div className="inline-flex rounded-lg overflow-hidden border">
                  {(['url','upload'] as const).map(am => (
                    <button
                      key={am}
                      type="button"
                      onClick={() => setAudioMode(am)}
                      className={`
                        px-4 py-2 text-sm font-medium
                        ${audioMode === am ? 'bg-gradient-to-br from-green-600 to-blue-400 text-white' : 'bg-white text-gray-600'}
                      `}
                    >
                      {am==='url' ? 'URL' : 'Upload'}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  {audioMode === 'url' ? (
                    <input
                      placeholder="https://..."
                      className="w-full rounded-lg border px-4 py-2"
                      value={manualForm.audioFileUrl}
                      onChange={e=>setManualForm(f=>({...f,audioFileUrl:e.target.value}))}
                    />
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="audio/*"
                        className="w-full rounded-lg border px-4 py-2"
                        onChange={e => {
                          const f = e.target.files?.[0]||null
                          setAudioFile(f)
                          if (f) {
                            setManualForm(m=>({...m,audioFileUrl:URL.createObjectURL(f)}))
                          }
                        }}
                      />
                      {audioFile && (
                        <audio controls className="mt-3 w-full">
                          <source src={manualForm.audioFileUrl} />
                        </audio>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Notes span both columns */}
              <div className="col-span-full">
                <label className="block text-sm mb-1">Notes</label>
                <textarea
                  className="w-full rounded-lg border px-4 py-2 h-24 resize-none"
                  value={manualForm.notes}
                  onChange={e=>setManualForm(f=>({...f,notes:e.target.value}))}
                />
              </div>

              {/* Submit button spans both */}
              <div className="col-span-full text-right">
                <Button
                  type="submit"
                  size="lg"
                  className="px-8"
                  style={{
                    backgroundImage:
                      'radial-gradient(187.72% 415.92% at 52.87% 247.14%,#3A951B 0%,#1CDAF4 100%)'
                  }}
                >
                  Submit Lead
                </Button>
              </div>
            </form>
          </div>
         ) : (
      <div className="rounded-lg bg-white shadow p-6 space-y-4">
        {/* CSV upload block */}
        <label className="block font-medium mb-1">Upload CSV</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm"
        />

        {csvData.length > 0 && (
          <>
            <p className="text-gray-700">
              Preview <strong>{fileName}</strong> ({csvData.length} rows)
            </p>
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full w-full text-sm table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(csvData[0]).map(k => (
                      <th key={k} className="p-2 text-left">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="p-2">{String(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-right">
              <Button
                onClick={handleCsvUpload}
                style={{
                  backgroundImage:
                    'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
                }}
              >
                Upload {csvData.length} Leads
              </Button>
            </div>
          </>
        )}
      </div>
    )}
      </div>
    </AdminLayout>
  )
}
