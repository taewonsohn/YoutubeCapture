const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const express = require('express');


const  app = express();
const port = 3001;


async function openGoogle() {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: false });

  // Create a new page

  const assetsFolderPath = path.join(__dirname,'assets');
  const imageFiles = fs.readdirSync(assetsFolderPath);
  for (const imageFile of imageFiles){
    const page = await browser.newPage();

    // Navigate to Google
    await page.goto('https://www.google.co.kr/imghp?hl=ko');
    try {
      // Execute the JavaScript code within the page's DOM environment
      await page.evaluate(() => {
        const element = document.getElementsByClassName('nDcEnd')[0];
        if (element) {
          element.click();
        }
      });
        console.log('Successfully clicked the div element!');
      } catch (error) {
      console.error('Error: Failed to find or click the div element:', error);
      }
    await page.waitForSelector('input[type="file"]');
    const fileInput = await page.$('input[type="file"]');

    // Upload the current image file
    const filePath = path.join(assetsFolderPath, imageFile);
    await fileInput.uploadFile(filePath);
  }

  // Optionally, you can perform additional actions on the page, such as typing in the search bar or clicking on elements.
  //await page.click('div[data-ved="0ahUKEwiFzKWLqOj_AhUYA4gKHfDoAXMQhqEICAY"]');
  // Wait for a few seconds (optional)
  


  // Wait for the visual search results to load
 

  // Close the browser
  //await browser.close();
}

// Call the function to open Google

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // 모든 도메인에서 접근 가능하도록 설정
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, image-count, Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Add the OPTIONS method
  next();
});
app.get('/', (req, res) => {
  res.send('Server is running!');
  openGoogle();
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
