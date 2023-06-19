export interface ColorConversion {
  colors_fetched_counts: number;
  conversion: {
    origin: {
      black: number;
      blackness: number;
      blue: number;
      cyan: number;
      green: number;
      hue: number;
      lightness: number;
      magenta: number;
      ncol: string;
      opacity: number;
      red: number;
      sat: number;
      valid: boolean;
      whiteness: number;
      yellow: number;
    };
    hex: string;
    rgb: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    hsl: {
      h: number;
      s: number;
      l: number;
      a: number;
    };
    cmyk: {
      c: number;
      m: number;
      y: number;
      k: number;
      a: number;
    };
    hwb: {
      h: number;
      w: number;
      b: number;
      a: number;
    };
    nCol: {
      ncol: string;
      w: number;
      b: number;
      a: number;
    };
    name: string;
  }
}
