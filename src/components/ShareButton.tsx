"use client";

export default function ShareButton() {
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan artikel telah disalin ke papan klip!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-left text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer w-full text-left"
    >
      Bagikan artikel →
    </button>
  );
}
