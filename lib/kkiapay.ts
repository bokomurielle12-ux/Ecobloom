// KKiaPay is a Benin-based payment aggregator. For this MVP we restrict
// checkout to MTN Mobile Money (KKiaPay also supports Moov/Celtiis if you
// want to widen this later — see the "partners" prop on the widget).
// Docs: https://docs.kkiapay.me
//
// Required env vars (see .env.example):
//   NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY  -> shown to the browser, safe to expose
//   KKIAPAY_PRIVATE_KEY             -> server-side only, used to verify transactions
//   NEXT_PUBLIC_KKIAPAY_SANDBOX     -> "true" while testing, "false" once live

interface KkiapayVerifyResponse {
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount?: number;
  transactionId?: string;
  paymentMethod?: string;
  [key: string]: unknown;
}

export function isKkiapayConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY && process.env.KKIAPAY_PRIVATE_KEY
  );
}

export async function verifyKkiapayTransaction(
  transactionId: string
): Promise<KkiapayVerifyResponse> {
  const privateKey = process.env.KKIAPAY_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    throw new Error(
      "KKiaPay n'est pas configuré : ajoute KKIAPAY_PRIVATE_KEY et NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY dans .env"
    );
  }

  const res = await fetch("https://api.kkiapay.me/api/v1/transactions/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": publicKey,
      Authorization: `Bearer ${privateKey}`,
    },
    body: JSON.stringify({ transactionId }),
  });

  if (!res.ok) {
    throw new Error(`Échec de la vérification KKiaPay (${res.status})`);
  }

  return res.json();
}
