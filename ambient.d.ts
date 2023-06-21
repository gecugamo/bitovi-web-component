interface Route {
    rt: string;
    rtclr: string;
    rtdd: string;
    rtnm: string;
}

interface Vehicle {
    des: string;
    dly: boolean;
    hdg: string;
    lat: string;
    lon: string;
    origtatripno: string;
    pdist: number;
    pid: number
    rt: string;
    tablockid: string;
    tatripid: string;
    tmstmp: string;
    vid: string;
    zone: string;
}

interface Error {
    rt: string;
    msg: string;
}

interface RoutesResponse {
    'bustime-response': {
        routes: Route[];
    }
}

interface VehiclesResponse {
    'bustime-response': {
        vehicle: Vehicle[]
    }
}

interface VehiclesErrorResponse {
    'bustime-response': {
        error: Error[]
    }
}