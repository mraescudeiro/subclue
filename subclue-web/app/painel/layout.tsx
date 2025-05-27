// subclue‑web/app/painel/layout.tsx
import ProtectedRoute from "../../components/ProtectedRoute";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
