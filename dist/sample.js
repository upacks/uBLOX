"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("utils");
const serial_1 = require("./serial");
const parser_1 = require("./parser");
(0, utils_1.Safe)(() => {
    const GPS1 = new serial_1.Serial();
    const Parser_1 = new parser_1.F9P_Parser();
    GPS1.start('/dev/uGPS1', 115200);
    GPS1.on((chunk) => { utils_1.log.info(`GPS1 -> ${chunk}`); });
    // Loop(() => console.log(Parser_1.getParsedSample('/dev/uGPS1')), 2000)
    const GPS2 = new serial_1.Serial();
    const Parser_2 = new parser_1.F9P_Parser();
    GPS2.start('/dev/uGPS2', 115200);
    GPS2.on((chunk) => { utils_1.log.info(`GPS2 -> ${chunk}`); });
    // Loop(() => console.log(Parser_1.getParsedSample('/dev/uGPS2')), 2000)
});
//# sourceMappingURL=sample.js.map