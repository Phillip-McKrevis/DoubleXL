import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 6;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function DropDown({ onChange, options, value }) {
  function handleChange(e) {
    onChange(e.target.value);
  }

  return (
    <div>
      <FormControl
        fullWidth
        size="small"
        sx={{ marginBottom: "8px", minWidth: "268px" }}
      >
        <InputLabel id="demo-multiple-name-label">Select</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          onChange={handleChange}
          value={value}
        >
          {options.map(({ id, label }) => (
            <MenuItem key={id} value={id}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default DropDown;
