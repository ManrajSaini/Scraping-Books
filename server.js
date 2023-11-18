const scraper1 = require("./scrapers/scraper1");
const scraper2 = require("./scrapers/scraper2");
const scraper3 = require("./scrapers/scraper3");

let condition = process.argv[2];

const chooseOption = async(condition) => {
    switch(condition){
        case "1":
            await scraper1();
            break;

        case "2":
            await scraper2();
            break;

        case "3":
            await scraper3();
            break;

        default:
            console.log("Choose valid option");
    }
};

chooseOption(condition);