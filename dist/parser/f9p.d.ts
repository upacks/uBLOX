export declare const NMEA: any;
export declare const UTM: any;
/**
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns Array
 * 0. Array of UTM
 * 1. Array of LatLon
 * 2. Object of UTM
 * 3. Object of LatLon
 * Coordinate(x EAST LATITUDE, y NORTH LONGITUDE, z ELEVATION (Meters))
 */
export declare const Coordinate: (...n: any[]) => (any[] | {
    x: any;
    y: any;
    z: any;
})[];
export declare class F9P_Parser {
    alias: string;
    obj: any;
    constructor();
    getParsedSample: (path?: string) => any;
    parse: (chunk: any) => any;
}
//# sourceMappingURL=f9p.d.ts.map