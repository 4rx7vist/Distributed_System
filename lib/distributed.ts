import { BranchType } from "@/components/providers/BranchProvider";

const FRAGMENT_MAP: Record<string, Record<BranchType, string>> = {
  CLIENTES: {
    GLOBAL: "CLIENTES",
    GUAYAQUIL: "FRAGMENTO_GUAYAQUIL",
    QUITO: "FRAGMENTO_QUITO",
  },
  EMPLEADOS: {
    GLOBAL: "EMPLEADOS",
    GUAYAQUIL: "EMPLEADOS",
    QUITO: "EMPLEADOS",
  },
  ORDENES: {
    GLOBAL: "ORDENES",
    GUAYAQUIL: "ORDENES", // Update if specific fragment exists
    QUITO: "ORDENES",
  },
};

export function getDistributedTable(
  entity: string,
  branch: BranchType,
): string {
  const map = FRAGMENT_MAP[entity];
  if (!map) return entity;
  return map[branch] || entity;
}

export function getEmployeeQuery() {
  // Vertical Fragmentation Join
  return `
    SELECT 
      L.EMPLEADOID, L.REPORTA_A, L.NOMBRE, L.APELLIDO, L.EXTENSION,
      P.FECHA_NAC -- Added from Personal
    FROM FRAGMENTO_EMPLEADOS_LABORAL L
    LEFT JOIN FRAGMENTO_EMPLEADOS_PERSONAL P ON L.EMPLEADOID = P.EMPLEADOID
  `;
}
