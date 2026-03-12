"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export function UploadForm({ eventId }: { eventId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Formato inválido. Use JPG ou PNG.");
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Arquivo muito pesado, limite: 5MB.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Arraste ou escolha uma imagem.");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("eventoId", eventId);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || "Erro ao gerar magia");
      router.push(`/banner/${data.bannerId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div 
        className={`relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden group shadow-lg ${isDragOver ? 'border-purple-400 bg-purple-500/10 scale-[1.02]' : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/png, image/jpeg" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          title="Clique para enviar a foto"
        />
        
        {preview ? (
          <div className="absolute inset-0 p-4 w-full h-full">
            <img src={preview} alt="Prévia" className="w-full h-full object-cover rounded-[1.5rem] shadow-xl border border-white/10" />
          </div>
        ) : (
          <div className="text-center p-8 flex flex-col items-center text-slate-400 group-hover:text-slate-300 transition-colors z-10 pointer-events-none">
            <div className="p-4 rounded-full bg-slate-800 mb-6 shadow-inner ring-1 ring-slate-700 group-hover:ring-purple-500/50 group-hover:bg-purple-900/20 transition-all">
              <UploadCloud className="w-10 h-10 text-slate-300 group-hover:text-purple-400" />
            </div>
            <p className="font-semibold text-xl mb-2 text-white/90">Faça o upload da sua foto</p>
            <p className="text-sm">Arraste para cá ou clique para buscar</p>
            <p className="text-xs uppercase tracking-widest mt-6 font-medium text-slate-500">Apenas JPG ou PNG até 5MB</p>
          </div>
        )}

        {preview && (
          <div className="absolute top-6 left-6 z-30 bg-green-500/90 backdrop-blur-md text-white font-medium text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-green-400/50 shadow-lg slide-in-from-top-4 animate-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Foto Carregada
          </div>
        )}
      </div>

      {error && (
        <div className="px-6 py-4 rounded-2xl bg-red-950/40 text-red-200 text-sm font-medium border border-red-900/50 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!file || loading}
        className="w-full relative py-5 px-8 rounded-2xl font-bold text-white text-lg overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed bg-slate-800 disabled:bg-slate-800 shadow-xl transition-all"
      >
        {!loading && !file ? (
            <span className="relative z-10">Aguardando Foto...</span>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 group-hover:opacity-90 transition-opacity"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Em Processamento (Renderizando...)
                </>
              ) : (
                "Gerar Imagem Premium"
              )}
            </span>
          </>
        )}
      </button>
    </form>
  );
}
