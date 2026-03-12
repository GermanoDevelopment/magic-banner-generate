# 🌟 Magic Banner

**Sua presença, sua marca. Gere banners personalizados em segundos para destacar sua participação nos maiores eventos.**

Desenvolvido com excelência por **G-Dev**.

---

## 📖 Sobre o Projeto

O **Magic Banner** é uma aplicação Full-Stack moderna construída com Next.js que permite aos participantes de diversos eventos (tech, palestras, conferências) criarem facilmente um banner personalizado, mesclando uma foto própria com o design oficial do evento, pronto para o compartilhamento nas redes sociais.

O sistema também inclui um poderoso painel administrativo visual incorporado, onde é possível cadastrar os templates-base, e ajustar de forma interativa a posição e o formato dos "cortes" (onde a foto do usuário vai parar).

### ✨ Funcionalidades

- **Upload Otimizado:** Interface moderna com Drag-and-Drop, detecção de erros e UX fluida.
- **Processamento de Imagem no Backend:** Feito nativamente via Servidor Next.js Node (API routes) com auxílio da biblioteca super rápida `Sharp`.
- **Renderização e Alinhamento:** Recorte inteligente e redimensionamento automático para não repuxar fotos de usuários, além da opção de recortes Retangulares ou Circulares.
- **Armazenamento de Alta Disponibilidade:** Integra-se em produção com `Vercel Blob` e em desenvolvimento utiliza um fallback local estático (salva dentro de `/public`) não onerando contas de cloud durante o desenvolvimento.
- **Micro-Admin Panel:** Acessível via `/admin`, um painel incrível para visualização responsiva baseada em vetor (`<svg>`) para gerenciar as coordenadas virtuais das fotos em cima do layout-base.
- **Compartilhamento Nativo:** Integrações com API nativa de "Share" (celulares e tablets), além de botões diretos para LinkedIn, WhatsApp e X (Twitter).
- **Design de Alta Conversão:** Feito em Tailwind CSS v4 com "Glassmorphism", Dark Theme avançado, noise overlay, microinterações e sombras otimizadas.

---

## ⚙️ Tecnologias Utilizadas

- **[Next.js](https://nextjs.org/)** (App Router - Fullstack)
- **[React 19](https://react.dev/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** (Sistema de estilos moderno importado com zero-config via CSS)
- **[Sharp](https://sharp.pixelplumbing.com/)** (Para manipulações avançadas de imagem no servidor)
- **[Vercel Blob](https://vercel.com/)** (Como Storage bucket na nuvem)
- **[Lucide React](https://lucide.dev/)** (Kit de Ícones SVG moderno e leve)
- **[Jotai](https://jotai.org/) & [Nanoid](https://github.com/ai/nanoid)**
- **TypeScript**

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js (preferencialmente versão 20 ou superior)
- `pnpm` gerenciador de pacotes instalado (ou `npm` / `yarn`)

### Passo a Passo

1. **Clone do repositório** (se ainda não o tiver)

   ```bash
   git clone git@github.com:GermanoDevelopment/magic-banner-generate.git
   cd magic-banner
   ```

2. **Instalação das dependências**

   ```bash
   pnpm install
   ```

3. **Inicie o servidor local de desenvolvimento**

   ```bash
   pnpm dev
   ```

4. **Testando a Aplicação:**
   - Acesse **`http://localhost:3000`** no seu navegador para ver a página HOME do projeto.
   - Acesse **`http://localhost:3000/admin`** para testar e criar molduras de templates customizadas no Painel Vistual Mocado.
   - Você pode enviar quantas imagens quiser, em modo DEV, as imagens salvas caem em `public/banners` e o JSON do admin salva em `data/events.json`.

> **Dica e Troubleshooting (Port is in use):** Se você por acaso rodar o `pnpm dev` e constar erro de porta 3000, verifique se algum terminal não ficou em background ativo. Para matar os processos: `pkill node` ou use porta alternativa.

---

## 🛠 Arquitetura do Sistema

- `app/`: Nova estrutura _App Router_ do Next.js. Contém o layout master, home, páginas de upload (`/eventos/[id]`), landing pages de arte final (`/banner/[id]`) e também o painel adm (`/admin`).
- `app/api/`: Rotas independentes server-side (Backend API) do projeto Next.
- `lib/`: Classes, Conexões e Processamento. Encontraremos `db.ts` servindo as configs persistidas, `imageProcessor.ts` que manipula o processamento complexo das imagens via Sharp, e `storage.ts` que providencia o Upload dinâmico pro lugar correto (Server vs Vercel).
- `components/`: Bibliotecas JSX puras e reutilizáveis pro ecosistema (botões de compartilhar, cards interativos, form de dropzone animado).
- `public/`: Diretório base visível via Web. Guarda seus templates originais mockados, arquivos base, a brand noise e imagens temporárias.

---

## 🤝 Autor e Direitos

Projeto idealizado, projetado e desenvolvido por [**(G-Dev)**](https://github.com/GermanoDevelopment). O código aqui presente é destinado como prova de conceito para criadores de conteúdo e promotores de eventos de alto calibre que querem tracionar a captação digital do seu público.

© 2026 G-Dev Todos os Direitos Reservados.
