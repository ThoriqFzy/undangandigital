/**
 * COUNTDOWN COMPONENT — React Island
 * Source: REFERENCE.md Section 10
 * 
 * Live countdown to wedding event.
 * Timezone-aware. Graceful after event passes.
 */

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;  // ISO date string
  timezone?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-xl font-semibold text-white shadow-md sm:h-16 sm:w-16 sm:text-2xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-2 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(new Date(targetDate)));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(targetDate)));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <section id="countdown" className="invitation-section bg-[var(--color-background)]">
        <div className="mx-auto max-w-sm text-center">
          <p className="mb-1 font-[family-name:var(--font-accent)] text-base text-[var(--color-accent)]">Save the Date</p>
          <h2 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--color-text)]">Hitung Mundur</h2>
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[var(--color-surface-soft)]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const isPast = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <section id="countdown" className="invitation-section bg-[var(--color-background)]">
      <div className="mx-auto max-w-sm text-center">
        <p className="mb-1 font-[family-name:var(--font-accent)] text-base text-[var(--color-accent)]">Save the Date</p>
        <h2 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--color-text)]">
          {isPast ? 'Acara Sudah Berlangsung' : 'Hitung Mundur'}
        </h2>

        {!isPast && (
          <div className="flex justify-center gap-3">
            <TimeUnit value={timeLeft.days} label="Hari" />
            <TimeUnit value={timeLeft.hours} label="Jam" />
            <TimeUnit value={timeLeft.minutes} label="Menit" />
            <TimeUnit value={timeLeft.seconds} label="Detik" />
          </div>
        )}
      </div>
    </section>
  );
}
