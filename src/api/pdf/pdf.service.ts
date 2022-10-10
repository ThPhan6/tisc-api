// import { MESSAGES } from "./../../constant/common.constant";
import {pdfNode} from '@/service/pdf/pdf.service';

export default class PDFService {

  public generateProjectProduct = async () => {
    const html = `<!DOCTYPE html>
      <html>
      <head>
      <title>Page Title</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          font-family: 'Cormorant Garamond';
          font-style: normal;
          font-weight: 300;
          font-size: 8px;
          line-height: 12px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          background: rgb(241,241,241);
          -webkit-print-color-adjust: exact;
          box-sizing: border-box;
        }
      </style>
      </head>
      <body>

      <h1>This is a Heading</h1>
      <p>This is a paragraph.</p>

      </body>
      </html>`;
    return await pdfNode.create(html).toBuffer();
  }

}

export const pdfService = new PDFService();
