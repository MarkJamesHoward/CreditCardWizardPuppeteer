import {
  UpdateWestpacAirpointsPlatinumMastercard,
  UpdateWestpacAirpointsMastercard,
  UpdateWestpacAirpointsWorldMastercard,
  FindWestPacCashRate,
  FindWestPacPurchaseRate,
} from "./westpac.mjs";

import {
  UpdateANZLowRateVisa,
  UpdateANZAirpointsVisaPlatinum,
  UpdateANZCashbackVisa,
  UpdateANZCashbackVisaPlatinum,
  UpdateANZAirpointsVisa,
} from "./ANZ.mjs";

import puppeteer from "puppeteer";
import contentful from "contentful-management";

console.log("start");

let browser;
let page;

let env;

Start().then(() => {
  console.log("all done");
  browser.close();
});

async function CreateContentfulClient() {
  let client = contentful.createClient({
    accessToken: "CFPAT-yiIVze4OCenMTsRn9blrU_OYZE1pjQM0L_FoyUeeXPU",
  });

  let space = await client.getSpace("8rzf9c6imdg0");

  env = await space.getEnvironment("master");
}

async function Start() {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  console.log("Logging into Contentful..");
  await CreateContentfulClient();
  console.log("Logged in successfully");

  await UpdateANZCashbackVisaPlatinum(page, env);
  console.log("----------------------------------------");
  await UpdateANZCashbackVisa(page, env);
  console.log("----------------------------------------");
  await UpdateANZAirpointsVisaPlatinum(page, env);
  console.log("----------------------------------------");
  await UpdateANZLowRateVisa(page, env);
  console.log("----------------------------------------");
  await UpdateANZAirpointsVisa(page, env);

  console.log("----------------------------------------");
  await UpdateWestpacAirpointsPlatinumMastercard(page, env);
  console.log("----------------------------------------");
  await UpdateWestpacAirpointsMastercard(page, env);
  console.log("----------------------------------------");
  await UpdateWestpacAirpointsWorldMastercard(page, env);
  console.log("----------------------------------------");
  

  // let ANZAirpointsVisaPlatinumTitle = await ReadTitleValue(
  //   "https://www.anz.co.nz/personal/credit-cards/airpoints-visa-platinum/",
  //   "",
  //   "Title"
  // );
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
