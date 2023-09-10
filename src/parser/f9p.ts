const NMEA = require('nmea-simple')
const utmObj = require('utm-latlng')
const UTM = new utmObj('WGS 84')

import { log, PackageExists, Safe, Since } from 'utils'

const defaultGPS = (path: string) => ({
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
})

const UBX_PARSE = (data: any) => {

    const st = data.toString()
    const sp = st.split(',')
    if (sp[0] !== '$PUBX' && sp[0] !== '$GNGGA') { return }
    let time = ''

    try {

        time = sp[0] === '$PUBX' ? sp[2] : sp[1]
        const nmea = NMEA.parseNmeaSentence(st)
        const utm = UTM.convertLatLngToUtm(nmea.latitude, nmea.longitude, 3)
        return {
            key: 'GNGGA', time, payload: {
                ...nmea,
                ...utm,
            }
        }

    } catch (error) {

        return {
            key: 'PUBX', time, payload: {
                el: Number(sp[7]),
                hac: Number(sp[9]),
                vac: Number(sp[10]),
                spd: Number(sp[11]),
                deg: Number(sp[12]),
                sats: Number(sp[18]),
            }
        }

    }

}

const UBX_UGLY = (gps: any) => {

    if (gps.PUBX && gps.GNGGA) {

        try {

            const g1g = gps.GNGGA
            const g1p = gps.PUBX
            const n = (m, f = 2) => Number(m.toFixed(f))

            const response: any = {
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
            }

            const c = ["#52c41a", /** good **/ "orange", /** ok **/ "red", /** bad **/]
            const v = response.vac
            const h = response.hac
            response.vco = c[v <= 2 ? 0 : v <= 5 ? 1 : 2]
            response.hco = c[h <= 2 ? 0 : h <= 5 ? 1 : 2]

            delete gps.GNGGA
            delete gps.PUBX

            return response

        } catch (err) { return null }

    } else {
        return null
    }

}

export class F9P_Parser {

    alias = `F9P_Parser`
    obj: any = {}

    constructor() { }

    getParsedSample = (path: string = '/dev/uGPS1') => {

        const tryParse = UBX_UGLY(JSON.parse(JSON.stringify(defaultGPS(path))))
        if (tryParse) { return { time: Date.now(), ...tryParse } }

    }

    parse = (chunk: any) => {

        try {
            const { key, time, payload } = UBX_PARSE(chunk)
            this.obj[key] = payload
            const tryParse = UBX_UGLY(this.obj)
            if (tryParse) { return { time, ...tryParse } }
            return null
        } catch (err: any) {
            log.error(`${this.alias}: While parsing / ${err.message}`)
            return null
        }

    }

}