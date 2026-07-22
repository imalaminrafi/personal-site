import { Link as LinkIcon, MessageCircle, Send, Share2 } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const buttons = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: "bg-[#1877F2] hover:bg-[#0d65d9]", icon: MessageCircle },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: "bg-zinc-900 dark:bg-zinc-100 hover:opacity-80", content: "𝕏" },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: "bg-[#0A66C2] hover:bg-[#094e94]", icon: Share2 },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: "bg-[#25D366] hover:bg-[#1da851]", icon: MessageCircle },
    { name: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, color: "bg-[#0088cc] hover:bg-[#006fa8]", icon: Send },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {buttons.map((b) => (
        <a key={b.name} href={b.href} target="_blank" rel="noopener noreferrer" title={b.name} className={`w-9 h-9 rounded-xl ${b.color} text-white flex items-center justify-center transition-all`}>
          {b.icon ? <b.icon className="w-4 h-4" /> : <span className="text-xs font-bold">{b.content}</span>}
        </a>
      ))}
      <button onClick={copyLink} title="Copy Link" className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all relative">
        <LinkIcon className="w-4 h-4" />
        {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">Copied!</span>}
      </button>
    </div>
  );
}
