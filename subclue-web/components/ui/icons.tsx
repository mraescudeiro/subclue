// Local do arquivo: subclue-web/components/ui/icons.tsx
import {
  Moon,
  SunMedium,
  Laptop, // Exemplo, pode remover se não usar
  Loader2, // Ícone de Spinner/Loading
  AlertTriangle, // Ícone de Aviso/Erro
  Eye,      // Ícone de olho (mostrar senha)
  EyeOff,   // Ícone de olho cortado (esconder senha)
  // NÃO importe 'Google' daqui para o botão de login; use FcGoogle de react-icons/fc
  type Icon as LucideIcon, // Para tipagem, se necessário
} from "lucide-react"

// Exporta o tipo Icon se você precisar dele em outros lugares
export type Icon = LucideIcon

// Objeto que mapeia nomes amigáveis para os componentes de ícone
export const Icons = {
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,          // Exemplo
  spinner: Loader2,
  warning: AlertTriangle,
  eye: Eye,                // Mapeia 'eye' para o componente Eye
  eyeOff: EyeOff,          // Mapeia 'eyeOff' para o componente EyeOff
  // Não adicione 'google: Google' aqui se você usa FcGoogle para o botão de login.
}
