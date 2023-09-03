import { Menu } from "@mui/material";
import React from "react";

function MenuBase({ children, open, anchorEl, handleClose, ...props }) {
  return (
    <>
      <Menu
        {...props}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiList-padding": { padding: 0 },
        }}
      >
        {children}
      </Menu>
    </>
  );
}

export default MenuBase;
