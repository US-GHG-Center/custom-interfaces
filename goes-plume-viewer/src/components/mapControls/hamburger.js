import IconButton from "@mui/material/IconButton";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ReactDOM from "react-dom/client";

function HamburgerIcon() {
  return (
    <IconButton className="menu-open-icon" >
     <MenuOpenIcon/>
    </IconButton>
  );
}

export class HamburgerControl {
  constructor(onClick) {
    this._onClick = onClick;
    this.root = null;
    this.isMounted = true;
  }

  onClick() {
    if (!this.isMounted) return;
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
    this.isMounted = false;
    this.root.unmount();
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
