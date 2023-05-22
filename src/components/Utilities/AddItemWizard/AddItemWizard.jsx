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
  console.log("THIS IS THE MENU BEFORE TRAVERSAL: ", menu);
  const traversedMenu = traverse(menu);

  const options = getOptions(traversedMenu);
  console.log("THESE ARE FIRST OPTIONS: ", options);

  function handleSubmit(e) {
    e.preventDefault();

    const { path } = options.get(formValues.parentMenuItem);
    const parent = traversedMenu.get(path);

    // if (formValues.parentMenuItem === "99b297a0-f1e0-11ed-a61c-b538780b7862") {
    //   console.log("AAAAAAAAAAAAAAAAAA");
    //   setFormValue("parentMenuItem", formValues.parentMenuItem);
    // } else if (
    //   formValues.parentMenuItem === "99b2bec4-f1e0-11ed-a61c-b538780b7862"
    // ) {
    //   console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    //   setFormValue("parentMenuItem", formValues.parentMenuItem);
    // }

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
