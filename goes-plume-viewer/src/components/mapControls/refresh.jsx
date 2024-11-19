import ReactDOM from "react-dom/client";
import { IconButton } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Refresh = ({onClickHandler}) => {
    return (
        <IconButton className="menu-open-icon" onClick={onClickHandler}>
            <RestartAltIcon/>
        </IconButton>
    )
}

export class RefreshControl {
    constructor(handleRefresh) {
        this.root = null;
        this._map = null;
        this._onClick = handleRefresh;
    }

    onAdd = (map) => {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        const root = ReactDOM.createRoot(this._container);
        root.render(<Refresh onClickHandler={this._onClick}/>);
        this.root = root;
        return this._container;
    }

    onRemove = () => {
        this.root.unmount();
        this._container.parentNode.removeChild(this._container);
        this._map = null;
    }
}
