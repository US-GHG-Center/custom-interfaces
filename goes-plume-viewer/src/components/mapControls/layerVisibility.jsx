import { useState } from "react";
import ReactDOM from "react-dom/client";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function VisibilityIconComp ({map}) {
    const [ isVisible, setIsVisible ] = useState(true);

    const toggleLayers = () => {
        if (!map) return;
        const layers = map.getStyle().layers;
        layers.forEach(layer => {
            if (layer.id.includes("raster-layer")) {
                // toggle here
                map.setLayoutProperty(layer.id, 'visibility', isVisible ? 'none' : 'visible');
            }
        });
        setIsVisible(!isVisible);
    }

    return (
        <IconButton className="menu-open-icon" onClick={toggleLayers} >
            { isVisible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
        </IconButton>
    )
}

export class LayerVisibilityControl {
    constructor(){
        this.root = null;
        this._map = null;
    }

    onAdd = (map) => {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        const root = ReactDOM.createRoot(this._container);
        root.render(<VisibilityIconComp map={this._map}/>);
        this.root = root;
        return this._container;
    }

    onRemove = () => {
        this.root.unmount();
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
