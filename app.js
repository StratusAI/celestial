let pdfFiller = require('pdffiller');

let sourcePDF = "./pdf/tlc-transfer-app.pdf";

// Override the default field name regex. Default: /FieldName: ([^\n]*)/
let nameRegex = null;

let FDF_data = pdfFiller.generateFDFTemplate( sourcePDF, nameRegex, function(err, fdfData) {
    if (err) throw err;
    console.log(fdfData);
});
