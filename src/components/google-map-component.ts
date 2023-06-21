import { ComponentBase } from "./component-base";

const START_POSITION = {
    lat: 41.881,
    lng: -87.623
};

export class GoogleMapComponent extends ComponentBase {
    template = `
        <style>
            .map {
                width: 100%;
                height: 25vh;
                background-color: #eee;
            }
        </style>
        <div class="map"></div>
    `;

    map!: google.maps.Map;
    markers: google.maps.Marker[] = [];
    _vehicles: Vehicle[] = [];

    get vehicles() {
        return this._vehicles;
    }

    set vehicles(newVehicles: Vehicle[]) {
        this._vehicles = newVehicles;
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
        this.markers = [];
        this.markers = this._vehicles.map((vehicle) => {
            return new google.maps.Marker({
                position: {
                    lat: Number.parseFloat(vehicle.lat),
                    lng: Number.parseFloat(vehicle.lon),
                },
                map: this.map
            })
        });

        const lastMarker = this.markers[this.markers.length - 1];

        if (lastMarker) {
            this.map.setCenter(lastMarker.getPosition() ?? START_POSITION);
        }
    }

    constructor() {
        super();
        this.initTemplate();
    }

    connectedCallback() {
        this.initMap();
    }

    initMap() {
        const element = this.shadowRoot!.querySelector(".map") as HTMLElement;
        this.map = new google.maps.Map(element, {
            zoom: 10,
            center: START_POSITION
        });
    }
}
customElements.define("google-map-component", GoogleMapComponent);