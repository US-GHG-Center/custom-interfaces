import ReactDOM from "react-dom/client";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function VisibilityIconComp ({visible}) {
    return (
        <IconButton className="menu-open-icon" >
            { visible ? <VisibilityIcon/> : <VisibilityOffIcon/>}
        </IconButton>
    )
}

export class LayerVisibilityControl {
    constructor(){
        this.root = null;
        this._map = null;
        this.visible = true;
    }

    onClick = () => {
        // toggle the visibility of all the layers
        this.visible = !this.visible;
        this.toggleLayers();
    }

    toggleLayers = () => {
        if (!this._map) return;
        const layers = this._map.getStyle().layers;
        layers.forEach(layer => {
            if (layer.id.includes("raster-layer")) {
                console.log(layer.id)
                this._map.setLayoutProperty(layer.id, 'visibility', this.visible ? 'visible' : 'none');
            }
        });
    }

    onAdd = (map) => {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        const root = ReactDOM.createRoot(this._container);
        root.render(<VisibilityIconComp visible={this.visible}/>);
        this.root = root;
        this._container.onclick = this.onClick;
        return this._container;
    }

    onRemove = () => {
        this.root.unmount();
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
