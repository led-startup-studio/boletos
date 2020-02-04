import { TributeBillet } from "../../src/billets/tribute";

describe("Test tribute billet creation", () => {
  it("Create simple billet", () => {
    const tribute = TributeBillet.createBillet(123);
    const billet = tribute.getBillet();

    expect(billet.identifier).toBe("8");
    expect(billet.segment).toBe("0");
    expect(billet.value_type).toBe("8");
    expect(billet.dv).toBe("6");
    expect(Number(billet.value)).toBe(12300);
    expect(billet.business).toBe("0000");
    expect(tribute.toBarcode()).toBe("80860000001230000000000000000000000000000000");
    expect(tribute.toLine()).toBe("808600000018230000000003000000000000000000000000");
    expect(TributeBillet.parseBillet(tribute.toBarcode())).not.toBe(undefined);
  });

  it("Create invalid billet", () => {
    expect(() => TributeBillet.createBillet(123456789123)).toThrowError("Invalid parameters");
  });
});

describe("Test tribute billet parser", () => {
  it("Invalid barcode", () => {
    expect(() => TributeBillet.parseBillet("10800000001230000000000000000000000000000000"))
    .toThrowError("Invalid barcode");
    expect(() => TributeBillet.parseBillet("80800000001230000000000000000000000000000000"))
    .toThrowError("Invalid barcode");
  });

  it("Invalid line", () => {
    expect(() => TributeBillet.parseBillet("108000000014230000000003000000000000000000000000"))
    .toThrowError("Invalid line");
    expect(() => TributeBillet.parseBillet("808000000014230000000003000000000000000000000000"))
    .toThrowError("Invalid line");
  });

  it("Billet format error", () => {
    expect(() => TributeBillet.parseBillet("8086000000123000000xxx0000000000000000000000"))
        .toThrowError("Billet format error");
  });

  it("Parse barcode", () => {
    const tribute = TributeBillet.parseBillet("80860000001230000000000000000000000000000000");
    const billet = tribute.getBillet();

    expect(billet.identifier).toBe("8");
    expect(billet.segment).toBe("0");
    expect(billet.value_type).toBe("8");
    expect(billet.dv).toBe("6");
    expect(Number(billet.value)).toBe(12300);
    expect(billet.business).toBe("0000");
    expect(tribute.toBarcode()).toBe("80860000001230000000000000000000000000000000");
    expect(tribute.toLine()).toBe("808600000018230000000003000000000000000000000000");
    expect(TributeBillet.parseBillet(tribute.toBarcode())).not.toBe(undefined);
  });

  it("Parse line", () => {
    const tribute = TributeBillet.parseBillet("808600000018230000000003000000000000000000000000");
    const billet = tribute.getBillet();

    expect(billet.identifier).toBe("8");
    expect(billet.segment).toBe("0");
    expect(billet.value_type).toBe("8");
    expect(billet.dv).toBe("6");
    expect(Number(billet.value)).toBe(12300);
    expect(billet.business).toBe("0000");
    expect(tribute.toBarcode()).toBe("80860000001230000000000000000000000000000000");
    expect(tribute.toLine()).toBe("808600000018230000000003000000000000000000000000");
    expect(TributeBillet.parseBillet(tribute.toLine())).not.toBe(undefined);
  });

});
