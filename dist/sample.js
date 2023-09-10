"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("utils");
const serial_1 = require("./serial");
(0, utils_1.Safe)(() => {
    const GPS1 = new serial_1.Serial();
    GPS1.start('/dev/uGPS1', 115200);
    GPS1.on((chunk) => { utils_1.log.info(`GPS1 -> ${chunk}`); });
    const GPS2 = new serial_1.Serial();
    GPS2.start('/dev/uGPS2', 115200);
    GPS2.on((chunk) => { utils_1.log.info(`GPS2 -> ${chunk}`); });
});
//# sourceMappingURL=sample.js.map