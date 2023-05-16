import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { v1 as uuidv1 } from "uuid";
import traverse from "traverse";
import { useMappingData } from "../../../hooks/mappingData";
import DropDown from "../DropDown/DropDown.jsx";

function getOptions(traversedMenu) {
  const options = new Map();
  const path = [];

  traversedMenu.forEach(function (x) {
    this.before(() => {
      if (this.node.children) {
        path.push(this.node.name);
      }
    });

    this.after(() => {
      if (this.node.children) {
        path.pop();
      }
    });

    if (this.notLeaf && !Array.isArray(x)) {
      options.set(x.id, {
        id: x.id,
        label: `${path.join(" > ")} > ${x.name}`,
        path: this.path,
      });
    }
  });

  return options;
}
function AddItemWizard() {
  const [mappingData, setMappingData] = useMappingData();

  const menu = Object.values(mappingData).map(({ menu, name, id }) => ({
    children: menu,
    name,
    id,
  }));

  const traversedMenu = traverse(menu);

  const options = getOptions(traversedMenu);

  const [formValues, setFormValues] = React.useState({
    name: "",
    screen_id: "",
    ussd_code: "",
    parentMenuItem: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    const { path } = options.get(formValues.parentMenuItem);
    const parent = traversedMenu.get(path);

    traversedMenu.set(path, {
      ...parent,
      children: [
        ...(parent.children || []),
        {
          id: uuidv1(),
          name: formValues.name,
          screen_id: formValues.screen_id,
          ussd_code: formValues.ussd_code,
        },
      ],
    });

    setMappingData((mappingData) =>
      menu.reduce(
        (acc, { id, name, children }) =>
          console.log("!!!", mappingData, id, mappingData[id]) || {
            ...acc,
            [id]: {
              ...mappingData[id],
              name,
              children,
            },
          },
        {}
      )
    );
  }

  function setFormValue(key, value) {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DropDown
        onChange={(value) => {
          setFormValue("parentMenuItem", value);
        }}
        options={[...options.values()].map(({ label, id }) => ({
          label,
          id,
        }))}
        value={formValues.parentMenuItem}
      />
      <TextField
        id="name"
        variant="outlined"
        onChange={(e) => {
          setFormValue("name", e.target.value);
        }}
        value={formValues.name}
      />
      <TextField
        id="sreen_id"
        variant="outlined"
        onChange={(e) => {
          setFormValue("screen_id", e.target.value);
        }}
        value={formValues.screen_id}
      />
      <TextField
        id="ussd_code"
        variant="outlined"
        onChange={(e) => {
          setFormValue("ussd_code", e.target.value);
        }}
        value={formValues.ussd_code}
      />
      <Button type="submit">SUBMIT</Button>
    </Box>
  );
}
export default AddItemWizard;
