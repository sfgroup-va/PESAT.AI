"use client";

import { useEffect, useRef, useState } from "react";

type PayPalDepositButtonsProps = {
  clientId: string;
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: unknown) => {
        render: (element: HTMLElement) => void;
      };
    };
  }
}

function loadPayPalScript(clientId: string, currency = "USD"): Promise<void> {
  const existing = document.getElementById("paypal-deposit-sdk") as HTMLScriptElement | null;
  if (existing && existing.dataset.loaded === "true") {
    return Promise.resolve();
  }
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Gagal memuat PayPal SDK.")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "paypal-deposit-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture&components=buttons`;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () => reject(new Error("Gagal memuat PayPal SDK.")));
    document.body.appendChild(script);
  });
}

export function PayPalDepositButtons({ clientId }: PayPalDepositButtonsProps) {
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [message, setMessage] = useState("");
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!clientId) {
      setStatus("error");
      setMessage("PayPal Client ID belum dikonfigurasi.");
      return;
    }

    let cancelled = false;
    loadPayPalScript(clientId)
      .then(() => {
        if (cancelled || !buttonRef.current || !window.paypal) return;

        window.paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "pay"
            },
            createOrder: async () => {
              setMessage("");
              const response = await fetch("/api/paypal/order", { method: "POST" });
              const data = (await response.json().catch(() => ({}))) as { orderID?: string; error?: string };
              if (!response.ok || !data.orderID) {
                throw new Error(data.error || "Gagal membuat order PayPal.");
              }
              return data.orderID;
            },
            onApprove: async (data: { orderID: string }) => {
              const response = await fetch("/api/paypal/capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID })
              });
              const result = (await response.json().catch(() => ({}))) as { error?: string };
              if (!response.ok) {
                setMessage(result.error || "Pembayaran gagal dicapture.");
                return;
              }
              window.location.href = `/deposit/thank-you?order_id=${encodeURIComponent(data.orderID)}`;
            },
            onError: (err: unknown) => {
              setMessage(err instanceof Error ? err.message : "Terjadi kesalahan pada PayPal.");
            },
            onCancel: () => {
              setMessage("Pembayaran dibatalkan.");
            }
          })
          .render(buttonRef.current);

        setStatus("ready");
      })
      .catch((err: unknown) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Gagal memuat PayPal.");
      });
    /* eslint-enable react-hooks/set-state-in-effect */

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return (
    <div className="min-h-[150px]">
      {status === "loading" ? (
        <p className="text-sm text-neutral-500">Memuat tombol PayPal...</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-semibold text-red-600">{message || "PayPal tidak tersedia."}</p>
      ) : null}
      <div ref={buttonRef} />
      {status === "ready" && message ? (
        <p className="mt-3 text-sm font-semibold text-red-600">{message}</p>
      ) : null}
    </div>
  );
}
