"use client";

import { useEffect, useState } from "react";

interface OpeningSequenceProps {
  slug: string;
  themeOpening?: {
    wayangAssetId?: string;
    pepohonanAssetId?: string;
    rumahAssetId?: string;
    defaultButtonText?: string;
    defaultDuration?: number;
  };
  settings?: {
    enabled?: boolean;
    buttonText?: string;
    duration?: number;
    wayangAssetId?: string;
    pepohonanAssetId?: string;
    rumahAssetId?: string;
    couplePhotoAssetId?: string;
  };
  onOpen: () => void;
  assetBaseUrl?: string;
}

export default function OpeningSequence({
  slug,
  themeOpening = {},
  settings = {},
  onOpen,
  assetBaseUrl = "",
}: OpeningSequenceProps) {
  const [phase, setPhase] = useState<"idle" | "wayang" | "pepohonan" | "rumah" | "couple" | "done">(
    settings.enabled !== false ? "wayang" : "done"
  );

  const getAssetUrl = (id?: string) => (id ? `${assetBaseUrl}/${id}` : "");

  const wayangUrl = getAssetUrl(settings.wayangAssetId || themeOpening.wayangAssetId);
  const pepohonanUrl = getAssetUrl(settings.pepohonanAssetId || themeOpening.pepohonanAssetId);
  const rumahUrl = getAssetUrl(settings.rumahAssetId || themeOpening.rumahAssetId);
  const couplePhotoUrl = getAssetUrl(settings.couplePhotoAssetId);

  const buttonText = settings.buttonText || themeOpening.defaultButtonText || "Buka Undangan";
  const duration = settings.duration || themeOpening.defaultDuration || 3000;

  // Auto-advance through phases
  useEffect(() => {
    if (phase === "done" || phase === "idle" || phase === "couple") return;

    const phases: Array<"wayang" | "pepohonan" | "rumah" | "couple"> = [
      "wayang",
      "pepohonan",
      "rumah",
      "couple",
    ];
    const currentIndex = phases.indexOf(phase);
    if (currentIndex >= 0 && currentIndex < phases.length - 1) {
      const timer = setTimeout(() => setPhase(phases[currentIndex + 1]), duration);
      return () => clearTimeout(timer);
    }
  }, [phase, duration]);

  // Skip animation if disabled
  if (settings.enabled === false || phase === "done" || phase === "idle") {
    return null;
  }

  // Dynamic inline styles for fade transitions
  const fadeStyle = {
    position: "absolute" as const,
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-background)",
    opacity: 1,
    transition: `opacity ${duration}ms ease-out`,
  };

  const containerStyle = {
    position: "fixed" as const,
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-background)",
  };

  return (
    <div style={containerStyle} role="dialog" aria-label="Opening animation">
      {/* Wayang Phase */}
      {phase === "wayang" && wayangUrl && (
        <div style={fadeStyle}>
          <img
            src={wayangUrl}
            alt="Wayang silhouette"
            style={{
              maxWidth: "60%",
              maxHeight: "50%",
              objectFit: "contain",
              filter: "drop-shadow(0 0 30px rgba(0,0,0,0.3))",
            }}
          />
        </div>
      )}

      {/* Pepohonan Phase */}
      {phase === "pepohonan" && pepohonanUrl && (
        <div style={fadeStyle}>
          <img
            src={pepohonanUrl}
            alt="Pepohonan tropical"
            style={{ maxWidth: "100%", maxHeight: "70%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Rumah Phase */}
      {phase === "rumah" && rumahUrl && (
        <div style={fadeStyle}>
          <img
            src={rumahUrl}
            alt="Rumah tradisional"
            style={{ maxWidth: "80%", maxHeight: "60%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Couple Photo + Button Phase */}
      {phase === "couple" && couplePhotoUrl && (
        <div style={{ ...fadeStyle, flexDirection: "column", padding: "1.5rem", textAlign: "center" }}>
          <div style={{ marginBottom: "2rem", animation: "slideUp 0.8s ease-out" }}>
            <img
              src={couplePhotoUrl}
              alt="Pengantin"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid var(--color-primary)",
                boxShadow: "0 0 60px -10px var(--color-primary)",
              }}
            />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "0.5rem", animation: "slideUp 0.8s ease-out 0.2s both" }}>
            {slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" & ")}
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--color-primary)", marginBottom: "2rem", animation: "slideUp 0.8s ease-out 0.4s both" }}>
            Mengundang Anda
          </p>
          <button
            onClick={() => {
              setPhase("done");
              onOpen();
            }}
            style={{
              padding: "1rem 2.5rem",
              borderRadius: "9999px",
              backgroundColor: "var(--color-primary)",
              color: "white",
              fontSize: "1.125rem",
              fontWeight: "600",
              border: "2px solid var(--color-primary)",
              cursor: "pointer",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
              transition: "transform 0.2s, box-shadow 0.2s",
              animation: "slideUp 0.8s ease-out 0.6s both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 20px 35px -5px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.2)";
            }}
          >
            {buttonText}
          </button>
          <p style={{ marginTop: "2rem", fontSize: "0.75rem", color: "var(--color-text-muted)", animation: "fadeIn 1s ease-out 1.5s both" }}>
            Ketuk untuk memulai
          </p>
        </div>
      )}

      {/* Skip button */}
      {phase !== "couple" && (
        <button
          onClick={() => {
            setPhase("done");
            onOpen();
          }}
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 50,
            padding: "0.5rem 1rem",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            backgroundColor: "var(--color-surface)",
            borderRadius: "9999px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
            border: "none",
            cursor: "pointer",
            opacity: 0.5,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
          aria-label="Lewati animasi"
        >
          Lewati
        </button>
      )}
    </div>
  );
}