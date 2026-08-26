/**
 * RSVP FORM COMPONENT — React Island
 * Source: REFERENCE.md Section 18-19
 */

import { useState } from 'react';

interface RSVPProps {
  guestName?: string;
  guestId?: string;
  maxGuestCount?: number;
  invitationSlug: string;
}

interface RSVPFormData {
  status: "attending" | "not_attending" | "maybe";
  guestCount: number;
  message: string;
}

export default function RSVP({ guestName, guestId, maxGuestCount = 1, invitationSlug }: RSVPProps) {
  const [status, setStatus] = useState<RSVPFormData["status"] | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [name, setName] = useState(guestName || "");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status) { setError("Pilih kehadiran terlebih dahulu"); return; }
    if (!name.trim()) { setError("Nama wajib diisi"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invitation/${invitationSlug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId: guestId || undefined,
          name: name.trim(),
          status,
          guestCount,
          message: message.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Gagal mengirim RSVP");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="rsvp" className="invitation-section bg-[var(--color-background)]">
        <div className="mx-auto max-w-sm text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center mx-auto rounded-full bg-green-50">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="mb-2 font-[family-name:var(--font-heading)] text-xl font-semibold text-[var(--color-text)]">
            Terima Kasih!
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Konfirmasi kehadiran Anda telah diterima.
          </p>
        </div>
      </section>
    );
  }

  const statusOptions = [
    { value: "attending" as const, label: "Hadir", emoji: "✅" },
    { value: "not_attending" as const, label: "Tidak Hadir", emoji: "❌" },
    { value: "maybe" as const, label: "Masih Ragu", emoji: "🤔" },
  ];

  return (
    <section id="rsvp" className="invitation-section bg-[var(--color-background)]">
      <div className="mx-auto max-w-sm">
        {/* Heading */}
        <div className="mb-6 text-center">
          <p className="mb-1 font-[family-name:var(--font-accent)] text-base text-[var(--color-accent)]">Konfirmasi</p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--color-text)]">RSVP</h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Mohon konfirmasi kehadiran Anda sebelum tanggal acara.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              readOnly={!!guestName}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Status selection */}
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--color-text-muted)]">Kehadiran</label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-medium transition-all ${
                    status === opt.value
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-primary-soft)]"
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guest count */}
          {status === "attending" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Jumlah Tamu</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-lg font-semibold text-[var(--color-text)]">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(maxGuestCount, guestCount + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">Ucapan (Opsional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan untuk kedua mempelai..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-xs text-red-500">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[var(--color-primary)] py-3.5 text-sm font-medium text-white shadow-md transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Konfirmasi"}
          </button>
        </form>
      </div>
    </section>
  );
}
