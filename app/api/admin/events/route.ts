import { NextRequest, NextResponse } from "next/server";
import { getEvents, saveEvents, EventConfig, EventShape } from "@/lib/db";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";

// GET /api/admin/events -> retorna todos
export async function GET() {
  const events = await getEvents();
  return NextResponse.json({ events });
}

// POST /api/admin/events -> cria ou edita um evento
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const id = formData.get("id") as string | null;
    const nome = formData.get("nome") as string;
    const top = Number(formData.get("top"));
    const left = Number(formData.get("left"));
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));
    const shape = formData.get("shape") as EventShape;
    const templateFile = formData.get("template") as File | null;
    
    if (!nome || isNaN(width) || isNaN(height)) {
      return NextResponse.json({ erro: "Dados obrigatórios inválidos." }, { status: 400 });
    }

    const events = await getEvents();
    let templatePathStr = "";

    // Upload / Salvar o arquivo do template
    if (templateFile && templateFile.size > 0) {
      if (process.env.NODE_ENV === "development") {
        const ext = path.extname(templateFile.name) || ".png";
        const filename = `template-${Date.now()}${ext}`;
        const templateDir = path.join(process.cwd(), "public", "templates");
        await fs.mkdir(templateDir, { recursive: true });
        
        const fileBuffer = Buffer.from(await templateFile.arrayBuffer());
        await fs.writeFile(path.join(templateDir, filename), fileBuffer);
        templatePathStr = `/templates/${filename}`;
      } else {
        const ext = path.extname(templateFile.name) || ".png";
        const filename = `templates/template-${Date.now()}${ext}`;
        const { url } = await put(filename, await templateFile.arrayBuffer(), {
          access: "public",
          contentType: templateFile.type,
        });
        // Na Vercel blob, usamos direct url. Então templatePath = URL. 
        // Em produção, imageProcessor vai precisar usar node-fetch pra pegar o buffer do template se ele não for local.
        // Vamos adaptar a lógica se necessário depois.
        templatePathStr = url;
      }
    }

    // Se é edição
    if (id) {
      const index = events.findIndex(e => e.id === id);
      if (index === -1) return NextResponse.json({ erro: "Evento não encontrado" }, { status: 404 });
      
      const evt = events[index];
      events[index] = {
        ...evt,
        nome,
        templatePath: templatePathStr !== "" ? templatePathStr : evt.templatePath,
        overlay: {
          top: isNaN(top) ? evt.overlay.top : top,
          left: isNaN(left) ? evt.overlay.left : left,
          width,
          height,
          shape: shape || evt.overlay.shape
        }
      };
    } else {
      // É criação
      if (templatePathStr === "") {
        return NextResponse.json({ erro: "É necessário enviar o template inicial." }, { status: 400 });
      }

      const newId = nanoid(8);
      events.push({
        id: newId,
        nome,
        templatePath: templatePathStr,
        overlay: { top, left, width, height, shape }
      });
    }

    await saveEvents(events);
    return NextResponse.json({ events }, { status: 200 });

  } catch (error: any) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ erro: "Erro ao salvar evento" }, { status: 500 });
  }
}
