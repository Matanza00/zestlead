import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const leads = req.body;

  try {
    await prisma.lead.createMany({
      data: leads.map((lead: any) => ({
        name: lead.name,
        contact: lead.contact,
        email: lead.email,
        leadType: lead.leadType?.toUpperCase() || "BUYER",
        propertyType: lead.propertyType,
        beds: parseFloat(lead.beds || "0"),
        baths: parseFloat(lead.baths || "0"),
        desireArea: lead.desireArea,
        priceRange: lead.priceRange,
        paymentMethod: lead.paymentMethod,
        preApproved: lead.preApproved?.toLowerCase() === "true",
        timeline: lead.timeline,
        hasRealtor: lead.hasRealtor?.toLowerCase() === "true",
        specialReq: lead.specialReq,
        notes: lead.notes,
        audioFileUrl: lead.audioFileUrl,
      })),
      skipDuplicates: true,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Bulk lead upload failed:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
