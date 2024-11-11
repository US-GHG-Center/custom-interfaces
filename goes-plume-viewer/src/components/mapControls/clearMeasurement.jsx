import React, { useRef } from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import ReactDOM from "react-dom/client";

function ClearMeasurementIcon() {

  return (
    <IconButton className="clear-icon" >
     <ClearIcon/>
    </IconButton>
  );
}

export class ClearMeasurementControl {
  constructor(onClick) {
    this.container = null;
    this.map = null;
    this.root = null;
    this.isMounted = true;
     this._onClick = onClick;
  }

  onClick() {
    if (!this.isMounted) return;
    
  
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.container.addEventListener("contextmenu", (e) => e.preventDefault());
    
    const root = ReactDOM.createRoot(this.container);
    root.render(<ClearMeasurementIcon  />);
    this.root = root;
    this.container.onclick = this._onClick;
    return this.container;
  }

  onRemove() {
    setTimeout(() => {
      try {
        this.isMounted = false;
        if (this.root) {
          this.root.unmount();
        }
        this.container.parentNode.removeChild(this.container);
        this.container = null;
        this.map = null;
      } catch (error) {
        console.error('Error removing clear measurement control:', error);
      }
    }, 0)
  }
}
