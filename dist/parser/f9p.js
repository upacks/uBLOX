"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.F9P_Parser = exports.Coordinate = exports.UTM = exports.NMEA = void 0;
const utils_1 = require("utils");
const utmObj = require('utm-latlng');
exports.NMEA = require('nmea-simple');
exports.UTM = new utmObj('WGS 84');
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
const Coordinate = (...n) => {
    try {
        const { x, y, z } = n.length === 3 ? { x: n[0], y: n[1], z: n[2] } : { x: n[0].x, y: n[0].y, z: n[0].z };
        if (x < 181 && y < 181) {
            const { Easting, Northing } = exports.UTM.convertLatLngToUtm(x, y, 2);
            return [[Easting, Northing, z], [y, x, z], { x: Easting, y: Northing, z }, { y, x, z }];
        }
        else {
            const { lat, lng } = exports.UTM.convertUtmToLatLng(x, y, "48", "T");
            return [[x, y, z], [lng, lat, z], { x, y, z }, { x: lng, y: lat, z }];
        }
    }
    catch (err) {
        return [[0, 0, 0], [0, 0, 0], { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }];
    }
};
exports.Coordinate = Coordinate;
const defaultGPS = (path) => ({
    GNGGA: {
        latitude: 0,
        longitude: 0,
        Easting: 539910 + (path.indexOf('uGPS1') >= 0 ? 1 : 2),
        Northing: 4835716,
        fixType: 'UNK',
        altitudeMeters: 0,
        geoidalSeperation: 0,
    },
    PUBX: {
        el: 1455,
        spd: 10,
        deg: 0,
        vac: 0.015,
        hac: 0.012,
        sats: 18,
    },
});
const UBX_PARSE = (data) => {
    const st = data.toString();
    const sp = st.split(',');
    if (sp[0] !== '$PUBX' && sp[0] !== '$GNGGA') {
        return;
    }
    let time = '';
    try {
        time = sp[0] === '$PUBX' ? sp[2] : sp[1];
        const nmea = exports.NMEA.parseNmeaSentence(st);
        const utm = exports.UTM.convertLatLngToUtm(nmea.latitude, nmea.longitude, 3);
        return {
            key: 'GNGGA', time, payload: {
                ...nmea,
                ...utm,
            }
        };
    }
    catch (error) {
        return {
            key: 'PUBX', time, payload: {
                el: Number(sp[7]),
                hac: Number(sp[9]),
                vac: Number(sp[10]),
                spd: Number(sp[11]),
                deg: Number(sp[12]),
                sats: Number(sp[18]),
            }
        };
    }
};
const UBX_UGLY = (gps) => {
    if (gps.PUBX && gps.GNGGA) {
        try {
            const g1g = gps.GNGGA;
            const g1p = gps.PUBX;
            const n = (m, f = 2) => Number(m.toFixed(f));
            const response = {
                lat: g1g.latitude,
                lon: g1g.longitude,
                est: n(g1g.Easting),
                nrt: n(g1g.Northing),
                fix: g1g.fixType,
                alt: g1g.altitudeMeters,
                geo: g1g.geoidalSeperation,
                ele: n(g1p.el),
                spd: g1p.spd,
                deg: g1p.deg,
                vac: n(g1p.vac * 100, 1),
                hac: n(g1p.hac * 100, 1),
                sat: g1p.sats,
            };
            const c = ["#52c41a", /** good **/ "orange", /** ok **/ "red", /** bad **/];
            const v = response.vac;
            const h = response.hac;
            response.vco = c[v <= 2 ? 0 : v <= 5 ? 1 : 2];
            response.hco = c[h <= 2 ? 0 : h <= 5 ? 1 : 2];
            delete gps.GNGGA;
            delete gps.PUBX;
            return response;
        }
        catch (err) {
            return null;
        }
    }
    else {
        return null;
    }
};
class F9P_Parser {
    alias = `F9P_Parser`;
    obj = {};
    constructor() { }
    getParsedSample = (path = '/dev/uGPS1') => {
        const tryParse = UBX_UGLY(JSON.parse(JSON.stringify(defaultGPS(path))));
        if (tryParse) {
            return { time: Date.now(), ...tryParse };
        }
    };
    parse = (chunk) => {
        try {
            const { key, time, payload } = UBX_PARSE(chunk);
            this.obj[key] = payload;
            const tryParse = UBX_UGLY(this.obj);
            if (tryParse) {
                return { time, ...tryParse };
            }
            return null;
        }
        catch (err) {
            utils_1.log.error(`${this.alias}: While parsing / ${err.message}`);
            return null;
        }
    };
}
exports.F9P_Parser = F9P_Parser;
//# sourceMappingURL=f9p.js.map