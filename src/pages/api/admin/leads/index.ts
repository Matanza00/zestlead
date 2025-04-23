import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        contact: true,
        email: true,
        leadType: true,
        propertyType: true,
        isAvailable: true,
        createdAt: true,
      },
    });
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
        beds: data.beds,
        baths: data.baths,
        desireArea: data.desireArea,
        priceRange: data.priceRange,
        paymentMethod: data.paymentMethod,
        preApproved: data.preApproved,
        timeline: data.timeline,
        hasRealtor: data.hasRealtor,
        specialReq: data.specialReq,
        notes: data.notes,
        audioFileUrl: data.audioFileUrl,
      },
    });

    return res.status(201).json(lead);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
