import { mod10, mod11 } from "../../src/utils/dv";

describe("Test mod calculations", () =>{

    it("Mod10 test cases", () => {
        expect(mod10("")).toBe("");

        expect(mod10("226020005232606")).toBe("0");
        expect(mod10("004315205232606")).toBe("1");
        expect(mod10("009683126232606")).toBe("2");
        expect(mod10("008215205232606")).toBe("3");
        expect(mod10("008683126232606")).toBe("4");
        expect(mod10("002315205232606")).toBe("5");
        expect(mod10("002783126232606")).toBe("6");
        expect(mod10("001315205232606")).toBe("7");
        expect(mod10("001783126232606")).toBe("8");
        expect(mod10("000315205232606")).toBe("9");
    });

    it("Mod11 test cases", () => {
        expect(mod11("")).toBe("");

        expect(mod11("32")).toBe("9");
        expect(mod11("31")).toBe("1");
        expect(mod11("31")).toBe("1");
        expect(mod11("05")).toBe("1");
        expect(mod11("30")).toBe("2");
        expect(mod11("04")).toBe("3");
        expect(mod11("12")).toBe("4");
        expect(mod11("20")).toBe("5");
        expect(mod11("11")).toBe("6");
        expect(mod11("02")).toBe("7");
        expect(mod11("10")).toBe("8");
        expect(mod11("01")).toBe("9");

        expect(mod11("0123456789")).toBe("7");
    });
});