const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const writeStream = fs.createWriteStream('post.csv');

// Write Headers

writeStream.write(`title,link\n`);

request('https://www.esquire.com/food-drink/drinks/g1569/good-alcoholic-beers/', (err, res, html)=>{
    if(!err && res.statusCode == 200){
       const $ = cheerio.load(html);


      $('.site-content').each((i, el) => {

        const title = $(el)
        .find('p')
        .text()
       // .replace(/\s\s+/g, '');


        // const link = $(el).find('.full-item-title').attr('href');
        // const author = $(el).find('.byline').text().replace(/\s\s+/g, '');


       console.log(title);

      });
      console.log('scraping done');
    }
});