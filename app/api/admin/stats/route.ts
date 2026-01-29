import { NextResponse } from "next/server";
import { query } from "@/lib/oracle";
import { getDistributedTable } from "@/lib/distributed";
import { BranchType } from "@/components/providers/BranchProvider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branch = (searchParams.get("branch") || "GLOBAL") as BranchType;

  console.log(`Fetching stats for branch: ${branch}`);

  try {
    const clientsTable = getDistributedTable("CLIENTES", branch);
    const ordersTable = getDistributedTable("ORDENES", branch);

    // For employees, we'll try to use the table from the map, but it might be worth checking if we should use the fragment
    // logic if the map returns 'EMPLEADOS' which might be a view.
    const employeesTable = getDistributedTable("EMPLEADOS", branch);

    // Run queries in parallel
    const [clientsRes, ordersRes, employeesRes] = await Promise.allSettled([
      query<{ COUNT: number }>(`SELECT COUNT(*) as COUNT FROM ${clientsTable}`),
      query<{ COUNT: number }>(`SELECT COUNT(*) as COUNT FROM ${ordersTable}`),
      query<{ COUNT: number }>(
        `SELECT COUNT(*) as COUNT FROM ${employeesTable}`,
      ),
    ]);

    const stats = {
      clients:
        clientsRes.status === "fulfilled" && clientsRes.value[0]
          ? clientsRes.value[0].COUNT
          : 0,
      orders:
        ordersRes.status === "fulfilled" && ordersRes.value[0]
          ? ordersRes.value[0].COUNT
          : 0,
      employees:
        employeesRes.status === "fulfilled" && employeesRes.value[0]
          ? employeesRes.value[0].COUNT
          : 0,
    };

    // Log errors if any for debugging
    if (clientsRes.status === "rejected")
      console.error("Error fetching clients:", clientsRes.reason);
    if (ordersRes.status === "rejected")
      console.error("Error fetching orders:", ordersRes.reason);
    if (employeesRes.status === "rejected")
      console.error("Error fetching employees:", employeesRes.reason);

    return NextResponse.json(stats);
  } catch (error: unknown) {
    console.error("Database Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch stats", details: message },
      { status: 500 },
    );
  }
}
