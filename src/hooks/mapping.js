import { useMappingData, useMappingRouteData } from "./mappingData";

export function useMapping(mappingId) {
  console.debug("Mapping ID", mappingId);
  const [mappingData] = useMappingData();
  return mappingData[mappingId];
}

export function useMappingRoute(mappingId) {
  console.debug("Mapping ID", mappingId);
  const mappingRouteData = useMappingRouteData();

  return mappingRouteData.get(parseInt(mappingId));
}
