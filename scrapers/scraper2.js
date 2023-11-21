const puppeteer = require("puppeteer");
const fs = require("fs");

let links = [];

const scraper2 = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto("https://books.toscrape.com/index.html", {
        waitUntil: "domcontentloaded"
    });

    let hasNextPage = true;
 
    while(hasNextPage){
        const result = await page.evaluate(() => {
            const booksContainer = document.querySelector("section > div > ol.row");
            const bookLI = booksContainer.querySelectorAll("li");

            const bookArr = Array.from(bookLI);

            const allLinks = bookArr.map((book) => {
                const bookLink = book.querySelector(".product_pod > .image_container > a").href;

                return bookLink;
            });

            return allLinks;
        });

        links = links.concat(result);

        const nextPageBtn = await page.$(".pager > .next > a");

        if(nextPageBtn){
            await nextPageBtn.click();
            await page.waitForNavigation();
        }
            
        else{
            hasNextPage = false;
        }
    }


    for(let i=0; i<links.length; i++){
        await page.goto(links[i], {
            waitUntil: "domcontentloaded"
        });

        const bookDetails = await page.evaluate(async () => {
            const bookCategory = document.querySelector(".breadcrumb > li:nth-child(3) > a").innerText;
        
            const bookContainer = document.querySelector(".product_page");
            const upperContainer = bookContainer.querySelector(".row");
            const upperRight = upperContainer.querySelector(".product_main");
            const tableContainer = bookContainer.querySelector(".table-striped");

            const bookImg = upperContainer.querySelector(".carousel > .thumbnail > .carousel-inner > .item > img").src;

            const bookTitle = upperRight.querySelector("h1").innerText;
            const cost = upperRight.querySelector(".price_color").innerText;
            const stock = upperRight.querySelector(".instock").innerText;

            const starElement = upperRight.querySelector(".star-rating");
            let starClass = starElement.className;
            starClass = starClass.split(" ");
            const stars = starClass[1];

            const upc = tableContainer.querySelector("tr:nth-child(1) > td").innerText;
            const tax = tableContainer.querySelector("tr:nth-child(5) > td").innerText;
            const NumberOfReviews = tableContainer.querySelector("tr:nth-child(7) > td").innerText;

            const book = {
                "Title": bookTitle,
                "Category": bookCategory,
                "Cost" : cost,
                "Stock": stock,
                "Stars": stars,
                "UPC": upc,
                "Tax": tax,
                "Reviews": NumberOfReviews,
                "Image": bookImg
            }

            return book;
        });

        fs.appendFile("./extractedData/bookData.csv", `${bookDetails.Title.replace(/,/g, ".")},${bookDetails.Category},${bookDetails.Cost},${bookDetails.Stock},${bookDetails.Stars},${bookDetails.UPC},${bookDetails.Tax},${bookDetails.Reviews},${bookDetails.Image}\n`,
            function(err){
                if(err) throw err;
            }
        );
    }

    await browser.close();
};

module.exports = scraper2;