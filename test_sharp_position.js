const sharp = require('sharp');
const fs = require('fs');
async function run() {
  const p = await sharp('/home/dionebastos/Documentos/PROJETOS/magic-banner/public/templates/template-1773329218741.jpeg').metadata();
  console.log(p.width, p.height);
}
run();
