// src/pages/leads/index.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  MapPin,
  X,
  Bed,
  Bath,
  DollarSign,
  Home,
  User
} from 'lucide-react';

import Header from '@/components/landing/Header';

interface PublicLead {
  id: string;
  name: string;
  desireArea: string;
  propertyType: string;
  timeline: string;
  leadType: 'BUYER' | 'SELLER';
  priceRange: string;
  beds?: number;
  baths?: number;
}


interface ApiResponse {
  data: PublicLead[];
  total: number;
  page: number;
  pageSize: number;
}

export default function PublicLeadsPage(props) {
  const [leads, setLeads] = useState<PublicLead[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    leadType: '',
    propertyType: '',
    desireArea: '',
    available: false,
  });
  const [loading, setLoading] = useState(true);
   const router = useRouter();
  const { data: session } = useSession();

  const handleOpenDetails = async (leadId: string) => {
    if (!session?.user) {
      router.push(`/auth/login?callbackUrl=/cart`);
      return;
    }
    console.log('Adding lead to cart with ID:', leadId);
    // Add lead to cart
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId })
      });

      if (!res.ok) {
        throw new Error('Failed to add lead to cart');
      }

      router.push('/cart');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };


  // Load dynamic area and propertyType options
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [areasRes, typesRes] = await Promise.all([
          fetch('/api/public/areas'),
          fetch('/api/public/property-types'),
        ]);
        const areasData = await areasRes.json();
        const typesData = await typesRes.json();
        setAreas(Array.isArray(areasData) ? areasData : []);
        setPropertyTypes(Array.isArray(typesData) ? typesData : []);
      } catch (err) {
        console.error('Failed to load filter options', err);
        setAreas([]);
        setPropertyTypes([]);
      }
    }
    fetchOptions();
  }, []);

  // Fetch paginated & filtered data
  useEffect(() => {
    async function fetchLeads() {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (filters.leadType) params.set('leadType', filters.leadType);
      if (filters.propertyType) params.set('propertyType', filters.propertyType);
      if (filters.desireArea) params.set('area', filters.desireArea);
      if (filters.available) params.set('available', 'true');

      setLoading(true);
      try {
        const res = await fetch(`/api/public/leads?${params.toString()}`);
        const json: ApiResponse = await res.json();
        setLeads(json.data || []);
        setTotal(json.total || 0);
      } catch (err) {
        console.error('Failed to fetch leads', err);
        setLeads([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [page, pageSize, filters]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clearFilters = () =>
    setFilters({ leadType: '', propertyType: '', desireArea: '', available: false });


  return (
    <>
    <Header />
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      
      <h1 className="text-4xl font-heading text-text"></h1>

      {/* Filters Section */}
      <div className="bg-surface p-6 rounded-2xl shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by location or name..."
            className="col-span-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
          />

          {/* Buyer/Seller Filter */}
          <select
            value={filters.leadType}
            onChange={(e) => setFilters({ ...filters, leadType: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Leads</option>
            <option value="BUYER">Buyer Leads</option>
            <option value="SELLER">Seller Leads</option>
          </select>

          {/* Property Type Filter */}
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Types</option>
            {propertyTypes?.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Area Filter */}
          <select
            value={filters.desireArea}
            onChange={(e) => setFilters({ ...filters, desireArea: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Areas</option>
            {areas?.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button
            onClick={() => setPage(1)}
            className="bg-primary text-white px-6 rounded-lg"
          >
            Search
          </button>
        </div>

        {/* Availability Toggle and Chips */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.available}
              onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
              className="accent-primary"
            />
            <span className="text-text">Show only available leads</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {filters.leadType && (
              <span className="badge">
                {filters.leadType === 'BUYER' ? 'Buyer Leads' : 'Seller Leads'}
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => setFilters({ ...filters, leadType: '' })}
                />
              </span>
            )}
            {filters.propertyType && (
              <span className="badge">
                {filters.propertyType}
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => setFilters({ ...filters, propertyType: '' })}
                />
              </span>
            )}
            {filters.desireArea && (
              <span className="badge">
                {filters.desireArea}
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => setFilters({ ...filters, desireArea: '' })}
                />
              </span>
            )}
            {filters.available && (
              <span className="badge">
                Available
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => setFilters({ ...filters, available: false })}
                />
              </span>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="ml-auto text-accent border border-accent px-4 py-1 rounded-lg"
          >
            Clear Filters
          </button>
        </div>

        <p className="text-text text-sm">
          We found <strong>{total}</strong> results
        </p>
      </div>

      {/* Leads List & Pagination */}
      {loading ? (
        <div className="text-center py-12 text-text">Loading leads...</div>
      ) : (
        <>
          {/* Cards */}
          <div className="space-y-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Home className="h-10 w-10" />
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                        ${lead.leadType === 'BUYER' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        <User className="w-4 h-4" />
                        {lead.leadType} Lead
                      </span>
                      <span className="text-sm text-gray-500">{lead.timeline}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{lead.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        {lead.desireArea}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                        {lead.priceRange}
                      </span>
                      {lead.beds !== undefined && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-purple-500" />
                          {lead.beds} beds
                        </span>
                      )}
                      {lead.baths !== undefined && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4 text-blue-400" />
                          {lead.baths} baths
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between mt-5 gap-4">
                  <button
                    onClick={() => handleOpenDetails(lead.id)}  // ✅ Not just `handleOpenDetails`
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
                  >
                    Open Details
                  </button>
                  <button className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition">
                    Browse Top Cash Buyers
                  </button>
                </div>
              </div>

            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-6 space-x-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg hover:bg-primary/10 disabled:opacity-50"
            >Prev</button>
            <span className="font-body">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-lg hover:bg-primary/10 disabled:opacity-50"
            >Next</button>
          </div>
        </>
      )}
    </main>
    </>
  );
}