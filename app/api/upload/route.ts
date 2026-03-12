import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/db";
import { generateBanner } from "@/lib/imageProcessor";
import { uploadBanner } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const eventoId = formData.get("eventoId") as string | null;
    const foto = formData.get("foto") as File | null;

    if (!eventoId || !foto) {
      return NextResponse.json({ erro: "Campos eventoId e foto são obrigatórios." }, { status: 400 });
    }

    // Validar tipo do arquivo
    const validMimeTypes = ["image/jpeg", "image/png"];
    if (!validMimeTypes.includes(foto.type)) {
      return NextResponse.json({ erro: "Formato de arquivo inválido. Apenas JPG e PNG são permitidos." }, { status: 400 });
    }

    // Validar tamanho (< 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (foto.size > MAX_SIZE) {
      return NextResponse.json({ erro: "O tamanho do arquivo excede o limite de 5MB." }, { status: 400 });
    }

    const evento = await getEventById(eventoId);
    if (!evento) {
      return NextResponse.json({ erro: "Evento não encontrado." }, { status: 404 });
    }

    // Buffer da foto original enviada
    const arrayBuffer = await foto.arrayBuffer();
    const fotoBuffer = Buffer.from(arrayBuffer);

    // Gerar a imagem final
    const bannerBuffer = await generateBanner(evento, fotoBuffer);

    // Fazer o upload para o Vercel Blob
    const bannerUrl = await uploadBanner(bannerBuffer, evento.id);

    // Identificador único (codificado em base64url para evitar bugs no Next.js routing)
    const bannerId = Buffer.from(bannerUrl).toString('base64url');

    return NextResponse.json({ bannerUrl, bannerId }, { status: 200 });

  } catch (error) {
    console.error("Erro na rota de upload:", error);
    return NextResponse.json({ erro: "Erro interno ao processar a imagem." }, { status: 500 });
  }
}
