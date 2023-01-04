
/* ------------------------ REQUIRE ALL PACKAGE ----------------------- */

const puppeteer = require('puppeteer');
const hbs = require('handlebars')
const fs = require('fs-extra')
const { readFileSync } = require('fs')
const path = require('path')
 
/* ------------------------ IMPORT DATA FORMA JSON  ----------------------- */

const data = require('./data/data-arabic.json')

/* ------------------------ ALL FUNCTION  ----------------------- */


/* (1) --> FUNCTION FOR CONVERT IMAGE TO BASE64 */

  const couding64Image = async function(images)
  {
    const Image64 = []

    for (const image of images) {
      Image64.push(readFileSync(image).toString('base64'))
    }

    return Image64;

  };

/* (2) --> FUNCTION FOR JOIN TEMPLATES  TO DATA */

  const compile = async function (templateName,data){

    // GET TEMPLATE 
      const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)
    // COUDING TO  utf8 
      const html = await fs.readFile(filePath,'utf8')

      // Check if a key exists
      if(data.hasOwnProperty('images')){
          // COUDING IMAGE TO  BASE64   
          const imageBase64 = await couding64Image(data['images'])
          // SET NEW IMAGE TO DATA JSON     
          data['images'] = imageBase64
        } 

      return hbs.compile(html)(data)
  };
 
(async function() {
    try{
        
        const browser = await puppeteer.launch({executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']});
 
        const page = await browser.newPage()
 
        
        const content = await compile('arabic',data)
       
         
        await page.setContent(content,{ waitUntil: "networkidle0" });
        
        await page.emulateMediaType('screen');
        await page.addStyleTag({ path: './css/style.pdf.Arabic.css'});
       
 
        await page.pdf({
            path:'Arabic.pdf',           
            format:'A4',
            displayHeaderFooter: true,       
            headerTemplate:` 
            <div class="testing">            
              <img style="width:220px;position:fixed;top:10px;left:20px" src="data:image/jpeg;base64,${
                readFileSync('imag/logo_head.png').toString('base64')
              }" alt="alt text" />
            </div>      
        `,
            footerTemplate: '<div style=" direction: rtl;position: fixed;top:763px;right: 61%;-webkit-print-color-adjust: exact;background-color:#010e1b;font-size: 10px;color: #fff; padding: 2px; border-radius: 50px;"> <span class="pageNumber"></span> من <span class="totalPages"></span></div>                              <div class="footer" style="-webkit-print-color-adjust: exact;background-color: #2b99ce;font-size: 8px;word-spacing: 2px;color: #000; padding:6px; margin:10px auto;clear:both;border-radius: 50px"> <div> <span style="margin-right:10px">Kingdom of Saudi Arabia C.R 403283037</span> <span style="background-color: #fff;font-size: 8px;color: #2b88ce;border-radius: 50px;padding:1px">T</span> <span style="margin-right:11px">012 655 1118</span>        <span style="background-color: #fff;font-size: 8px;color: #2b88ce;border-radius: 50px;padding:1px">M</span> <span style="margin-right:11px"> 127283 </span>            <span style="background-color: #fff;font-size: 8px;color: #2b88ce;border-radius: 50px;padding:1px">@</span> <span> info@Shadowd.comsa </span> </br> </div> <div style="margin-top:5px"> <span style="margin-right:16px"> Jeddah-Madinah Road-Construction City </span> <span style="background-color: #fff;font-size: 8px;color: #2b88ce;border-radius: 50px;padding:1px">F</span> <span style="margin-right:11px">012 655 1119</span> <span style="background-color: #fff;font-size: 8px;color: #2b88ce;border-radius: 50px;padding:1px">A.CODE</span> <span>21352</span> <span style="background-color: #fff;font-size: 8px;color: #2b88ce;border-radius: 50px;padding:1px">w</span> <span>www.shadowd.comsa</span> </div>    </div>',
            
            margin:{
                right : "20px",
                left :"20px",
                top: "140px",
                bottom: "140px"
            },
            printBackground: true,   
            
        })
 
        console.log("done creating pdf")
 
        await browser.close()
 
        process.exit()
 
    }catch(e){
        console.log(e)
    }
})()