import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const {
      query = "",
      propertyType,
      tag,
      status,
      minBeds,
      minBaths,
      minPrice,
      maxPrice,
    } = req.query;

    const filters: any = {
      AND: []
    };

    if (query) {
      filters.AND.push({
  OR: [
    { name: { contains: String(query) } },
    { contact: { contains: String(query) } },
    { email: { contains: String(query) } },
    { desireArea: { contains: String(query) } },
  ]
});
    }

    if (propertyType) filters.AND.push({ propertyType: String(propertyType) });
    if (status) filters.AND.push({ isAvailable: status === "true" });
    if (minBeds) filters.AND.push({ beds: { gte: parseFloat(minBeds as string) } });
    if (minBaths) filters.AND.push({ baths: { gte: parseFloat(minBaths as string) } });
    if (minPrice) filters.AND.push({ price: { gte: parseFloat(minPrice as string) } });
    if (maxPrice) filters.AND.push({ price: { lte: parseFloat(maxPrice as string) } });

    const leads = await prisma.lead.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        contact: true,
        price: true,
        email: true,
        desireArea: true,
        beds: true,
        baths: true,
        leadType: true,
        propertyType: true,
        isAvailable: true,
        createdAt: true,
        tags: true,
      },
    });

    if (tag) {
      const tagLower = String(tag).toLowerCase();
      return res.status(200).json(
        leads.filter(lead =>
          lead.tags?.some(t => t.name.toLowerCase().includes(tagLower))
        )
      );
    }

    return res.status(200).json(leads);
  }

  if (req.method === "POST") {
    const data = req.body;
  
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        leadType: data.leadType,
        propertyType: data.propertyType,
        beds: parseFloat(data.beds || "0"),
        baths: parseFloat(data.baths || "0"),
        desireArea: data.desireArea,
        priceRange: data.priceRange,
        paymentMethod: data.paymentMethod,
        preApproved: data.preApproved === "true",
        timeline: data.timeline,
        hasRealtor: data.hasRealtor === "true",
        specialReq: data.specialReq,
        notes: data.notes,
        price: data.price,
        audioFileUrl: data.audioFileUrl || "",
      },
    });
  
    return res.status(201).json(lead);
  }
  

  return res.status(405).json({ error: "Method not allowed" });
}
