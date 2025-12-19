import React, { useState, useEffect } from "react";
import { Send, Trash2, Sparkles } from "lucide-react";
import { Wish } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { buildEmailHtml } from "./emailTemplate";
import { useAuth } from "../hooks/useAuth";
import { emailAPI } from "../api/client";

// Brighter, neon-like sticky colors for dark mode
const STICKY_COLORS = [
  "bg-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-white",
  "bg-green-500/80 shadow-[0_0_20px_rgba(34,197,94,0.4)] text-white",
  "bg-yellow-500/80 shadow-[0_0_20px_rgba(234,179,8,0.4)] text-black",
  "bg-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white",
  "bg-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white",
];

const WishWall: React.FC = () => {
  // Sent items displayed in-session (not persisted long-term)
  const [sent, setSent] = useState<Wish[]>([]);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { getToken } = useAuth();

  const addSent = (item: Wish) => {
    setSent((s) => [item, ...s]);
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Try sending via a backend API; if that fails, fallback to opening mailto: link
  const sendEmail = async (to: string, body: string) => {
    setLoading(true);
    setStatus(null);
    const newWish: Wish = {
      id: Date.now().toString(),
      name: to,
      message: body,
      color: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)],
      rotation: Math.random() * 10 - 5,
    };

    try {
      const html = buildEmailHtml(body, sender || "Your Friend");
      const token = getToken();
      
      // 使用 API 服务发送邮件
      const result = await emailAPI.sendEmail(to, "Holiday Wishes from Merry-Christmas", html, token);

      if (result.ok) {
        setStatus("Email sent successfully! 🎄");
        addSent(newWish);
      } else {
        // fallback to mailto if endpoint not available
        throw new Error(result.error || "Send failed");
      }
    } catch (err) {
      // Fallback: open user's mail client with prefilled message
      const mailto = `mailto:${encodeURIComponent(
        to
      )}?subject=${encodeURIComponent(
        "Holiday Wishes"
      )}&body=${encodeURIComponent(message)}`;
      try {
        window.location.href = mailto;
        setStatus("Opened mail client as fallback. Please send manually.");
        addSent(newWish);
      } catch (e) {
        setStatus(
          "Failed to send email. No backend available and mailto fallback blocked."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !message.trim())
      return setStatus("Please fill in recipient and message.");
    if (!validateEmail(recipient.trim()))
      return setStatus("Please enter a valid email address.");

    sendEmail(recipient.trim(), message.trim());
    setRecipient("");
    setMessage("");
  };

  const deleteWish = (id: string) => {
    setSent((s) => s.filter((w) => w.id !== id));
  };

  return (
    <div className="py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl text-white mb-4 festive-font text-glow">
            Wish Wall
          </h2>
          <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Send your best wishes to friends and family!
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </p>
        </div>

        {/* Glass Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel-heavy p-8 rounded-3xl max-w-lg mx-auto mb-16 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold text-green-300 uppercase tracking-wider mb-2">
                Send by
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Your Name"
                maxLength={40}
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-white placeholder-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-green-300 uppercase tracking-wider mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="friend@example.com"
                maxLength={100}
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-white placeholder-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-green-300 uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Wishing you joy and peace this holiday season..."
                maxLength={500}
                rows={4}
                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-white placeholder-white/30 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-red-900/50 transform transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              <Send size={18} />
              Send Wish
            </button>
          </form>
        </motion.div>

        {/* Grid of Wishes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          <AnimatePresence>
            {sent.map((wish) => (
              <motion.div
                key={wish.id}
                layout
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: wish.rotation }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                className={`p-6 rounded-xl backdrop-blur-sm cursor-pointer relative group transition-shadow duration-300 ${wish.color}`}
              >
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black/20 rounded-full shadow-inner"></div>

                <p className="font-handwriting text-lg mb-4 break-words leading-relaxed font-semibold">
                  "{wish.message}"
                </p>
                <div className="flex justify-between items-center border-t border-black/10 pt-3 mt-2">
                  <span className="text-xs font-bold opacity-80 uppercase tracking-wide">
                    {wish.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWish(wish.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-black/50 hover:text-black transition-all bg-white/20 p-1.5 rounded-full hover:bg-white/40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {sent.length === 0 && (
          <div className="text-center text-white/30 mt-10">
            No sent messages yet. Send a blessing!
          </div>
        )}
      </div>
    </div>
  );
};

export default WishWall;
