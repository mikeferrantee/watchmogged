import { formatUsd } from "@watchmogged/utils";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">WATCHMOGGED</h1>
      <p>Sample value: {formatUsd(12_500_000)}</p>
    </main>
  );
}
