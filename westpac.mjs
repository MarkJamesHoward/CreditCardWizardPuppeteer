import cheerio from "cheerio";
import { CheckRateValid } from "./validations.mjs";
import {
  PlainStrip,
  WestpacAnnualFeeStrip,
  FindInterestFreePeriodWestpac,
} from "./regexclean.mjs";
import { updateItem } from "./contentful.mjs";
import * as URL from "./URLs.mjs";


export async function UpdateWestpac(page, env, url, contentfulid) {
  console.log(`updating ${url}`);
  let rate = await FindWestPacPurchaseRate(url, page);

  if (CheckRateValid()) {
    let plainRate = PlainStrip(rate);
    await updateItem(env, contentfulid, "purchasesRate", plainRate);
  }

  let cash = await FindWestPacCashRate(url, page);

  if (CheckRateValid()) {
    let plainRate = PlainStrip(cash);
    await updateItem(env, contentfulid, "cashAdvanceRate", plainRate);
  }
  let fee = 0;

  if (url === URL.WestpacLowRateMastercardURL) {
    fee = "0";
  }
  else {
    fee = await FindWestPacAnnualFee(url, page);
  }

  if (CheckRateValid()) {
    let plainfee = WestpacAnnualFeeStrip(fee);
    await updateItem(env, contentfulid, "feePrimary", plainfee);
  }

  await updateItem(
    env,
    contentfulid,
    "interestFreePeriod",
    await FindInterestFreePeriodWestpac(page)
  );
}

export async function FindWestPacCashRate(url, page) {
  await page.goto(url);
  const content = await page.content();
  const $ = cheerio.load(content);
  let node = $("td:contains('Cash advance rate').charge-table__cell");
  let data = node.next("td");
  return data.text();
}

export async function FindWestPacPurchaseRate(url, page) {
  await page.goto(url);
  const content = await page.content();
  const $ = cheerio.load(content);
  let node = $("td:contains('Purchases (and other fees & charges)').charge-table__cell");

  let data = node.next("td");
  return data.text();
}

export async function FindWestPacAnnualFee(url, page) {
  await page.goto(url);
  const content = await page.content();
  const $ = cheerio.load(content);
  let node = $("td:contains('Annual account fee')");
  let data = node.next("td");
  return data.text();
}
