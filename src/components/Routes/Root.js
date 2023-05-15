import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Sidebar from "../Sidebar/Sidebar.js";

import "./Root.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <div id="main">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Sidebar>
          <Outlet />
        </Sidebar>
      </ThemeProvider>
    </div>
  );
}

export default App;
