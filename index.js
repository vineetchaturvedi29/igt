const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/generate-pdf', async(req, res) => {
    try {
        const {name, email, dob, phone, gender, bloodGroup, registerId, dateTime} = req.body;

        const fileName = `${Date.now()}_${name.replace(/\s/g, '_')}.pdf`;
        const filePath = path.join(__dirname, 'pdfs', fileName);

        const doc = new PDFDocument({margin:50});
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);
        doc.fontSize(12).text(`Register-Id:-${registerId}`, {align: 'left'});
        doc.fontSize(12).text(`E-Mail:-${email}`, {align: 'left'});
        doc.fontSize(12).text(`Phone No.:${phone}`, {align: 'left'}).moveDown(2);


        doc.fontSize(25).text("Certifcate of Half Marathon", {align: 'center'}).moveDown(1);
        
        doc.fontSize(20).text("This Certifcate Presented to", {align: 'center'}).moveDown(1);
        
        doc.fontSize(26).text(name, {align:'center'}).moveDown(2);

        doc.fontSize(15).text("The certificate of achievement is awarded to individuals who have demonstrated outstanding performance in their field. Here’s an example text for a certificate.", {align: 'center'}).moveDown(1);

        doc.fontSize(15).text(`Date of Birth: ${dob}  Gender: ${gender}  Blood Group: ${bloodGroup}`,  {align: ' center'}).moveDown(5);
        
        doc.fontSize(15).text(`${dateTime}`, {underline:true, align:'left'}),
        doc.fontSize(15).text('DATE-TIME');

        // doc.fontSize(14).text(dateTime).moveDown(3);

        const signaturePath = path.join(__dirname, 'public', 'signature.png');
        if (fs.existsSync(signaturePath)) {
            const imageWidth = 150;
            const pageWidth = doc.page.width;
            const leftMargin = doc.page.margins.left;
            const usableWidth = pageWidth - leftMargin -doc.page.margins.right;
            const imgX = leftMargin + (usableWidth - imageWidth)/2;

            doc.image(signaturePath, imgX, doc.y, {width:imageWidth});
            // doc.moveDown(1);
            
        }
        
        doc.fontSize(15).text(`${dateTime}`, {underline:true, align:'right'}),
        doc.fontSize(15).text('SIGNATURE', {align:'right'})
        
        
       

        doc.end();

        stream.on('finish', () =>{
            res.json({
                message: "PDF Generated Successfully",
                filePath
            });
        });
    } catch (error) {
        console.log("Unable to generate pdf", error);
        res.status(500).json({error:"Pdf generation failed"});
        
    }
})
app.listen(3000, () =>{
    console.log("server is running on http://localhost:3000");
    
})