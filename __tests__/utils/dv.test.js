"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dv_1 = require("../../src/utils/dv");
describe("Test mod calculations", function () {
    it("Mod10 test cases", function () {
        expect(dv_1.mod10("")).toBe("");
        expect(dv_1.mod10("226020005232606")).toBe("0");
        expect(dv_1.mod10("004315205232606")).toBe("1");
        expect(dv_1.mod10("009683126232606")).toBe("2");
        expect(dv_1.mod10("008215205232606")).toBe("3");
        expect(dv_1.mod10("008683126232606")).toBe("4");
        expect(dv_1.mod10("002315205232606")).toBe("5");
        expect(dv_1.mod10("002783126232606")).toBe("6");
        expect(dv_1.mod10("001315205232606")).toBe("7");
        expect(dv_1.mod10("001783126232606")).toBe("8");
        expect(dv_1.mod10("000315205232606")).toBe("9");
    });
    it("Mod11 test cases", function () {
        expect(dv_1.mod11("")).toBe("");
        expect(dv_1.mod11("32")).toBe("9");
        expect(dv_1.mod11("31")).toBe("1");
        expect(dv_1.mod11("31")).toBe("1");
        expect(dv_1.mod11("05")).toBe("1");
        expect(dv_1.mod11("30")).toBe("2");
        expect(dv_1.mod11("04")).toBe("3");
        expect(dv_1.mod11("12")).toBe("4");
        expect(dv_1.mod11("20")).toBe("5");
        expect(dv_1.mod11("11")).toBe("6");
        expect(dv_1.mod11("02")).toBe("7");
        expect(dv_1.mod11("10")).toBe("8");
        expect(dv_1.mod11("01")).toBe("9");
        expect(dv_1.mod11("0123456789")).toBe("7");
    });
});
//# sourceMappingURL=dv.test.js.map