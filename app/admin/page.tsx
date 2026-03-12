'use client';

import { useState, useEffect, useRef } from 'react';
import { EventConfig } from '@/lib/db';
import {
  Loader2,
  Plus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Current Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: '',
    top: 370,
    left: 30,
    width: 400,
    height: 400,
    shape: 'circle' as 'circle' | 'rectangle',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');

  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
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
      shape: evt.overlay.shape || 'circle',
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      nome: '',
      top: 370,
      left: 30,
      width: 400,
      height: 400,
      shape: 'circle',
    });
    setFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoad(true);
    setErrorMSG('');

    const formData = new FormData();
    if (editingId) formData.append('id', editingId);
    formData.append('nome', form.nome);
    formData.append('top', form.top.toString());
    formData.append('left', form.left.toString());
    formData.append('width', form.width.toString());
    formData.append('height', form.height.toString());
    formData.append('shape', form.shape);
    if (file) formData.append('template', file);

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro);

      setEvents(data.events);
      cancelEdit();
      router.refresh(); // Refresh app to show on home!
    } catch (err: any) {
      setErrorMSG(err.message);
    } finally {
      setSubmitLoad(false);
    }
  };

  // Live Preview Component
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [realSize, setRealSize] = useState<{ w: number; h: number }>({
    w: 1080,
    h: 1080,
  });

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
      const existingImg = events.find((e) => e.id === editingId)?.templatePath;
      if (existingImg) {
        const img = new Image();
        img.onload = () => setRealSize({ w: img.width, h: img.height });
        img.src = existingImg;
      }
    }
  }, [editingId, file, events]);

  const existingImg = editingId
    ? events.find((e) => e.id === editingId)?.templatePath
    : null;
  const currentBG = previewURL || existingImg || null;

  return (
    <div className="flex min-h-[80vh] w-full flex-col gap-12">
      <div className="mb-6 flex w-full flex-col items-start justify-between gap-4 sm:mb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-3 font-[family-name:var(--font-outfit)] text-2xl font-bold text-white sm:text-3xl">
            <Settings2 className="text-indigo-400" /> Magic Panel
          </h1>
          <p className="mt-2 text-slate-400">
            Configure templates e a posição da área de corte em tempo real.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          Ver Aplicação
        </Link>
      </div>

      <div className="flex flex-col items-start gap-10 lg:flex-row">
        {/* Lado Esquerdo - Formulário */}
        <div className="relative w-full rounded-[2rem] border border-slate-700/50 bg-slate-800/60 p-6 shadow-2xl sm:p-8 lg:w-1/2">
          <h2 className="mb-6 text-xl font-bold text-white">
            {editingId ? 'Editando Evento' : 'Criar Novo Evento'}
          </h2>

          {errorMSG && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" /> {errorMSG}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-400">
                Nome do Evento
              </label>
              <input
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white transition-colors focus:border-indigo-500 focus:outline-none"
                placeholder="Ex: Conf Tech 2026"
              />
            </div>

            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-400">
                Template Base (.PNG é recomendado)
              </label>
              <label className="group relative flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 px-4 py-5 transition-colors hover:bg-slate-800/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  required={!editingId}
                />
                <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-indigo-400">
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    {file
                      ? file.name
                      : editingId
                        ? 'Substituir Imagem Atual'
                        : 'Escolher Arquivo'}
                  </span>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Eixo X (Esquerda)
                </label>
                <input
                  type="number"
                  required
                  value={form.left}
                  onChange={(e) =>
                    setForm({ ...form, left: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Eixo Y (Topo)
                </label>
                <input
                  type="number"
                  required
                  value={form.top}
                  onChange={(e) =>
                    setForm({ ...form, top: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Largura
                </label>
                <input
                  type="number"
                  required
                  value={form.width}
                  onChange={(e) =>
                    setForm({ ...form, width: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Altura
                </label>
                <input
                  type="number"
                  required
                  value={form.height}
                  onChange={(e) =>
                    setForm({ ...form, height: parseInt(e.target.value) || 0 })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-400">
                Formato da Máscara (corte inferior)
              </label>
              <select
                value={form.shape}
                onChange={(e) =>
                  setForm({ ...form, shape: e.target.value as any })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="rectangle">
                  Retangular (Preenchimento Padrão)
                </option>
                <option value="circle">
                  Circular (Mascarado com Bordas Arredondadas)
                </option>
              </select>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full rounded-xl bg-slate-700 px-4 py-3 font-bold text-white transition hover:bg-slate-600 sm:flex-1"
                >
                  Cancelar
                </button>
              )}
              <button
                disabled={submitLoad}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-50 sm:flex-[2]"
              >
                {submitLoad ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : editingId ? (
                  'Salvar Alterações'
                ) : (
                  'Criar Evento'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Lado Direito - Live Preview da Escala */}
        <div className="w-full lg:sticky lg:top-10 lg:w-1/2">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            Visualizador do Layout Base (Mockup)
          </h2>
          <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[2rem] border-2 border-slate-700/50 bg-black/60 shadow-2xl">
            {currentBG ? (
              <div className="relative inline-block leading-none">
                {/* 
                    Aqui renderizamos a imagem crua e o overlay fica num formato absoluto (position absolute) 
                    onde os valores em pixels inseridos no form batem 1:1 com os dimensões REAIS da imagem de template enviada!
                    Utilizamos scale css para bater na tela do Admin sem cortar.
                 */}
                <img
                  src={currentBG}
                  alt="BG"
                  className="h-auto max-h-[70vh] w-full object-contain opacity-80"
                />

                <svg
                  viewBox={`0 0 ${realSize.w} ${realSize.h}`}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {form.shape === 'circle' ? (
                    <circle
                      cx={form.left + form.width / 2}
                      cy={form.top + form.height / 2}
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
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-lg font-bold text-indigo-300 opacity-50 text-shadow-sm"></div>
              </div>
            ) : (
              <div className="flex aspect-square h-full w-full items-center justify-center p-10 text-center text-slate-500">
                Insira ou selecione um evento para carregar a prévia visual
                interativa do posicionamento real.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Eventos */}
      <div className="mt-4 w-full">
        <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
          Meus Eventos Salvos
        </h2>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-10 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" /> Carregando banco...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-800/40 p-8 text-center text-slate-400">
            Nenhum evento registrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-800/80 p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <img
                    src={evt.templatePath}
                    className="h-16 w-16 rounded-xl bg-black object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg leading-tight font-bold text-white">
                      {evt.nome}
                    </h4>
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {evt.id}
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-900 p-3 text-xs text-slate-400">
                  <p>
                    X:{' '}
                    <strong className="text-slate-200">
                      {evt.overlay.left}
                    </strong>
                  </p>
                  <p>
                    Y:{' '}
                    <strong className="text-slate-200">
                      {evt.overlay.top}
                    </strong>
                  </p>
                  <p>
                    W:{' '}
                    <strong className="text-slate-200">
                      {evt.overlay.width}px
                    </strong>
                  </p>
                  <p>
                    Shape:{' '}
                    <strong className="text-slate-200">
                      {evt.overlay.shape}
                    </strong>
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(evt)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/50 py-2.5 font-medium text-indigo-400 transition hover:bg-indigo-500/10"
                >
                  <Edit2 className="h-4 w-4" /> Configurar Template
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
