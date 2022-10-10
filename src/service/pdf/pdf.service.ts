import PdfGenerator from "html-pdf";
import PdfConfig from './pdf.config';

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
}

export default PDFService;
export const pdfNode = new PDFService();
