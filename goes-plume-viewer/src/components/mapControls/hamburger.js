export class HamburgerControl {
  constructor(onClick) {
    this._onClick = onClick;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    this._container.innerHTML = '<button><i class="fa-solid fa-bars"></i></button>';
    this._container.onclick = this._onClick;
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
