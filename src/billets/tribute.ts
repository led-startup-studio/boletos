/**
 * The document specification can be found in:
 * https://febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
 * http://wiki.biserp.com.br/index.php/Especifica%C3%A7%C3%A3o_de_Guias_e_Boletos
 *
 * ====================
 *       LAYOUT
 * ====================
 *
 * Barcode: [ ABCDEEEEEEE ]   [ EEEEFFFFGGG ]   [ GGGGGGGGGGG ]   [ GGGGGGGGGGG ]
 * Line:    [ ABCDEEEEEEE W ] [ EEEEFFFFGGG X ] [ GGGGGGGGGGG Y ] [ GGGGGGGGGGG Z ]
 * A - '8' Identificação de arrecadação
 * B - Identificação de segmento
 * C - Identificação de valor real ou referência:
 *      '6' -> valor efetivo; '7' -> quantidade de moedas;
 *      '8' -> valor efetivo; '9' -> quantidade de moedas.
 * D - DV:
 *     Para C = '6' ou '7' => Mod10; Para C = '8' ou '9' => Mod11;
 * E - Valor:
 *     Para C = '6' ou '8' => Valor a ser cobrado em centavos;
 *     Para C = '7' ou '9' => Valor de referência, neste campo poderá
 *                             conter uma quantidade de moeda, zeros,
 *                             ou um valor a ser reajustado por um índice, etc..
 * F - Idenficação da empresa/orgão
 * G - Campo livre (Obs.: Se existir data de vencimento no campo livre, ela
 *                        deverá vir em primeiro lugar e em formato AAAAMMDD)
 * [ W,X,Y,Z ] - Mod10 de cada campo anterior
 *
 */

import { mod10, mod11 } from "../utils/dv"

export interface ITribute {
  identifier: string
  segment: string
  value_type: string
  dv: string
  value: string
  business: string
  open_field: string
  field_dvs: string[]
}

const dvMod = new Map().set("6", mod10).set("7", mod10).set("8", mod11).set("9", mod11)

export class TributeBillet {
  private billet: ITribute

  constructor() {
    this.billet = {} as ITribute
  }

  /**
   * Parse barcode or digitable line to tribute billet
   * @param billet Barcode (44 digits) or digitable line (48 digits)
   */
  public static parseBillet(billet: string): TributeBillet {
    const tribute = new TributeBillet()

    if ((billet.length !== 44 && billet.length !== 48) || !billet.match(/^[0-9]+$/)) {
      throw new Error("Billet format error")
    }

    if (billet.length === 44) {
      if (!TributeBillet.isBarcodeValid(billet)) {
        throw new Error("Invalid barcode")
      }
      tribute.billet = TributeBillet.parseBarcode(billet)
    }

    if (billet.length === 48) {
      if (!TributeBillet.isLineValid(billet)) {
        throw new Error("Invalid line")
      }
      tribute.billet = TributeBillet.parseLine(billet)
    }

    return tribute
  }

  /**
   * Create a new tribute billet
   * @param value value in following format R$ 0.000,00
   */
  public static createBillet(value: number): TributeBillet {
    if (String(value * 100).length > 11) {
      throw new Error("Value must be bellow 999999999.99")
    }

    const tributeBillet = new TributeBillet()
    tributeBillet.billet = {
      identifier: "8",
      segment: "0",
      value_type: "8",
      dv: "0",
      value: String(value * 100).padStart(11, "0"),
      business: "0".repeat(4),
      open_field: "0".repeat(25),
      field_dvs: ["0", "0", "0", "0"],
    } as ITribute

    let barcode = tributeBillet.toBarcode()
    tributeBillet.billet.dv = mod11(barcode.slice(0, 3) + barcode.slice(4, 44))
    barcode = tributeBillet.toBarcode()
    tributeBillet.billet.field_dvs = [
      mod10(barcode.slice(0, 11)),
      mod10(barcode.slice(11, 22)),
      mod10(barcode.slice(22, 33)),
      mod10(barcode.slice(33, 44)),
    ]
    return tributeBillet
  }

  /**
   * Get billet information
   */
  public getBillet(): ITribute {
    return this.billet
  }

  private static parseBarcode(barcode: string): ITribute {
    return {
      identifier: barcode.slice(0, 1),
      segment: barcode.slice(1, 2),
      value_type: barcode.slice(2, 3),
      dv: barcode.slice(3, 4),
      value: barcode.slice(4, 15),
      business: barcode.slice(15, 19),
      open_field: barcode.slice(19, 44),
      field_dvs: [
        mod10(barcode.slice(0, 11)),
        mod10(barcode.slice(11, 22)),
        mod10(barcode.slice(22, 33)),
        mod10(barcode.slice(33, 44)),
      ],
    }
  }

  private static parseLine(line: string): ITribute {
    return {
      identifier: line.slice(0, 1),
      segment: line.slice(1, 2),
      value_type: line.slice(2, 3),
      dv: line.slice(3, 4),
      value: line.slice(4, 11) + line.slice(12, 16),
      business: line.slice(16, 20),
      open_field: line.slice(20, 23) + line.slice(24, 35) + line.slice(36, 47),
      field_dvs: [line.slice(11, 12), line.slice(23, 24), line.slice(35, 36), line.slice(47, 48)],
    }
  }

  public toBarcode(): string {
    return (
      this.billet.identifier +
      this.billet.segment +
      this.billet.value_type +
      this.billet.dv +
      this.billet.value +
      this.billet.business +
      this.billet.open_field
    )
  }

  public toLine(): string {
    const barcode: string = this.toBarcode()
    return (
      barcode.slice(0, 11) +
      this.billet.field_dvs[0] +
      barcode.slice(11, 22) +
      this.billet.field_dvs[1] +
      barcode.slice(22, 33) +
      this.billet.field_dvs[2] +
      barcode.slice(33, 44) +
      this.billet.field_dvs[3]
    )
  }

  /**
   * Check if the given barcode is valid by comparing the given DV with a calculated one
   * @param barcode 44 digits code
   */
  private static isBarcodeValid(barcode: string): boolean {
    if (barcode[0] !== "8") {
      return false
    }
    // tslint:disable-next-line: variable-name
    const value_type = barcode[2]
    const dv = barcode[3]
    const sliced = barcode.slice(0, 3) + barcode.slice(4, 44)
    if (dv === dvMod.get(value_type)(sliced)) {
      return true
    }
    return false
  }

  /**
   * Check if the given line is valid by comparing the given DVs with a calculated one
   * @param line 48 digits code
   */
  private static isLineValid(line: string): boolean {
    if (line[0] !== "8") {
      return false
    }
    // tslint:disable-next-line: variable-name
    const value_type = line[2]
    const dvs = [line[3], line[11], line[23], line[35], line[47]]
    const entries = [line.slice(0, 11), line.slice(12, 23), line.slice(24, 35), line.slice(36, 47)]
    const sliced = entries.join("").slice(0, 3) + entries.join("").slice(4, 44)
    if (
      dvs[0] === dvMod.get(value_type)(sliced) &&
      dvs[1] === mod10(entries[0]) &&
      dvs[2] === mod10(entries[1]) &&
      dvs[3] === mod10(entries[2]) &&
      dvs[4] === mod10(entries[3])
    ) {
      return true
    }
    return false
  }

  /**
   * Check if the entry is a valid
   * @param entry Digitable line or barcode
   */
  public static isValid(entry: string): boolean {
    return this.isLineValid(entry) || this.isBarcodeValid(entry)
  }
}
