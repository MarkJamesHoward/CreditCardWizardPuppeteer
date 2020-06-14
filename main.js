const puppeteer = require("puppeteer");

console.log("start");

let browser;
let page;

Start().then(() => {
  console.log("all done");
  browser.close();
});

async function Start() {
  browser = await puppeteer.launch();
  page = await browser.newPage();

  // Get the Purchase Rate for ANZ Airpoints platinum visa
  let ANZAirpointsVisaPlatinumPurchaseRate = await ReadValue(
    "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/",
    "NZAPPP",
    "purchaseRate"
  );

  let ANZAirpointsVisaPlatinumCashRate = await ReadValue(
    "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/",
    "NZAPPC",
    "cashRate"
  );

  let ANZAirpointsVisaPlatinumTitle = await ReadTitleValue(
    "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/",
    "",
    "Title"
  );

  let ANZLowRateTitle = await ReadTitleValue(
    "https://www.anz.co.nz/personal/credit-cards/low-rate-visa/",
    "",
    "Title"
  );

  let AnzLowRatePurchaseRate = await ReadValue(
    "https://www.anz.co.nz/personal/credit-cards/low-rate-visa/",
    "NZLIVC",
    "purchaseRate"
  );
  let AnzLowRateCashRate = await ReadValue(
    "https://www.anz.co.nz/personal/credit-cards/low-rate-visa/",
    "NZLIVP",
    "cashRate"
  );

  console.log("ANZ Low Rate Visa");
  console.log(ANZLowRateTitle);
  console.log(AnzLowRatePurchaseRate);
  console.log(AnzLowRateCashRate);

  console.log("ANZ Airpoints Visa Platinum");
  console.log(ANZAirpointsVisaPlatinumTitle);
  console.log(ANZAirpointsVisaPlatinumPurchaseRate);
  console.log(ANZAirpointsVisaPlatinumCashRate);
}

async function ReadValue(url, attr, item) {
  await page.goto(url);
  console.log(url, attr);

  const [data] = await page.evaluate((attrsel) => {
    return [
      ...document.querySelectorAll(`[data-baserate-code='${attrsel}']`),
    ].map((elem) => elem.innerText);
  }, attr);

  console.log(data);

  return { [item]: data };

  console.log("completed");
}

async function ReadTitleValue(url, attr, item) {
  await page.goto(url);
  console.log(url, attr);

  const [data] = await page.evaluate((attrsel) => {
    return [...document.querySelectorAll(".hero__heading")].map(
      (elem) => elem.innerText
    );
  }, attr);

  console.log(data);

  return { [item]: data };

  console.log("completed");
}

async function SaveJSonFile() {
  const fs = require("fs").promises;

  const data = "Hello my name is Hugo, I'm using the new fs promises API";

  try {
    await fs.writeFile("ANZ.json", data); // need to be in an async function
  } catch (error) {
    console.log(error);
  }
}
