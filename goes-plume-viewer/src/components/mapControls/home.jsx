import ReactDOM from "react-dom/client";
import IconButton from "@mui/material/IconButton";
import HomeIcon from '@mui/icons-material/Home';

const Home = ({onClickHandler}) => {
    return (
        <IconButton className="menu-open-icon" onClick={onClickHandler}>
            <HomeIcon/>
        </IconButton>
    );
}

export class HomeControl {
    constructor(handleResetHome) {
        this.root = null;
        this._map = null;
        this._onClick = handleResetHome;
    }

    onAdd = (map) => {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        const root = ReactDOM.createRoot(this._container);
        root.render(<Home onClickHandler={this._onClick}/>);
        this.root = root;
        return this._container;
    }

    onRemove = () => {
        this.root.unmount();
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
