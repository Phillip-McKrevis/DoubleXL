import { useState, useEffect } from "react";
import {
  PointOfSaleIcon,
  AccountBoxOutlinedIcon,
} from "../components/Icons.js";

import defaultMappingData from "../data/dynamic_menu.json";

const SET_MAPPING_DATA_EVENT_TYPE = "setmappingdata";

export function useMappingData() {
  const [mappingData, setMappingData] = useState(defaultMappingData);

  const onSetMappingData = ({ detail: { mappingData } }) => {
    console.debug("Got new mapping data", mappingData);
    setMappingData(mappingData);
  };

  function updateMappingData(setter) {
    const updatedMappingData =
      typeof setter === "function" ? setter(mappingData) : setter;

    console.debug(
      "Notifying listeners of new mapping data:",
      updatedMappingData
    );

    const event = new CustomEvent(SET_MAPPING_DATA_EVENT_TYPE, {
      detail: { mappingData: updatedMappingData },
    });

    document.dispatchEvent(event);
  }

  useEffect(() => {
    document.addEventListener(SET_MAPPING_DATA_EVENT_TYPE, onSetMappingData);
    return () =>
      document.removeEventListener(
        SET_MAPPING_DATA_EVENT_TYPE,
        onSetMappingData
      );
  }, []);

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
