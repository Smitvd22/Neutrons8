import { UserCircle } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 px-6 flex items-center justify-end bg-black/20 backdrop-blur-sm border-b border-white/10">
      <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
        <UserCircle className="w-6 h-6 text-white" />
      </button>
    </header>
  )
}

