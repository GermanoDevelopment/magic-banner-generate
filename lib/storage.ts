import { put } from '@vercel/blob';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

/**
 * Faz upload de um buffer de imagem para o Vercel Blob (Produção)
 * ou salva localmente (Desenvolvimento) para economizar limites da API e retorna a URL pública.
 * @param buffer Buffer da imagem
 * @param eventId ID do evento
 * @returns A URL pública da imagem salva
 */
export async function uploadBanner(buffer: Buffer, eventId: string): Promise<string> {
  const filename = `${eventId}-${Date.now()}.png`;

  // Salva localmente se estiver em ambiente de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    const bannersDir = path.join(process.cwd(), 'public', 'banners');
    
    // Garante que o diretório público de banners exista
    if (!fsSync.existsSync(bannersDir)) {
      fsSync.mkdirSync(bannersDir, { recursive: true });
    }

    const filePath = path.join(bannersDir, filename);
    await fs.writeFile(filePath, buffer);
    
    // Retorna o caminho estático local
    return `/banners/${filename}`;
  }

  // Faz upload dinâmico em ambiente de produção para a Vercel
  try {
    const blobFilename = `banners/${filename}`;
    const { url } = await put(blobFilename, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    return url;
  } catch (error) {
    console.error("Erro ao fazer upload para o Vercel Blob:", error);
    throw new Error('Falha ao salvar a imagem gerada.');
  }
}
