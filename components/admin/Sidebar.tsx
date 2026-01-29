"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  ShoppingBag,
  Briefcase,
  Truck,
  Tags,
  ClipboardList,
  ShieldAlert,
  LayoutDashboard,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Empleados", href: "/admin/empleados", icon: Briefcase },
  { label: "Proveedores", href: "/admin/proveedores", icon: Truck },
  { label: "Categorías", href: "/admin/categorias", icon: Tags },
  { label: "Productos", href: "/admin/productos", icon: ShoppingBag },
  { label: "Ordenes", href: "/admin/ordenes", icon: ClipboardList },
  { label: "Auditoria", href: "/admin/auditoria", icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center border-b dark:border-zinc-800 px-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          DistriSystem
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                        }
                    `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-zinc-500">admin@system.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
