import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { v1 as uuidv1 } from "uuid";
import traverse from "traverse";

import { useMappingData } from "../../../hooks/mappingData";
import DropDown from "../DropDown/DropDown.jsx";

import "./AddItemWizard.css";

const SECTION_LEVEL = 1;

function getOptions(traversedMenu) {
  const options = new Map();
  const path = [];
  let section = undefined;

  traversedMenu.forEach(function (x) {
    this.before(() => {
      if (this.node.children) {
        if (this.level === SECTION_LEVEL) {
          section = x.id;
        }
        path.push(this.node.name);
      }
    });

    this.after(() => {
      if (this.level === SECTION_LEVEL) {
        section = undefined;
      }
      if (this.node.children) {
        path.pop();
      }
    });

    if (this.level < 4) {
      console.log(this.level, x);
    }

    if (this.notLeaf && !Array.isArray(x)) {
      //avoids ID clash in parent object sections
      const id = `${section ? section + "-" : ""}${x.id}`;

      options.set(id, {
        id,
        label: `${path.join(" > ")} > ${x.name}`,
        path: this.path,
      });
    }
  });

  return options;
}

function AddItemWizard() {
  const [mappingData, setMappingData] = useMappingData();
  const [formValues, setFormValues] = useState({
    name: "",
    screen_id: "",
    ussd_code: "",
    parentMenuItem: "",
  });

  if (!mappingData) {
    return <CircularProgress />;
  }

  const menu = Object.values(mappingData).map(({ menu, name, id }) => ({
    children: menu,
    name,
    id,
  }));

  const traversedMenu = traverse(menu);
  console.log("THIS IS THE TRAVERSED MENU: ", traversedMenu);
  const options = getOptions(traversedMenu);

  const keys = ["name", "screen_id", "ussd_code"];
  const values = [];

  traversedMenu.forEach(function (x) {
    if (keys.includes(this.key)) {
      values.push(x);
    }
  });

  console.log("VALUES ", values);

  function handleSubmit(e) {
    e.preventDefault();

    // Check if the form values are already present in the values array
    const isPresent = values.some(
      (value) =>
        value.name === formValues.name &&
        value.screen_id === formValues.screen_id &&
        value.ussd_code === formValues.ussd_code
    );

    // If the form values are present, log out an error or display it on the UI
    if (isPresent) {
      alert("The form values already exist in the values array");
      // Alternatively, you can use a state variable to store the error message and render it on the UI
      // setError("The form values already exist in the values array");
    } else {
      // Otherwise, proceed with the rest of the logic
      const { path } = options.get(formValues.parentMenuItem);
      const parent = traversedMenu.get(path);
      console.log("TRAVERD|SSDAF ", parent.children.name);

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

      const menuPath = path.length === SECTION_LEVEL ? "menu" : "children";
      console.log("MENU PATH ", menuPath);

      setMappingData((mappingData) =>
        menu.reduce(
          (acc, { id, name, children }) => ({
            ...acc,
            [id]: {
              ...mappingData[id],
              name,
              menu: children,
            },
          }),
          {}
        )
      );
    }
  }

  function setFormValue(key, value) {
    setFormValues((formValues) => ({
      ...formValues,
      [key]: value,
    }));
  }

  return (
    <div className="wrapper">
      <Box component="form" onSubmit={handleSubmit}>
        <DropDown
          onChange={(value) => {
            setFormValue("parentMenuItem", value);
            console.log(value);
          }}
          options={[...options.values()].map(({ label, id }) => ({
            label,
            id,
          }))}
          value={formValues.parentMenuItem}
        />
        <TextField
          id="name"
          label="Menu Item Name"
          variant="outlined"
          onChange={(e) => {
            setFormValue("name", e.target.value);
          }}
          value={formValues.name}
        />
        <TextField
          id="sreen_id"
          label="Screen ID"
          variant="outlined"
          onChange={(e) => {
            setFormValue("screen_id", e.target.value);
          }}
          value={formValues.screen_id}
        />
        <TextField
          id="ussd_code"
          label="USSD Code"
          variant="outlined"
          onChange={(e) => {
            setFormValue("ussd_code", e.target.value);
          }}
          value={formValues.ussd_code}
        />
      </Box>
      <Button id="submit_btn" type="submit" onClick={handleSubmit}>
        SUBMIT
      </Button>
    </div>
  );
}

export default AddItemWizard;
