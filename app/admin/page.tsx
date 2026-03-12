"use client";

import { useState, useEffect, useRef } from "react";
import { EventConfig } from "@/lib/db";
import { Loader2, Plus, Edit2, CheckCircle2, AlertCircle, Settings2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Current Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "", top: 370, left: 30, width: 400, height: 400, shape: "circle" as "circle" | "rectangle"
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");

  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (evt: EventConfig) => {
    setEditingId(evt.id);
    setForm({
      nome: evt.nome,
      top: evt.overlay.top,
      left: evt.overlay.left,
      width: evt.overlay.width,
      height: evt.overlay.height,
      shape: evt.overlay.shape || "circle"
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nome: "", top: 370, left: 30, width: 400, height: 400, shape: "circle" });
    setFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoad(true);
    setErrorMSG("");

    const formData = new FormData();
    if (editingId) formData.append("id", editingId);
    formData.append("nome", form.nome);
    formData.append("top", form.top.toString());
    formData.append("left", form.left.toString());
    formData.append("width", form.width.toString());
    formData.append("height", form.height.toString());
    formData.append("shape", form.shape);
    if (file) formData.append("template", file);

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);
      
      setEvents(data.events);
      cancelEdit();
      router.refresh(); // Refresh app to show on home!
    } catch(err: any) {
      setErrorMSG(err.message);
    } finally {
      setSubmitLoad(false);
    }
  };

  // Live Preview Component
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [realSize, setRealSize] = useState<{w:number, h:number}>({w: 1080, h: 1080});
  
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
      
      const img = new Image();
      img.onload = () => {
         setRealSize({ w: img.width, h: img.height });
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    } else {
       setPreviewURL(null);
    }
  }, [file]);

  // Handle existing image sizing organically by mounting invisible image in effect
  useEffect(() => {
    if (editingId && !file) {
       const existingImg = events.find(e => e.id === editingId)?.templatePath;
       if (existingImg) {
          const img = new Image();
          img.onload = () => setRealSize({ w: img.width, h: img.height });
          img.src = existingImg;
       }
    }
  }, [editingId, file, events]);

  const existingImg = editingId ? events.find(e => e.id === editingId)?.templatePath : null;
  const currentBG = previewURL || existingImg || null;

  return (
    <div className="flex flex-col w-full min-h-[80vh] gap-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-6 sm:mb-4 gap-4">
         <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-outfit)] text-white flex items-center gap-3">
              <Settings2 className="text-indigo-400" /> Magic Panel
            </h1>
            <p className="text-slate-400 mt-2">Configure templates e a posição da área de corte em tempo real.</p>
         </div>
         <Link href="/" className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition">Ver Aplicação</Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Lado Esquerdo - Formulário */}
        <div className="w-full lg:w-1/2 bg-slate-800/60 p-6 sm:p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl relative">
          <h2 className="text-xl font-bold text-white mb-6">
            {editingId ? "Editando Evento" : "Criar Novo Evento"}
          </h2>
          
          {errorMSG && (
            <div className="p-4 mb-6 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20 flex gap-2 items-center">
              <AlertCircle className="w-5 h-5 flex-shrink-0" /> {errorMSG}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
               <label className="text-slate-400 text-sm font-medium mb-1 block">Nome do Evento</label>
               <input 
                 required 
                 value={form.nome} 
                 onChange={e => setForm({...form, nome: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                 placeholder="Ex: Conf Tech 2026"
               />
            </div>

            <div>
               <label className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                 Template Base (.PNG é recomendado)
               </label>
               <label className="w-full relative flex items-center justify-center border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 rounded-xl px-4 py-5 cursor-pointer transition-colors group">
                  <input 
                    type="file" accept="image/*" 
                    onChange={e => e.target.files && setFile(e.target.files[0])} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    required={!editingId}
                  />
                  <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-indigo-400">
                     <ImageIcon className="w-6 h-6" />
                     <span className="text-sm font-medium">{file ? file.name : (editingId ? "Substituir Imagem Atual" : "Escolher Arquivo")}</span>
                  </div>
               </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-slate-400 text-xs font-medium block mb-1">Eixo X (Esquerda)</label>
                 <input type="number" required value={form.left} onChange={e => setForm({...form, left: parseInt(e.target.value)||0})} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
               </div>
               <div>
                 <label className="text-slate-400 text-xs font-medium block mb-1">Eixo Y (Topo)</label>
                 <input type="number" required value={form.top} onChange={e => setForm({...form, top: parseInt(e.target.value)||0})} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
               </div>
               <div>
                 <label className="text-slate-400 text-xs font-medium block mb-1">Largura</label>
                 <input type="number" required value={form.width} onChange={e => setForm({...form, width: parseInt(e.target.value)||0})} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
               </div>
               <div>
                 <label className="text-slate-400 text-xs font-medium block mb-1">Altura</label>
                 <input type="number" required value={form.height} onChange={e => setForm({...form, height: parseInt(e.target.value)||0})} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white" />
               </div>
            </div>

            <div>
               <label className="text-slate-400 text-sm font-medium mb-1 block">Formato da Máscara (corte inferior)</label>
               <select value={form.shape} onChange={e => setForm({...form, shape: e.target.value as any})} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500">
                  <option value="rectangle">Retangular (Preenchimento Padrão)</option>
                  <option value="circle">Circular (Mascarado com Bordas Arredondadas)</option>
               </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {editingId && (
                <button type="button" onClick={cancelEdit} className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 transition">Cancelar</button>
              )}
              <button disabled={submitLoad} type="submit" className="w-full sm:flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg disabled:opacity-50 transition flex justify-center items-center gap-2">
                 {submitLoad ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? "Salvar Alterações" : "Criar Evento")}
              </button>
            </div>

          </form>
        </div>

        {/* Lado Direito - Live Preview da Escala */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            Visualizador do Layout Base (Mockup)
          </h2>
          <div className="w-full bg-black/60 rounded-[2rem] border-2 border-slate-700/50 overflow-hidden relative shadow-2xl flex items-center justify-center">
             {currentBG ? (
               <div className="relative inline-block leading-none">
                 {/* 
                    Aqui renderizamos a imagem crua e o overlay fica num formato absoluto (position absolute) 
                    onde os valores em pixels inseridos no form batem 1:1 com os dimensões REAIS da imagem de template enviada!
                    Utilizamos scale css para bater na tela do Admin sem cortar.
                 */}
                 <img src={currentBG} alt="BG" className="w-full h-auto object-contain max-h-[70vh] opacity-80" />
                 
                 <svg 
                   viewBox={`0 0 ${realSize.w} ${realSize.h}`} 
                   className="absolute inset-0 w-full h-full pointer-events-none"
                   preserveAspectRatio="xMidYMid meet"
                 >
                   {form.shape === "circle" ? (
                     <circle 
                       cx={form.left + (form.width / 2)} 
                       cy={form.top + (form.height / 2)} 
                       r={Math.min(form.width, form.height) / 2} 
                       fill="rgba(99, 102, 241, 0.2)"
                       stroke="#818cf8"
                       strokeWidth="4"
                       strokeDasharray="10 5"
                     />
                   ) : (
                     <rect 
                       x={form.left} 
                       y={form.top} 
                       width={form.width} 
                       height={form.height} 
                       fill="rgba(99, 102, 241, 0.2)"
                       stroke="#818cf8"
                       strokeWidth="4"
                       strokeDasharray="10 5"
                       rx="8"
                     />
                   )}
                 </svg>
                 <div className="absolute inset-0 pointer-events-none flex opacity-50 justify-center items-center text-indigo-300 font-bold text-lg text-shadow-sm">
                 </div>
               </div>
             ) : (
                <div className="w-full h-full aspect-square flex items-center justify-center text-slate-500 p-10 text-center">
                   Insira ou selecione um evento para carregar a prévia visual interativa do posicionamento real.
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Tabela de Eventos */}
      <div className="w-full mt-4">
         <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Meus Eventos Salvos</h2>
         
         {loading ? (
           <div className="flex items-center gap-3 text-slate-400 py-10 justify-center"><Loader2 className="animate-spin w-5 h-5" /> Carregando banco...</div>
         ) : events.length === 0 ? (
           <div className="p-8 text-center bg-slate-800/40 border border-slate-700 rounded-3xl text-slate-400">Nenhum evento registrado ainda.</div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {events.map(evt => (
               <div key={evt.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
                 <div className="flex items-start justify-between mb-4 gap-4">
                    <img src={evt.templatePath} className="w-16 h-16 rounded-xl object-cover bg-black" />
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg leading-tight">{evt.nome}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{evt.id}</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900 p-3 rounded-xl mb-4">
                   <p>X: <strong className="text-slate-200">{evt.overlay.left}</strong></p>
                   <p>Y: <strong className="text-slate-200">{evt.overlay.top}</strong></p>
                   <p>W: <strong className="text-slate-200">{evt.overlay.width}px</strong></p>
                   <p>Shape: <strong className="text-slate-200">{evt.overlay.shape}</strong></p>
                 </div>

                 <button onClick={() => handleEdit(evt)} className="w-full py-2.5 rounded-lg border border-indigo-500/50 text-indigo-400 font-medium flex justify-center items-center gap-2 hover:bg-indigo-500/10 transition">
                   <Edit2 className="w-4 h-4" /> Configurar Template
                 </button>
               </div>
             ))}
           </div>
         )}
      </div>

    </div>
  );
}
