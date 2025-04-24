import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

console.log("🔄 API Loaded: /api/upload/audio");

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://70caa1a98793137b27235f7e1be32a94.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "b768bec3a702bb0a77e98de6e1f0e98c",
    secretAccessKey: "4dc02c271cd8575f2787392cabf57a8030c3e28bd5118dd1530d1aa05ee4fd57",
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📥 Upload request received");

  if (req.method !== "POST") {
    console.warn("❌ Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Form parse error:", err);
      return res.status(500).json({ error: "Form parsing failed" });
    }

    const file = files.file?.[0];
    const leadType = (fields.leadType?.[0] || "general").toUpperCase();

    if (!file) {
      console.warn("⚠️ No file uploaded.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const stream = fs.createReadStream(file.filepath);
    const extension = path.extname(file.originalFilename || "") || ".mp3";
    const contentType = mime.lookup(extension) || "audio/mpeg";
    const key = `audio/${leadType}/${Date.now()}-${file.originalFilename}`;

    try {
      console.log(`⬆️ Uploading to R2: ${key}`);
      await s3.send(
        new PutObjectCommand({
          Bucket: "zestlead", // 🔁 Update this if needed
          Key: key,
          Body: stream,
          ContentType: contentType,
        })
      );

      const publicUrl = `https://pub-a12e4f64d952422a88f30eb65b145846.r2.dev/${key}`;
      console.log("✅ Upload successful:", publicUrl);
      return res.status(200).json({ success: true, url: publicUrl });
    } catch (uploadErr) {
      console.error("❌ Upload to R2 failed:", uploadErr);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
