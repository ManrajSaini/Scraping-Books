const puppeteer = require("puppeteer");

let data = [];

const scraper3 = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto("https://books.toscrape.com/index.html", {
        waitUntil: "domcontentloaded"
    });

    const linkArr = await page.evaluate(async() => {
        const sideBar = document.querySelector(".side_categories");
        const categoryUL = sideBar.querySelector(".nav");
        const categoryLI = categoryUL.querySelectorAll("li > ul > li");

        const catergoryArr = Array.from(categoryLI);

        const categoryList = catergoryArr.map((category) => {
            const categoryName = category.querySelector("a").innerText;
            const categoryLink = category.querySelector("a").href;

            const cat = {
                name: categoryName,
                link: categoryLink
            };

            return cat;
        });

        return categoryList;
    });

    for(let i=0; i<linkArr.length; i++){
        await page.goto(linkArr[i].link, {
            waitUntil: "domcontentloaded"
        });

        const result = await page.evaluate(async() => {
            const booksContainer = document.querySelector(".page > .page_inner > div.row > div > section");
            const bookLI = booksContainer.querySelectorAll("div + div > ol.row > li");

            const bookArr = Array.from(bookLI);
        
            const bookList = bookArr.map((book) => {
                const bookTitle = book.querySelector(".product_pod > h3 > a").title;
                
                return bookTitle;
            });

            return bookList;
        });

        data.push({
            [linkArr[i].name] : result
        });
    }

    console.log(data);
    await browser.close();
};

module.exports = scraper3;