const puppeteer = require("puppeteer");
const contentful = require("contentful-management");

const ANZAirpointsVisaPlatinumID = "5wMSD9hoHiFyUBmxGkGz4X";

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

async function Start() {
  browser = await puppeteer.launch();
  page = await browser.newPage();

  await CreateContentfulClient();

  // Get the Purchase Rate for ANZ Airpoints platinum visa
  let ANZAirpointsVisaPlatinumPurchaseRate = await ReadValue(
    "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/",
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
    "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/",
    "NZAPPC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    "5wMSD9hoHiFyUBmxGkGz4X",
    "cashAdvanceRate",
    Strip(ANZAirpointsVisaPlatinumCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    ANZAirpointsVisaPlatinumID,
    "interestFreePeriod",
    await FindInterestFreePeriod()
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
    "NZLIVP",
    "purchaseRate"
  );
  let AnzLowRateCashRate = await ReadValue(
    "https://www.anz.co.nz/personal/credit-cards/low-rate-visa/",
    "NZLIVC",
    "cashRate"
  );

  var newObj = Object.assign(
    {},
    ANZLowRateTitle,
    AnzLowRatePurchaseRate,
    AnzLowRateCashRate
  );
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
