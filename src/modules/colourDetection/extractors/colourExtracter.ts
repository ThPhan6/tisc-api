import { RGBColor } from '../types';
import { exec } from 'child_process';
import path from 'path';
const ColorThief = require('colorthief');

export async function getColorPalete(
  imagePath: any, colorCount = 5
): Promise<RGBColor[] | null> {
  return await ColorThief.getPalette(imagePath, colorCount)
    .then((palette: RGBColor[] | null) => {
      return Promise.resolve(palette);
    })
    .catch((err: Error) => {
      return Promise.reject(err);
    })
}
export async function getColor(imagePath: any, quality?: number): Promise<RGBColor> {
  return await ColorThief.getColor(imagePath, quality)
    .then((color: RGBColor) => {
      return Promise.resolve(color);
    })
    .catch((err: Error) => {
      return Promise.reject(err);
    })
}

export async function extractTopColor(imagePath: string): Promise<{[x: string]: number}[]> {
  return new Promise((resolve, reject) => {
    const script = `python3 ${path.resolve(path.dirname(__dirname), 'extractors', 'extracter.py')} ${imagePath}`;
    exec(script, (err, stdout) => {
        if (err) {
          reject(err)
          return;
        }
        const [colourString] = stdout.split("\n");
        const colours = JSON.parse(colourString.replace(/'/g, '"')) as {[key: string]: number};
        console.log('colours', colours);
        const sortedColours = Object.entries(colours).sort(([_k1, v1], [_k2, v2]) => v2 - v1)
          .map(([x,y]) => ({[x]:y}));
        resolve(sortedColours);
      }
    );
  })
}
