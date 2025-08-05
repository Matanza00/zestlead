// src/pages/api/admin/leads/index.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const page     = Math.max(1, parseInt(String(req.query.page)) || 1)
    const pageSize = Math.max(1, parseInt(String(req.query.pageSize)) || 100)
    const skip     = (page - 1) * pageSize

    const {
      query = "",
      propertyType,
      tag,
      status,
      minBeds,
      minBaths,
      minPrice,
      maxPrice,
      leadType,
      realtor,
      preApproved,
      paymentMethod,    // now a string
    } = req.query;

    const filters: any = { AND: [] };

    if (query) {
      filters.AND.push({
        OR: [
          { name: { contains: String(query), mode: "insensitive" } },
          { contact: { contains: String(query) } },
          { email: { contains: String(query) } },
          { desireArea: { contains: String(query), mode: "insensitive" } },
          { propertyAddress: { contains: String(query), mode: "insensitive" } },
        ],
      });
    }
    if (propertyType)  filters.AND.push({ propertyType: String(propertyType) });
    if (status)        filters.AND.push({ isAvailable: status === "true" });
    if (minBeds)       filters.AND.push({ beds: { gte: parseFloat(minBeds as string) } });
    if (minBaths)      filters.AND.push({ baths: { gte: parseFloat(minBaths as string) } });
    if (minPrice)      filters.AND.push({ price: { gte: parseFloat(minPrice as string) } });
    if (maxPrice)      filters.AND.push({ price: { lte: parseFloat(maxPrice as string) } });
    if (leadType)      filters.AND.push({ leadType: String(leadType) });
    if (realtor)       filters.AND.push({ hasRealtor: realtor === "true" });
    if (preApproved)   filters.AND.push({ preApproved: preApproved === "true" });
    if (paymentMethod) filters.AND.push({ paymentMethod: String(paymentMethod) });

    if (tag) {
      filters.AND.push({
        tags: { some: { name: { contains: String(tag), mode: "insensitive" } } },
      });
    }

    const totalCount = await prisma.lead.count({
    where: filters
  });

    const items = await prisma.lead.findMany({
      where: filters,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        contact: true,
        email: true,
        leadType: true,
        propertyType: true,
        beds: true,
        baths: true,
        desireArea: true,
        propertySize: true,
        propertyAddress: true,
        parcelId: true,
        askingPrice: true,
        marketValue: true,
        priceRange: true,
        price: true,
        paymentMethod: true,   // now returns string
        preApproved: true,
        hasRealtor: true,
        timeline: true,
        appointment: true,
        isAvailable: true,
        createdAt: true,
        tags: true,
      },
    });

    const hasMore = items.length === pageSize
    return res.status(200).json({ leads: items, totalCount })
  }

  // POST /api/admin/leads
  if (req.method === "POST") {
    const data = req.body;
    if (!data.name || !data.contact || !data.leadType || !data.propertyType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const lead = await prisma.lead.create({
        data: {
          name: data.name,
          contact: data.contact,
          email: data.email || undefined,
          leadType: data.leadType,
          propertyType: data.propertyType,
          beds: data.beds ? parseFloat(data.beds) : undefined,
          baths: data.baths ? parseFloat(data.baths) : undefined,
          desireArea: data.desireArea,
          propertySize: data.propertySize,
          propertyAddress: data.propertyAddress,
          parcelId: data.parcelId,
          askingPrice: data.askingPrice ? parseFloat(data.askingPrice) : undefined,
          marketValue: data.marketValue ? parseFloat(data.marketValue) : undefined,
          specialRequirements: data.specialReq || data.specialRequirements,
          priceRange: data.priceRange,
          price: data.price ? parseFloat(data.price) : undefined,
          paymentMethod: data.paymentMethod,
          preApproved: data.preApproved === true || data.preApproved === "true",
          hasRealtor: data.hasRealtor === true || data.hasRealtor === "true",
          timeline: data.timeline,
          appointment: data.appointment,
          notes: data.notes,
          audioFileUrl: data.audioFileUrl,
          tags: data.tags
            ? { create: (data.tags as string[]).map((t) => ({ name: t })) }
            : undefined,
        },
        include: { tags: true },
      });
      return res.status(201).json(lead);
    } catch (err) {
      console.error("Lead creation failed:", err);
      return res.status(400).json({ error: "Invalid input data" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
