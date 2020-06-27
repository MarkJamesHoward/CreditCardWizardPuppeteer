const puppeteer = require("puppeteer");
const contentful = require("contentful-management");
const cheerio = require("cheerio");

const ANZAirpointVisaPlatinumURL =
  "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/";
const ANZAirpointsVisaPlatinumID = "5wMSD9hoHiFyUBmxGkGz4X";

const ANZLowRateURL =
  "https://www.anz.co.nz/personal/credit-cards/low-rate-visa/";
const ANZLowRateVisa = "3jcAsqgU5MmsbUVtCLoxT4";

const ANZAirpointsVisaURL =
  "https://www.anz.co.nz/personal/credit-cards/airpoints-visa/";
const ANZAirpointsVisaID = "7u38SKPZoZmFIyIHtG3QfT";

const ANZCashbackVisaURL =
  "https://www.anz.co.nz/personal/credit-cards/cashback-visa/";
const ANZCashbackVisaID = "1YxRMcFZosLLv26QkWP9m5";

const ANZCashbackVisaPlatinumURL =
  "https://www.anz.co.nz/personal/credit-cards/cashback-platinum/";
const ANZCashbackVisaPlatinumID = "7wsckFEHPxXPkMaJ8x2vny";

console.log("start");

let browser;
let page;

let env;

Start().then(() => {
  console.log("all done");
  browser.close();
});

async function FindInterestFreePeriod() {
  let html = await page.content();
  let data = html.match(/Up to \d\d days/g);
  let days = data[0].match(/\d\d/g);
  return days[0];
}

async function FindAnnualFee() {
  let html = await page.content();
  let data = html.match(/\$\d{2,3}\sp/g);
  let fee = data[0].match(/\d{2,3}/g);
  return fee[0];
}

async function CreateContentfulClient() {
  let client = contentful.createClient({
    accessToken: "CFPAT-yiIVze4OCenMTsRn9blrU_OYZE1pjQM0L_FoyUeeXPU",
  });

  let space = await client.getSpace("8rzf9c6imdg0");

  env = await space.getEnvironment("master");
}

async function updateItem(itemID, field, newValue) {
  let entry = await env.getEntry(itemID);
  entry.fields[field] = { "en-US": parseFloat(newValue) };
  await entry.update();
  let newVersion = await await env.getEntry(itemID);
  await newVersion.publish();
  console.log(`updated ${field} to ${newValue}`);
}

async function UpdateANZLowRateVisa() {
  console.log("ANZ Low Rate Visa");

  // Get the Cash Advance Rate for ANZ Low Rate Visa
  let ANZLowRateCashRate = await ReadValue(ANZLowRateURL, "NZLIVC", "cashRate");

  // Now update this in contentful
  await updateItem(
    ANZLowRateVisa,
    "cashAdvanceRate",
    Strip(ANZLowRateCashRate, "cashRate")
  );

  // Get the Purchase Advance Rate for ANZ Low Rate Visa
  let ANZLowRatePurchaseRate = await ReadValue(
    ANZLowRateURL,
    "NZLIVP",
    "purchaseRate"
  );

  // Now update this in contentful
  await updateItem(
    ANZLowRateVisa,
    "purchasesRate",
    Strip(ANZLowRatePurchaseRate, "purchaseRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    ANZLowRateVisa,
    "interestFreePeriod",
    await FindInterestFreePeriod()
  );
}

async function UpdateANZAirpointsVisaPlatinum() {
  console.log("updating ANZ Airpoints platinum visa");

  // Get the Purchase Rate for ANZ Airpoints platinum visa
  let ANZAirpointsVisaPlatinumPurchaseRate = await ReadValue(
    ANZAirpointVisaPlatinumURL,
    "NZAPPP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    ANZAirpointsVisaPlatinumID,
    "purchasesRate",
    Strip(ANZAirpointsVisaPlatinumPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Airpoints platinum visa
  let ANZAirpointsVisaPlatinumCashRate = await ReadValue(
    ANZAirpointVisaPlatinumURL,
    "NZAPPC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    ANZAirpointsVisaPlatinumID,
    "cashAdvanceRate",
    Strip(ANZAirpointsVisaPlatinumCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    ANZAirpointsVisaPlatinumID,
    "interestFreePeriod",
    await FindInterestFreePeriod()
  );

  // Update the Primary Fee in contentful
  await updateItem(
    ANZAirpointsVisaPlatinumID,
    "feePrimary",
    await FindAnnualFee()
  );
}

async function UpdateANZCashbackVisa() {
  console.log("updating ANZ Cashback Visa");

  // Get the Purchase Rate for ANZ Cashback visa
  let ANZCashbackVisaPurchaseRate = await ReadValue(
    ANZCashbackVisaURL,
    "NZCVP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    ANZCashbackVisaID,
    "purchasesRate",
    Strip(ANZCashbackVisaPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Airpoints visa
  let ANZCashbackVisaCashRate = await ReadValue(
    ANZCashbackVisaURL,
    "NZCVC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    ANZCashbackVisaID,
    "cashAdvanceRate",
    Strip(ANZCashbackVisaCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    ANZCashbackVisaID,
    "interestFreePeriod",
    await FindInterestFreePeriod()
  );

  // Update the Primary Fee in contentful
  await updateItem(ANZCashbackVisaID, "feePrimary", await FindAnnualFee());
}

async function UpdateANZCashbackVisaPlatinum() {
  console.log("updating ANZ Cashback Visa Platinum");

  // Get the Purchase Rate for ANZ Cashback visa platinum
  let ANZCashbackVisaPlatinumPurchaseRate = await ReadValue(
    ANZCashbackVisaPlatinumURL,
    "NZCVPP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    ANZCashbackVisaPlatinumID,
    "purchasesRate",
    Strip(ANZCashbackVisaPlatinumPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Cashback visa platinum
  let ANZCashbackVisaPlatinumCashRate = await ReadValue(
    ANZCashbackVisaPlatinumURL,
    "NZCVPC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    ANZCashbackVisaPlatinumID,
    "cashAdvanceRate",
    Strip(ANZCashbackVisaPlatinumCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    ANZCashbackVisaPlatinumID,
    "interestFreePeriod",
    await FindInterestFreePeriod()
  );

  // Update the Primary Fee in contentful
  await updateItem(
    ANZCashbackVisaPlatinumID,
    "feePrimary",
    await FindAnnualFee()
  );
}

async function UpdateANZAirpointsVisa() {
  console.log("updating ANZ Airpoints visa");

  // Get the Purchase Rate for ANZ Airpoints visa
  let ANZAirpointsVisaPurchaseRate = await ReadValue(
    ANZAirpointsVisaURL,
    "NZAPCP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    ANZAirpointsVisaID,
    "purchasesRate",
    Strip(ANZAirpointsVisaPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Airpoints visa
  let ANZAirpointsVisaCashRate = await ReadValue(
    ANZAirpointsVisaURL,
    "NZAPCC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    ANZAirpointsVisaID,
    "cashAdvanceRate",
    Strip(ANZAirpointsVisaCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    ANZAirpointsVisaID,
    "interestFreePeriod",
    await FindInterestFreePeriod()
  );

  // Update the Primary Fee in contentful
  await updateItem(ANZAirpointsVisaID, "feePrimary", await FindAnnualFee());
}

async function Start() {
  browser = await puppeteer.launch();
  page = await browser.newPage();

  let res = await FindWestPacPurchaseRate(
    "https://www.westpac.co.nz/credit-cards/airpoints/airpoints-mastercard/"
  );

  console.log(res);
  return;

  await CreateContentfulClient();

  await UpdateANZCashbackVisaPlatinum();
  console.log("----------------------------------------");
  await UpdateANZCashbackVisa();
  console.log("----------------------------------------");
  await UpdateANZAirpointsVisaPlatinum();
  console.log("----------------------------------------");
  await UpdateANZLowRateVisa();
  console.log("----------------------------------------");
  await UpdateANZAirpointsVisa();

  // let ANZAirpointsVisaPlatinumTitle = await ReadTitleValue(
  //   "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/",
  //   "",
  //   "Title"
  // );
}

async function FindWestPacPurchaseRate(url) {
  await page.goto(url);
  let data = await page.evaluate(() => {
    return document
      .querySelectorAll(".table-data-sheet > tbody > tr > td")[1]
      .querySelectorAll("span");
  });
}

async function ReadValue(url, attr, item) {
  await page.goto(url);

  const [data] = await page.evaluate((attrsel) => {
    return [
      ...document.querySelectorAll(`[data-baserate-code='${attrsel}']`),
    ].map((elem) => elem.innerText);
  }, attr);

  return { [item]: data };
}

function Strip(val, field) {
  let regex = /\d{2}.\d{2}/g;
  let data = val[field];
  let res = data.match(regex);
  return res;
}

async function ReadTitleValue(url, attr, item) {
  await page.goto(url);

  const [data] = await page.evaluate((attrsel) => {
    return [...document.querySelectorAll(".hero__heading")].map(
      (elem) => elem.innerText
    );
  }, attr);

  return { [item]: data };
}
