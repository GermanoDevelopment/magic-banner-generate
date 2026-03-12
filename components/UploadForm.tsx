'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

export function UploadForm({ eventId }: { eventId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Formato inválido. Use JPG ou PNG.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Arquivo muito pesado, limite: 5MB.');
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
    if (!file) return setError('Arraste ou escolha uma imagem.');

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('foto', file);
    formData.append('eventoId', eventId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro ao gerar magia');
      router.push(`/banner/${data.bannerId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      <div
        className={`group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed shadow-lg transition-all duration-300 md:aspect-[4/3] ${isDragOver ? 'scale-[1.02] border-purple-400 bg-purple-500/10' : 'border-slate-600 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-700/50'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
          title="Clique para enviar a foto"
        />

        {preview ? (
          <div className="absolute inset-0 h-full w-full p-4">
            <img
              src={preview}
              alt="Prévia"
              className="h-full w-full rounded-[1.5rem] border border-white/10 object-cover shadow-xl"
            />
          </div>
        ) : (
          <div className="pointer-events-none z-10 flex flex-col items-center p-8 text-center text-slate-400 transition-colors group-hover:text-slate-300">
            <div className="mb-6 rounded-full bg-slate-800 p-4 shadow-inner ring-1 ring-slate-700 transition-all group-hover:bg-purple-900/20 group-hover:ring-purple-500/50">
              <UploadCloud className="h-10 w-10 text-slate-300 group-hover:text-purple-400" />
            </div>
            <p className="mb-2 text-xl font-semibold text-white/90">
              Faça o upload da sua foto
            </p>
            <p className="text-sm">Arraste para cá ou clique para buscar</p>
            <p className="mt-6 text-xs font-medium tracking-widest text-slate-500 uppercase">
              Apenas JPG ou PNG até 5MB
            </p>
          </div>
        )}

        {preview && (
          <div className="slide-in-from-top-4 animate-in absolute top-6 left-6 z-30 flex items-center gap-1.5 rounded-full border border-green-400/50 bg-green-500/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md">
            <CheckCircle2 className="h-3.5 w-3.5" /> Foto Carregada
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-900/50 bg-red-950/40 px-6 py-4 text-sm font-medium text-red-200">
          <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-red-500" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!file || loading}
        className="group relative w-full overflow-hidden rounded-2xl bg-slate-800 px-8 py-5 text-lg font-bold text-white shadow-xl transition-all disabled:cursor-not-allowed disabled:bg-slate-800 disabled:opacity-40"
      >
        {!loading && !file ? (
          <span className="relative z-10">Aguardando Foto...</span>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 transition-opacity group-hover:opacity-90"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" /> Em Processamento
                  (Renderizando...)
                </>
              ) : (
                'Gerar Imagem...'
              )}
            </span>
          </>
        )}
      </button>
    </form>
  );
}
