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
    // common
  leadType: 'BUYER' | 'SELLER';
  name: string;
  contact: string;
  email: string;
  appointment: string;
  audioFileUrl: string;
  price: string;

  // BUYER only
  propertyType: string;
  beds: string;
  baths: string;
  desireArea: string;
  priceRange: string;
  paymentMethod: string;
  preApproved: string;
  timeline: string;
  hasRealtor: string;
  specialReq: string;
  notes: string;

  // SELLER only
  propertyType_s: string;
  beds_s: string;
  baths_s: string;
  propertySize: string;
  propertyAddress: string;
  parcelId: string;
  askingPrice: string;
  marketValue: string;
  specialFeatures: string;
  condition: string;
}

const [manualForm, setManualForm] = useState<ManualLeadForm>({
    leadType: 'BUYER',
  name: '', contact: '', email: '', appointment: '', audioFileUrl: '', price: '',

  // BUYER defaults
  propertyType: '', beds: '', baths: '',
  desireArea: '', priceRange: '', paymentMethod: '',
  preApproved: 'false', timeline: '', hasRealtor: 'false',
  specialReq: '', notes: '',


  // SELLER defaults
  propertyType_s: '', beds_s: '', baths_s: '',
  propertySize: '', propertyAddress: '', parcelId: '',
  askingPrice: '', marketValue: '', specialFeatures: '', condition: '',

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

  const handleCsvUpload = async () => {
    await fetch('/api/admin/leads/bulk',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(csvData)})
      .then(r=> r.ok ? alert('Bulk upload success') : alert('Upload failed'))
    setCsvData([])
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl px-6 py-8 space-y-6">
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
            <form onSubmit={handleManualSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
             
              {/* ── Client Information ── */}
              <section className="col-span-full space-y-6">
                <h3 className="text-xl font-semibold">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2"
                    value={manualForm.name}
                    onChange={e => setManualForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Contact</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2"
                    value={manualForm.contact}
                    onChange={e => setManualForm(f => ({ ...f, contact: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2"
                    value={manualForm.email}
                    onChange={e => setManualForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Appointment</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2"
                    value={manualForm.appointment}
                    onChange={e => setManualForm(f => ({ ...f, appointment: e.target.value }))}
                  />
                </div>
                </div>
              </section>

              {/* ── Property Information ── */}
              <section className="col-span-full space-y-4">
                <h3 className="text-xl font-semibold">Property Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {leadType === 'BUYER' ? (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Type of property</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.propertyType}
                        onChange={e => setManualForm(f => ({ ...f, propertyType: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Beds</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.beds}
                        onChange={e => setManualForm(f => ({ ...f, beds: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Baths</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.baths}
                        onChange={e => setManualForm(f => ({ ...f, baths: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Desire Area</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.desireArea}
                        onChange={e => setManualForm(f => ({ ...f, desireArea: e.target.value }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Type of property</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.propertyType_s}
                        onChange={e => setManualForm(f => ({ ...f, propertyType_s: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Bedrooms</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.beds_s}
                        onChange={e => setManualForm(f => ({ ...f, beds_s: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Bathrooms</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.baths_s}
                        onChange={e => setManualForm(f => ({ ...f, baths_s: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Property Size</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.propertySize}
                        onChange={e => setManualForm(f => ({ ...f, propertySize: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Property Address</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.propertyAddress}
                        onChange={e => setManualForm(f => ({ ...f, propertyAddress: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Parcel ID</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.parcelId}
                        onChange={e => setManualForm(f => ({ ...f, parcelId: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                </div>
              </section>

              {/* ── Price & Timeline ── */}
              <section className="col-span-full space-y-4">
                <h3 className="text-xl font-semibold">Price & Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {leadType === 'BUYER' ? (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Price Range</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.priceRange}
                        onChange={e => setManualForm(f => ({ ...f, priceRange: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Payment Method</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.paymentMethod}
                        onChange={e => setManualForm(f => ({ ...f, paymentMethod: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Pre Approved</label>
                      <select
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.preApproved}
                        onChange={e => setManualForm(f => ({ ...f, preApproved: e.target.value }))}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Timeline</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.timeline}
                        onChange={e => setManualForm(f => ({ ...f, timeline: e.target.value }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Asking Price</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.askingPrice}
                        onChange={e => setManualForm(f => ({ ...f, askingPrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Market Value</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.marketValue}
                        onChange={e => setManualForm(f => ({ ...f, marketValue: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Timeline</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.timeline}
                        onChange={e => setManualForm(f => ({ ...f, timeline: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                </div>
              </section>

              {/* ── Additional Details ── */}
              <section className="col-span-full space-y-4">
                <h3 className="text-xl font-semibold">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {leadType === 'BUYER' ? (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Contract with any realtor</label>
                      <select
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.hasRealtor}
                        onChange={e => setManualForm(f => ({ ...f, hasRealtor: e.target.value }))}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Special Requirements</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.specialReq}
                        onChange={e => setManualForm(f => ({ ...f, specialReq: e.target.value }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm mb-1">Currently Working with a Realtor</label>
                      <select
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.hasRealtor}
                        onChange={e => setManualForm(f => ({ ...f, hasRealtor: e.target.value }))}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Special Features</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.specialFeatures}
                        onChange={e => setManualForm(f => ({ ...f, specialFeatures: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Condition</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-4 py-2"
                        value={manualForm.condition}
                        onChange={e => setManualForm(f => ({ ...f, condition: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                
                
                </div>
              </section>

            

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

              {/* ── Lead Price ── */}
            <section className="col-span-full space-y-4">
              <h3 className="text-xl font-semibold">Lead Price</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm mb-1">Price</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-2"
                    value={manualForm.price}
                    onChange={e => setManualForm(f => ({ ...f, price: e.target.value }))}
                  />
                </div>
              </div>
            </section>

              {/* Submit button spans both */}
              <div className="col-span-full text-right">
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 text-white font-semibold"
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
