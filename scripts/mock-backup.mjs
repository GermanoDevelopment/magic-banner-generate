import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public', 'templates');

// Garante que o diretório exista
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function createTemplates() {
  // Evento Mágico 2026 (fundo escuro, espaço redondo transparente)
  // template original = 800x800
  // buraco (shape: circle) com 400x400 no top 150 e left 100
  // Mas não preciso fazer um buraco na imagem, basta que a logomarca do evento
  // e o "frame" sejam gerados como um PNG.
  // Vou criar uma imagem azul sólida com letreiros, e deixar "transparente" a área de 400x400
  const magicoBuffer = await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 50, g: 20, b: 120, alpha: 1 } // Roxo escuro
    }
  })
    // Adicionar um buraco no meio usando composite com SVG transparente (clear)
    .composite([
      {
        input: Buffer.from(`<svg width="800" height="800"><circle cx="300" cy="350" r="200" fill="#000" /></svg>`),
        blend: 'dest-out' // Transforma a intersecção em transparente
      }
    ])
    .png()
    .toFile(path.join(publicDir, 'evento-magico-2026.png'));

  // Tech Conference (fundo amarelo gema, espaço retangular transparente)
  // espaco 400x300, top 200, left 200 numa img 800x800
  const techBuffer = await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: { r: 240, g: 180, b: 40, alpha: 1 } // Amarelo tech
    }
  })
    .composite([
      {
        input: Buffer.from(`<svg width="800" height="800"><rect x="200" y="200" width="400" height="300" fill="#000" /></svg>`),
        blend: 'dest-out'
      }
    ])
    .png()
    .toFile(path.join(publicDir, 'tech-conference-brasil.png'));

  console.log("Mock templates criados em /public/templates/");
}

createTemplates().catch(console.error);
