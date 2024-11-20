import IconButton from "@mui/material/IconButton";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ReactDOM from "react-dom/client";
import Tooltip from '@mui/material/Tooltip';

function HamburgerIcon() {
  return (
    <Tooltip title="Open Drawer">
      <IconButton className="menu-open-icon" >
        <MenuOpenIcon/>
      </IconButton>
    </Tooltip>
  );
}

export class HamburgerControl {
  constructor(onClick) {
    this._onClick = onClick;
    this.root = null;
    this.isMounted = true;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    const root = ReactDOM.createRoot(this._container);
    root.render(<HamburgerIcon/>);
    this.root = root;
    this._container.onclick = this._onClick;
    return this._container;
  }

  onRemove() {
    setTimeout(() => {
      try {
        this.isMounted = false;
        this.root.unmount();
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
      } catch (err) {
        console.error("Error adding control:", err);
      }
    }, 0);
  }
}
