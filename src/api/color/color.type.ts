export type DetectedColor = {
  conversion: {
    origin: {
      red: number;
      green: number;
      blue: number;
      hue: number;
      sat: number;
      lightness: number;
      whiteness: number;
      blackness: number;
      cyan: number;
      magenta: number;
      yellow: number;
      black: number;
      ncol: string;
      opacity: number;
      valid: boolean;
      temperature: string;
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
    lab: {
      l: number;
      a: number;
      b: number;
    };
    nCol: {
      ncol: string;
      w: number;
      b: number;
      a: number;
    };
    name: string;
  };
  colors_fetched_counts: number;
  density: number;
};

export type ColorSpecification = DetectedColor[];
export type DetectedImage = {
  name: string;
  color_specification: ColorSpecification;
};
