import * as pdf from "html-pdf";

export default class HtmlPdfService {
  constructor() {}
  public createHtmlString = () => {
    return `<!DOCTYPE html>
      <html>
      <head>
      <title>Page Title</title>
      </head>
      <body>
      
      <h1>This is a Heading</h1>
      <p>This is a paragraph.</p>
      
      </body>
      </html>`;
  };
  public createPdfBuffer = (html: string) =>
    new Promise((resolve) => {
      pdf
        .create(html, {
          format: "Letter",
        })
        .toBuffer((err, buffer) => {
          resolve(Buffer.isBuffer(buffer));
        });
    });
}
