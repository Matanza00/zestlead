// pages/api/admin/leads/bulk.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type RawLead = Record<string, string>;

/** Parse "8 beds, 5.5 baths" or "3 Bedrooms, 2 Bathrooms" into numbers */
function parseBedsBaths(text = "") {
  const bedsMatch = text.match(/([\d.]+)\s*beds?/i);
  const bathsMatch = text.match(/([\d.]+)\s*baths?/i);
  return {
    beds: bedsMatch ? parseFloat(bedsMatch[1]) : 0,
    baths: bathsMatch ? parseFloat(bathsMatch[1]) : 0,
  };
}

/** Turn one CSV row (with its original headers) into our Prisma Lead shape */
function normalize(raw: RawLead) {
  const leadType = (raw["Lead Type"] || "").trim().toUpperCase() === "SELLER"
    ? "SELLER"
    : "BUYER";

  // Seller CSV uses "Bedrooms/Bathrooms", buyer uses "Beds/Baths"
  const bedBathCol = leadType === "BUYER"
    ? raw["Beds/Baths"]
    : raw["Bedrooms/Bathrooms"];
  const { beds, baths } = parseBedsBaths(bedBathCol);

  return {
    // common fields
    name: raw["Name"]?.trim() || "",
    contact: raw["Contact Number"]?.trim() || "",
    email: raw["Email"]?.trim().toLowerCase() === "none"
      ? null
      : raw["Email"]?.trim() || null,
    leadType,
    propertyType: (
      raw["Type of Property"] ||
      raw["Property Type"] ||
      ""
    ).trim(),
    beds,
    baths,

    // buyer‐only
    desireArea: leadType === "BUYER" ? raw["Desire Area"]?.trim() : null,
    priceRange: leadType === "BUYER" ? raw["Price Range"]?.trim() : null,
    paymentMethod: leadType === "BUYER"
      ? raw["Payment Method"]?.trim()
      : null,
    preApproved: leadType === "BUYER"
      ? /^yes$/i.test(raw["Pre Approved"]?.trim() || "")
      : false,
    timeline: raw["Timeline"]?.trim() || null,
    hasRealtor: /^yes$/i.test(raw["Contract with any Realtor"]?.trim() || ""),
   specialRequirements: (leadType === "BUYER"
      ? raw["Special Requirements"]
      : raw["Special Features"]
   )?.trim() || null,

    // seller‐only
    propertySize: leadType === "SELLER"
      ? raw["Property Size"]?.trim()
      : null,
    propertyAddress: leadType === "SELLER"
      ? raw["Property Address"]?.trim()
      : null,
    parcelId: leadType === "SELLER" ? raw["Parcel ID"]?.trim() : null,
    askingPrice: leadType === "SELLER"
      ? parseFloat(
          (raw["Asking Price"] || "")
            .replace(/[$,]/g, "")
            .trim() || "0"
        )
      : null,
    marketValue: leadType === "SELLER"
      ? parseFloat(
          (raw["Market Value"] || "")
            .replace(/[$,]/g, "")
            .trim() || "0"
        )
      : null,
    condition: leadType === "SELLER" ? raw["Condition"]?.trim() : null,

    // shared extras
    appointment: raw["Appointment"]?.trim() || null,
    notes: raw["Notes"]?.trim() || null,
    audioFileUrl: null,

    // admin‐set lead price (optional override column in your CSV?)
    price: raw["Lead Price"] ? parseFloat(raw["Lead Price"]) : null,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const rows = req.body as RawLead[];
  // normalize & drop any row missing essential data
  const data = rows
    .map(normalize)
    .filter(r => r.name && r.contact && r.propertyType);

  if (data.length === 0) {
    return res.status(400).json({ error: "No valid rows found to upload" });
  }

  try {
    await prisma.lead.createMany({
      data,
      skipDuplicates: true,
    });
    return res.status(200).json({ success: true, uploaded: data.length });
  } catch (error) {
    console.error("Bulk lead upload failed:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
