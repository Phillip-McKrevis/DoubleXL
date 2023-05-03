import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar.js";

import "./Root.css";

function App() {
  return (
    <div id="main">
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  );
}

export default App;
