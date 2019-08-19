const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const writeStream = fs.createWriteStream('post.csv');

// Write Headers

writeStream.write(`title,link\n`);

request('https://www.esquire.com/food-drink/', (err, res, html)=>{
    if(!err && res.statusCode == 200){
       const $ = cheerio.load(html);


      $('.full-item').each((i, el) => {

        const title = $(el)
        .find('.full-item-title')
        .text()
        .replace(/\s\s+/g, '');

        
        const link = $(el).find('.full-item-title').attr('href');
        const author = $(el).find('.byline').text().replace(/\s\s+/g, '');


       console.log(author);

      });
      console.log('scraping done');
    }
});