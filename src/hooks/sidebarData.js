import { useMappingRouteData } from "./mappingData.jsx";

export function useSidebarData() {
  const mappingRouteData = useMappingRouteData();
  return [
    ...[...mappingRouteData.values()].map(({ icon, id, name }) => ({
      icon,
      id,
      name,
      path: `mappings/${id}`,
    })),
  ];
}
