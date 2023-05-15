import React, { useState } from "react";
import Button from "@mui/material/Button";

import "./Sidebar.css";

import {
  Children,
  SidebarContainer,
  SidebarWrapper,
  SidebarLogoWrapper,
  SidebarLogo,
  SidebarBrand,
} from "./SidebarStyles";

import SidebarItems from "./SidebarItems";
// import { MenuIcon } from "../Icons";

const MOBILE_VIEW = window.innerWidth < 468;

function Sidebar({ children }) {
  const [displaySidebar, setDisplaySidebar] = useState(!MOBILE_VIEW);

  //   const handleSidebarDisplay = (e) => {
  //     e.preventDefault();
  //     if (window.innerWidth > 468) {
  //       setDisplaySidebar(!displaySidebar);
  //     } else {
  //       setDisplaySidebar(false);
  //     }
  //   };

  return (
    <React.Fragment>
      <SidebarContainer displaySidebar={displaySidebar}>
        <SidebarWrapper>
          <SidebarLogoWrapper displaySidebar={displaySidebar}>
            <SidebarLogo href="#">
              <SidebarBrand
                displaySidebar={displaySidebar}
                className="app__brand__text"
              >
                dbXL
              </SidebarBrand>
            </SidebarLogo>
          </SidebarLogoWrapper>
          <SidebarItems displaySidebar={displaySidebar} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#7c7788",
                margin: "16px 0px 16px 0px",
              }}
            />
          </div>
          <Button variant="outlined" sx={{ color: "#5a8dee" }}>
            Deploy
          </Button>
        </SidebarWrapper>
      </SidebarContainer>
      <Children displaySidebar={displaySidebar}>{children}</Children>
    </React.Fragment>
  );
}

export default Sidebar;
