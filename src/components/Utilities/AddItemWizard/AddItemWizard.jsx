import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { v1 as uuidv1 } from "uuid";
import traverse from "traverse";

import { useMappingData } from "../../../hooks/mappingData";
import DropDown from "../DropDown/DropDown.jsx";

import "./AddItemWizard.css";
import { node } from "prop-types";

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

    // console.log("CCCCCCCCCCCCCCCCCCCCCCCC", parent);

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

    // console.log("AAAAAAAAAAAAAAAAAAAA", traversedMenu.value);
    // let [childArray] = [traversedMenu.value];
    // console.log("BBBBBBBBBBBBBB", childArray);
    // childArray.forEach((child, index, arr) => {
    //   if (!item.children) {
    //     child = traversedMenu.value.name;
    //     childArray.push();
    //   }
    //  });
    // for (const [child] in childArray.children) {
    //   console.log(child.name);
    // }

    // for (var i = 0, l = childArray.children; i < l; i++) {
    //   var child = childArray.children[i];

    //   if (child.name !== traversedMenu.value) {
    //     let newChild = child.push(traversedMenu.value);
    //     console.log("NEW CHILD ARR: ", newChild);
    //   }
    // }

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
