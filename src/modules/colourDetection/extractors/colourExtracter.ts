import { ColorConversion } from '../types';
import { exec } from 'child_process';
import path from 'path';
import { colorConverter } from '../parser';

export async function extractTopColor(imagePath: string): Promise<ColorConversion[]> {
  return new Promise((resolve, reject) => {
    const script = `python3 ${path.resolve(path.dirname(__dirname), 'extractors', 'extracter.py')} ${imagePath}`;
    exec(script, (err, stdout) => {
        if (err) {
          reject(err)
          return;
        }
        const [colourString] = stdout.split("\n");
        const colours = JSON.parse(colourString.replace(/'/g, '"')) as {[key: string]: number};
        const sortedColours = Object.entries(colours).sort(([_k1, v1], [_k2, v2]) => v2 - v1);
        const totalColor = sortedColours.reduce((total, [_color, colors_fetched_counts]) => total + colors_fetched_counts, 0);
        const result = sortedColours.map(([x,y]) => {
            const colorConversion = colorConverter(x);
            return {
              conversion: {
                origin: colorConversion,
                hex: x,
                rgb: colorConversion.toRgb(),
                hsl: colorConversion.toHsl(),
                cmyk: colorConversion.toCmyk(),
                hwb: colorConversion.toHwb(),
                lab: colorConversion.toLab(),
                nCol: colorConversion.toNcol(),
                name: colorConversion.toName(),
              },
              colors_fetched_counts: y,
              density: (y / totalColor) * 100
            }
          });
        resolve(result);
      }
    );
  })
}
