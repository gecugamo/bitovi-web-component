import { ComponentBase } from "./component-base";
import { GoogleMapComponent } from "./google-map-component";

export class BusTrackerComponent extends ComponentBase {
    template = `
        <style>
        /* CSS to copy */
        :host {
            display: flex;
            flex-direction: column;
        }

        .top {
            flex-grow: 1;
            overflow-y: auto;
            height: 75vh;
            display: flex;
            flex-direction: column;
        }

        footer {
            height: 250px;
            position: relative;
        }

        header {
            box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.1);
            background-color: var(--header-background-color, #313131);
            color: white;
            min-height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 1.2;
            text-transform: var(--header-text-transform);
        }

        header h1 {
            text-align: center;
            font-size: 18px;
            text-transform: var(--header-text-transform, uppercase);
            letter-spacing: 1px;
            margin: 0;
        }

        #selected-route:not(.route-selected) {
            display: none;
        }

        .route-selected {
            line-height: 1;
            position: absolute;
            z-index: 1;
            text-align: right;
            background: rgba(6, 6, 6, 0.6);
            top: 10px;
            right: 10px;
            padding: 6px 10px;
            color: white;
            border-radius: 2px;
            cursor: pointer;
        }

        .route-selected small {
            display: block;
            font-size: 14px;
            color: #ddd;
        }

        .route-selected .error-message {
            font-size: 14px;
            background-color: #ff5722;
            border-radius: 10px;
            padding: 4px 8px 1px;
            margin-top: 5px;
        }

        .routes-list {
            padding: 20px 0;
            margin: 0;
            overflow-y: auto;
        }

        .routes-list li {
            list-style: none;
            cursor: pointer;
            background: white;
            border: 1px solid #dedede;
            margin: 0.5rem 2%;
            border-radius: 25px;
            color: #2196f3;
            width: 41%;
            display: inline-flex;
            font-size: 14px;
            line-height: 1.2;
        }

        .routes-list li:hover {
            border-color: transparent;
            background-color: #008eff;
            color: white;
            box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.2);
        }

        .routes-list li .check {
            display: none;
        }

        .routes-list li.active {
            color: #666;
            background-color: #e8e8e8;
        }

        .routes-list li.active .check {
            display: inline-block;
            margin-left: 5px;
            color: #2cc532;
        }

        .routes-list li.active:hover {
            border-color: #dedede;
            box-shadow: none;
        }

        .routes-list button {
            width: 100%;
            padding: 8px 8px 6px;
            border: none;
            border-radius: 25px;
            background: transparent;
            text-align: left;
            font: inherit;
            color: inherit;
            cursor: pointer;
        }

        .route-number {
            display: inline-block;
            border-right: 1px solid #dedede;
            padding-right: 5px;
            margin-right: 5px;
            min-width: 18px;
            text-align: right;
        }

        p {
            text-align: center;
            margin: 0;
            color: #ccc;
            font-size: 14px;
        }
        </style>
        <div class="top">
            <header>
                <h1>Chicago CTA Bus Tracker</h1>
                <p id="loading-routes">Loading routes…</p>
            </header>

            <ul class="routes-list"></ul>
            </div>
            <footer>
            <button id="selected-route" type="button"></button>
            <google-map-component name="Gary"></google-map-component>
            </footer>
        </div>
    `;

    routes: Route[] = [];

    constructor() {
        super();
        this.initTemplate();
    }

    async connectedCallback() {
        const routesReponse = await this.getRoutes();
        this.routes = routesReponse["bustime-response"].routes;
        this.renderRoutes();
    }

    async getRoutes(): Promise<RoutesResponse> {
        const url = 'https://cta-bustracker.vercel.app/api/routes';
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    async getVehicles(route: string): Promise<VehiclesResponse | VehiclesErrorResponse> {
        const url = `https://cta-bustracker.vercel.app/api/vehicles?rt=${route}`;
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    renderRoutes() {
        const routesList = this.shadowRoot?.querySelector('.routes-list');
        const routeTemplate = document.querySelector('#route-template') as HTMLTemplateElement;

        this.routes.forEach((route) => {
            const fragment = document.importNode(routeTemplate.content, true) as DocumentFragment;
            fragment.querySelector('.route-number')!.innerText = route.rt;
            fragment.querySelector('.route-name')!.innerText = route.rtnm;
            fragment.querySelector('button')?.addEventListener('click', async (e) => {
                const googleMapComponent = this.shadowRoot?.querySelector('google-map-component') as GoogleMapComponent;
                const vehiclesResponse = await this.getVehicles(route.rt);
                const selectedRouteEl = this.shadowRoot!.querySelector('#selected-route') as HTMLButtonElement;
                let elString = `<small>Route Number: ${route.rt}</small> ${route.rtnm}`

                if ('error' in vehiclesResponse['bustime-response']) {
                    elString += `<div class="error-message">No vehicles available for this route</div>`;
                    googleMapComponent.vehicles = [];
                } else {
                    googleMapComponent.vehicles = vehiclesResponse["bustime-response"].vehicle;
                }

                selectedRouteEl.innerHTML = elString;
                selectedRouteEl.classList.add('route-selected');
            });

            routesList!.append(fragment);
        });

        this.shadowRoot?.querySelector('#loading-routes')?.remove();
    }
}
customElements.define("bus-tracker-component", BusTrackerComponent);