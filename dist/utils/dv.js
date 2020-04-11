"use strict";
/**
 * This module calculate all DV (Digit Verifier) in Mod 10 and 11
 */
Object.defineProperty(exports, "__esModule", { value: true });
// mod10 uses the Mod10 algorithm to calculute a verify digit, value must be a string
function mod10(entry) {
    if (entry === "") {
        return "";
    }
    var dv = 0;
    var isEven = true;
    var i = entry.length;
    while (i--) {
        var digit = parseInt(entry[i]);
        if (isEven) {
            dv += Math.floor((digit * 2) / 10) + ((digit * 2) % 10);
        }
        else {
            dv += digit;
        }
        isEven = !isEven;
    }
    // How much for the next 10 based number
    dv = dv % 10;
    if (dv !== 0) {
        dv = 10 - dv;
    }
    return String(dv);
}
exports.mod10 = mod10;
// mod11 uses the Mod11 algorithm to calculate a verify digit, value must be a string
function mod11(entry) {
    if (entry === "") {
        return "";
    }
    var dv = 0;
    var i = entry.length;
    var multiplier = 2;
    while (i--) {
        var digit = parseInt(entry[i]);
        dv += (multiplier * digit);
        if ((++multiplier) === 10) {
            multiplier = 2;
        }
    }
    dv = 11 - (dv % 11);
    if (dv === 0 || dv >= 10) {
        dv = 1;
    }
    return String(dv);
}
exports.mod11 = mod11;
//# sourceMappingURL=dv.js.map