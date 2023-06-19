import { extractTopColor } from '@/modules/colourDetection';
import fs from 'fs';

const img = fs.readFileSync('nature-stone.png', {encoding: 'base64'});
extractTopColor(img).then((result) => {
  console.log('final', JSON.stringify(result));
});
