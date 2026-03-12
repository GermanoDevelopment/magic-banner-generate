'use client';

import {
  Download,
  Share2,
  Linkedin,
  Twitter,
  MessageCircle,
} from 'lucide-react';

export function ShareButtons({
  bannerUrl,
  eventName,
}: {
  bannerUrl: string;
  eventName: string;
}) {
  const shareText = `Olha o banner incrível que eu gerei para o ${eventName}! 🎉 Vamos juntos?`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName,
          text: shareText,
          url: bannerUrl,
        });
      } catch (err) {
        console.error('Erro ao compartilhar', err);
      }
    } else {
      alert('Seu navegador não suporta compartilhamento nativo.');
    }
  };

  const encodedUrl = encodeURIComponent(bannerUrl);
  const encodedText = encodeURIComponent(shareText);

  const links = {
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-3">
        <a
          href={bannerUrl}
          download="banner-oficial.png"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-2xl border border-slate-600 bg-slate-700/80 px-5 py-4 font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-slate-600"
        >
          <Download className="h-5 w-5 text-slate-300" /> Salvar em Alta
          Qualidade
        </a>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 font-medium text-white shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.02] hover:from-purple-500 hover:to-indigo-500"
        >
          <Share2 className="h-5 w-5 text-purple-200" /> Compartilhar Agora
        </button>
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-700/80"></div>
        <span className="mx-4 flex-shrink-0 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Ou usar
        </span>
        <div className="flex-grow border-t border-slate-700/80"></div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-400 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
          title="WhatsApp"
        >
          <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
        </a>
        <a
          href={links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-400 transition-colors hover:border-[#1DA1F2] hover:text-[#1DA1F2]"
          title="Twitter"
        >
          <Twitter className="h-6 w-6 transition-transform group-hover:scale-110" />
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-400 transition-colors hover:border-[#0077B5] hover:text-[#0077B5]"
          title="LinkedIn"
        >
          <Linkedin className="h-6 w-6 transition-transform group-hover:scale-110" />
        </a>
      </div>
    </div>
  );
}
