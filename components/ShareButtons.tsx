"use client";

import { Download, Share2, Linkedin, Twitter, MessageCircle } from "lucide-react";

export function ShareButtons({ bannerUrl, eventName }: { bannerUrl: string; eventName: string }) {
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
        console.error("Erro ao compartilhar", err);
      }
    } else {
      alert("Seu navegador não suporta compartilhamento nativo.");
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
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-3">
        <a 
          href={bannerUrl} 
          download="banner-oficial.png"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 py-4 px-5 rounded-2xl bg-slate-700/80 border border-slate-600 hover:bg-slate-600 text-white font-medium transition-all hover:scale-[1.02] shadow-sm"
        >
          <Download className="w-5 h-5 text-slate-300" /> Salvar em Alta Qualidade
        </a>
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-3 py-4 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-xl shadow-purple-500/20 transition-all hover:scale-[1.02]"
        >
          <Share2 className="w-5 h-5 text-purple-200" /> Compartilhar Agora
        </button>
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-700/80"></div>
        <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">Ou usar</span>
        <div className="flex-grow border-t border-slate-700/80"></div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-[#25D366] hover:text-[#25D366] text-slate-400 transition-colors group" title="WhatsApp">
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </a>
        <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-[#1DA1F2] hover:text-[#1DA1F2] text-slate-400 transition-colors group" title="Twitter">
          <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-[#0077B5] hover:text-[#0077B5] text-slate-400 transition-colors group" title="LinkedIn">
          <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
}
