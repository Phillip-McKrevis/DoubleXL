import { useState, useEffect, useCallback } from "react";
import {
  PointOfSaleIcon,
  AccountBoxOutlinedIcon,
} from "../components/Icons.js";
import { getMappingData, postMappingData } from "../lib/api/api.js";

const SET_MAPPING_DATA_EVENT_TYPE = "setmappingdata";

export function useMappingData() {
  const [mappingData, setMappingData] = useState();

  const onSetMappingData = ({ detail: { mappingData } }) => {
    console.debug("Got new mapping data", mappingData);
    setMappingData(mappingData);
  };

  const notifyPeers = useCallback((mappingData) => {
    console.debug("Notifying listeners of new mapping data:", mappingData);

    const event = new CustomEvent(SET_MAPPING_DATA_EVENT_TYPE, {
      detail: { mappingData },
    });

    document.dispatchEvent(event);
  }, []);

  const updateMappingData = useCallback(
    (setter) => {
      const updatedMappingData =
        typeof setter === "function" ? setter(mappingData) : setter;

      postMappingData(updatedMappingData);
      notifyPeers(updatedMappingData);
    },
    [mappingData, notifyPeers]
  );

  useEffect(() => {
    document.addEventListener(SET_MAPPING_DATA_EVENT_TYPE, onSetMappingData);

    getMappingData().then((mappingData) => notifyPeers(mappingData));

    return () =>
      document.removeEventListener(
        SET_MAPPING_DATA_EVENT_TYPE,
        onSetMappingData
      );
  }, [notifyPeers]);

  return [mappingData, updateMappingData];
}

export function useMappingRouteData() {
  const mappingRouteData = new Map();

  mappingRouteData.set("99b297a0-f1e0-11ed-a61c-b538780b7862", {
    icon: <PointOfSaleIcon />,
    id: "99b297a0-f1e0-11ed-a61c-b538780b7862",
    name: "merchant",
  });

  mappingRouteData.set("99b2bec4-f1e0-11ed-a61c-b538780b7862", {
    icon: <AccountBoxOutlinedIcon />,
    id: "99b2bec4-f1e0-11ed-a61c-b538780b7862",
    name: "agent",
  });

  return mappingRouteData;
}
