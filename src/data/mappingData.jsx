import { WizardIcon } from "../components/Icons";

export { default as mappingData } from "./dynamic_menu.json";

const mappingRouteData = new Map();

mappingRouteData.set(1, {
  icon: <WizardIcon />,
  id: 1,
  name: "merchant",
});

mappingRouteData.set(2, {
  icon: <WizardIcon />,
  id: 2,
  name: "agent",
});

export { mappingRouteData };
