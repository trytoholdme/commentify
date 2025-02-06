import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL inválida" });
    }

    console.log(`🔍 Buscando ID da publicação no backend: ${url}`);

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.data) {
      return res.status(404).json({ error: "Publicação não encontrada" });
    }

    const postIdMatch = response.data.match(/"media_id":"(\d+)"/);
    const postId = postIdMatch ? postIdMatch[1] : null;

    if (!postId) {
      return res.status(404).json({ error: "ID da publicação não encontrado" });
    }

    console.log(`✅ ID da publicação encontrado: ${postId}`);
    res.status(200).json({ postId });
  } catch (error) {
    console.error("❌ Erro ao buscar publicação:", error);
    res.status(500).json({ error: "Erro ao buscar publicação" });
  }
}
