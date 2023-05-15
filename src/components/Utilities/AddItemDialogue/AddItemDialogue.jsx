import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Fab from "@mui/material/Fab";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

import AddItemWizard from "../AddItemWizard/AddItemWizard.jsx";
import "./AddItemDialogue.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    var css =
      "text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue; font-size: 40px;";
    setOpen(true);
    console.log("%cHappy Easter:", "color: pink");
    console.log("%chttps://cataas.com/cat", css);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Fab
        size="medium"
        color="black"
        aria-label="add"
        onClick={handleClickOpen}
        sx={{
          position: "fixed",
          width: "60px",
          height: "60px",
          background: "#5a8dee",
          bottom: "40px",
          right: "40px",
        }}
      >
        <AddIcon />
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Menu Item
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <AddItemWizard />
      </Dialog>
    </div>
  );
}
