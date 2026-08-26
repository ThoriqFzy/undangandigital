/**
 * WISHES / UCAPAN COMPONENT — React Island
 * Source: REFERENCE.md Section 20-21
 */

import { useState, useEffect } from "react";

interface Wish {
  name: string;
  message: string;
  createdAt: string;
}

interface WishesProps {
  initialWishes: Wish[];
  invitationSlug: string;
  guestName?: string;
}

export default function Wishes({ initialWishes, invitationSlug, guestName }: WishesProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [name, setName] = useState(guestName || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Nama wajib diisi"); return; }
    if (!message.trim()) { setError("Ucapan wajib diisi"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invitation/${invitationSlug}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Gagal mengirim ucapan");
      }

      const newWish: Wish = {
        name: name.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };
      setWishes([newWish, ...wishes]);
      setMessage("");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="wishes" className="invitation-section bg-[var(--color-background)]">
      <div className="mx-auto max-w-sm space-y-6">
        {/* Heading */}
        <div className="text-center">
          <p className="mb-1 font-[family-name:var(--font-accent)] text-base text-[var(--color-accent)]">Ucapan & Doa</p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--color-text)]">Kirim Ucapan</h2>
        </div>

        {/* Form */}
        {!submitted && (
          <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-5 shadow-sm">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              readOnly={!!guestName}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--color-primary)] py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Ucapan"}
            </button>
          </form>
        )}

        {submitted && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-sm text-green-700">✓ Ucapan Anda telah terkirim. Terima kasih!</p>
          </div>
        )}

        {/* Wish list */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-[var(--color-text-muted)]">
            {wishes.length} ucapan
          </p>
          {wishes.map((wish, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface)] p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-semibold text-[var(--color-primary)]">
                  {wish.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[var(--color-text)]">{wish.name}</span>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{wish.message}</p>
              <p className="mt-2 text-[10px] text-[var(--color-text-light)]">
                {new Date(wish.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
