const puppeteer = require("puppeteer");

const scraper1 = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.goto("https://books.toscrape.com/index.html", {
        waitUntil: "domcontentloaded"
    });
 
    const result = await page.evaluate(() => {
        const sideBar = document.querySelector(".side_categories");
        const categoryUL = sideBar.querySelector(".nav");
        const categoryLI = categoryUL.querySelectorAll("li > ul > li");

        const catergoryArr = Array.from(categoryLI);

        const categoryList = catergoryArr.map((category) => {
            const text = category.querySelector("a").innerText;

            return text;
        });

        return {categoryList};
    });

    console.log(result);

    await browser.close();
};

module.exports = scraper1;