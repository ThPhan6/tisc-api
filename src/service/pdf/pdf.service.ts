import PdfGenerator from "html-pdf";
import PdfConfig from './pdf.config';
import * as memoryStreams from "memory-streams";
import {head, takeRight} from 'lodash';
import hummus from 'muhammara';

class PDFResult {
  private result: PdfGenerator.CreateResult;

  constructor(result: PdfGenerator.CreateResult) {
    this.result = result;
  }

  public toBuffer(): Promise<Buffer> {
    return new Promise((resolve) => {
      this.result.toBuffer((_err, buffer) => {
       resolve(buffer);
      });
    });
  }

  public toFile(filePath: string): Promise<string> {
    return new Promise((resolve) => {
      this.result.toFile(filePath, (_err, res) => {
       resolve(res.filename);
      });
    });
  }
}

class PDFService {
  private pdf: typeof PdfGenerator;

  constructor() {
    this.pdf = PdfGenerator;
  }

  public create(html: string, options: PdfGenerator.CreateOptions = {}) {
    return new PDFResult(this.pdf.create(html, {...PdfConfig, ...options}));
  }

  public merge(...pdfs: Buffer[]) {
    const firstBuffer = head(pdfs) as Buffer;
    const otherBuffers = takeRight(pdfs, pdfs.length - 1);
    const outStream = new memoryStreams.WritableStream();

    try {
      const firstPDFStream = new hummus.PDFRStreamForBuffer(firstBuffer);
      const pdfWriter = hummus.createWriterToModify(
        firstPDFStream,
        new hummus.PDFStreamForResponse(outStream));

      otherBuffers.forEach((buffer) => {
        pdfWriter.appendPDFPagesFromPDF(
          new hummus.PDFRStreamForBuffer(buffer)
        );
      });
      pdfWriter.end();
      var newBuffer = outStream.toBuffer();
      outStream.end();
      return newBuffer;
    } catch (_e) {
      outStream.end();
      throw new Error('Error during PDF combination');
    }
  }
}

export default PDFService;
export const pdfNode = new PDFService();
