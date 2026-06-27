// SiteHeader.tsx
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
// import { NotificationBell } from "../NotificationBell/NotificationBell"
import { User } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b px-4 lg:px-6 bg-background">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="mx-2 h-4" />

        <h1 className="hidden sm:block text-base font-medium">
          Dashboard
        </h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="ml-auto flex items-center gap-3">

        {/* SEARCH */}
        <div className="relative hidden">
          <Input
            placeholder="Search products..."
            className="w-[240px] pl-9 focus-visible:ring-1"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* USER SECTION */}
        <div className="flex items-center gap-3">

          {/* <NotificationBell /> */}

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">

            {/* TEXT */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                TitanPOS
              </span>
              <span className="text-[10px] font-medium text-slate-400 font-mono">
                user@titanpos.com
              </span>
            </div>

          </div>
        </div>

      </div>
    </header>
  )
}