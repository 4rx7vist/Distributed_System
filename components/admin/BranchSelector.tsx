"use client";

import { useBranch, BranchType } from "@/components/providers/BranchProvider";
import { ChevronDown, Globe, MapPin } from "lucide-react";

export function BranchSelector() {
  const { branch, setBranch } = useBranch();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-md shadow-sm text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
        {branch === "GLOBAL" ? (
          <Globe className="w-4 h-4 text-blue-500" />
        ) : (
          <MapPin className="w-4 h-4 text-emerald-500" />
        )}
        <span>
          {branch === "GLOBAL"
            ? "Vista Global"
            : branch === "GUAYAQUIL"
              ? "Sucursal Guayaquil"
              : "Sucursal Quito"}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </button>

      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-1">
          <BranchOption
            label="Vista Global"
            value="GLOBAL"
            current={branch}
            set={setBranch}
            icon={<Globe className="w-4 h-4" />}
          />
          <div className="h-px bg-zinc-100 dark:bg-zinc-700 my-1" />
          <BranchOption
            label="Guayaquil"
            value="GUAYAQUIL"
            current={branch}
            set={setBranch}
            icon={<MapPin className="w-4 h-4" />}
          />
          <BranchOption
            label="Quito"
            value="QUITO"
            current={branch}
            set={setBranch}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
}

function BranchOption({
  label,
  value,
  current,
  set,
  icon,
}: {
  label: string;
  value: BranchType;
  current: BranchType;
  set: (b: BranchType) => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={() => set(value)}
      className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-zinc-50 dark:hover:bg-zinc-700
        ${current === value ? "text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20" : "text-zinc-700 dark:text-zinc-300"}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
