import { mappingData, mappingRouteData } from "../data/mappingData";

export async function getMapping(mappingId) {
  console.debug("Mapping ID", mappingId);
  return mappingData[mappingId];
}

export async function getMappingRoute(mappingId) {
  console.debug("Mapping ID", mappingId);
  return mappingRouteData.get(parseInt(mappingId));
}
