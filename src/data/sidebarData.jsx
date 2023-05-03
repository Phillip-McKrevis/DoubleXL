import { mappingRouteData } from "./mappingData";

export const sidebarData = [
  ...[...mappingRouteData.values()].map(({ icon, id, name }) => ({
    icon,
    id,
    name,
    path: `mappings/${id}`,
  })),
];
