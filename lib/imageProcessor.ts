import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { EventConfig } from './db';

/**
 * Processa a foto do usuário e a sobrepõe no template do evento.
 * O template no servidor deve ser procurado na pasta `public`.
 */
export async function generateBanner(evento: EventConfig, fotoBuffer: Buffer): Promise<Buffer> {
  // Caminho absoluto para o template na pasta public
  const templateAbsolutePath = path.join(process.cwd(), 'public', evento.templatePath);
  
  let templateBuffer: Buffer;
  try {
    templateBuffer = await fs.readFile(templateAbsolutePath);
  } catch (error) {
    console.error(`Erro ao ler template em ${templateAbsolutePath}:`, error);
    throw new Error('Template do evento não encontrado.');
  }

  const { width, height, top, left, shape } = evento.overlay;

  // Processo da foto do usuário:
  // 1. Redimensiona preservando o aspecto via 'cover' (preenchimento focal)
  let fotoProcessada = sharp(fotoBuffer).resize({
    width,
    height,
    fit: 'cover',
    position: 'center'
  });

  // 2. Se a máscara for circular, criamos e aplicamos
  if (shape === 'circle') {
    const circleSvg = `<svg width="${width}" height="${height}">
      <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2}" fill="#fff" />
    </svg>`;
    const circleMask = Buffer.from(circleSvg);

    fotoProcessada = fotoProcessada.composite([
      {
        input: circleMask,
        blend: 'dest-in' // Mantém o conteúdo do primeiro inputapenas onde o segundo tem pixels não-transparentes
      }
    ]).png(); // Necessário converter para PNG para manter transparência
  }

  const processedFotoBuffer = await fotoProcessada.toBuffer();

  // 3. Compor a imagem final: fundo é o template estático, a foto por cima
  // (Na maioria dos banners a foto fica por trás se o template for transparente.
  // Vou assumir que o template tem um "buraco transparente" e a foto fica SOB (dest-over) 
  // ou a foto fica no tamanho exato e por baixo, mas pelo spec o `template como fundo, foto sobreposta` foi pedido,
  // significando que a imagem do usuário vai em cima do template, ou seja, logo normal do composite.
  // Depende da ordem - default é sobrepor o input (foto) no background (template).
  const finalImageBuffer = await sharp(templateBuffer)
    .composite([
      {
        input: processedFotoBuffer,
        top,
        left,
      }
    ])
    .png()
    .toBuffer();

  return finalImageBuffer;
}
