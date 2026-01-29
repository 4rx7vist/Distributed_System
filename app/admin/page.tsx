"use client";

import { Users, Briefcase, ShoppingCart, DollarSign } from "lucide-react";
import { useBranch } from "@/components/providers/BranchProvider";
import { useEffect, useState } from "react";

interface DashboardStats {
  clients: number;
  orders: number;
  employees: number;
  revenue: number; // Placeholder as we don't have revenue logic yet
}

export default function AdminDashboard() {
  const { branch } = useBranch();
  const [stats, setStats] = useState<DashboardStats>({
    clients: 0,
    orders: 0,
    employees: 0,
    revenue: 12450, // Keep hardcoded for now
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/stats?branch=${branch}`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats((prev) => ({
          ...prev,
          clients: data.clients,
          orders: data.orders,
          employees: data.employees,
        }));
      } catch (err) {
        console.error(err);
        setError("Error loading stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [branch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <div className="flex flex-col items-end">
          <div className="text-sm text-zinc-500">
            Resumen del sistema ({branch})
          </div>
          {loading && (
            <span className="text-xs text-blue-500 animate-pulse">
              Updating...
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clientes"
          value={stats.clients.toString()}
          icon={Users}
          trend={loading ? "..." : "+12%"}
          loading={loading}
        />
        <StatCard
          title="Ordenes Activas"
          value={stats.orders.toString()}
          icon={ShoppingCart}
          trend={loading ? "..." : "+2"}
          loading={loading}
        />
        <StatCard
          title="Ingresos"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+8.1%"
          loading={loading}
        />
        <StatCard
          title="Empleados"
          value={stats.employees.toString()}
          icon={Briefcase}
          trend="0%"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border dark:border-zinc-800 h-64 flex items-center justify-center text-zinc-400">
          Chart Placeholder (Ventas por Sucursal)
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border dark:border-zinc-800 h-64 flex items-center justify-center text-zinc-400">
          Recent Activity Log
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border dark:border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-zinc-500">{title}</span>
        <Icon className="w-5 h-5 text-zinc-400" />
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={`text-3xl font-bold dark:text-white ${loading ? "opacity-50" : ""}`}
        >
          {value}
        </span>
        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
          {trend}
        </span>
      </div>
    </div>
  );
}
