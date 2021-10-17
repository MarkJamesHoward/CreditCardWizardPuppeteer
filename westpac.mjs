import cheerio from "cheerio";
import { CheckRateValid } from "./validations.mjs";
import {
  PlainStrip,
  WestpacAnnualFeeStrip,
  FindInterestFreePeriodWestpac,
} from "./regexclean.mjs";
import { updateItem } from "./contentful.mjs";

const WestpacAirpointsMastercardURL =
  "https://www.westpac.co.nz/credit-cards/airpoints/airpoints-mastercard/";
const WestpacAirpointsMastercardID = "6QytVSylDciSRatyhcJ9gU";

const WestpacAirpointsWorldMastercardURL =
  "https://www.westpac.co.nz/credit-cards/airpoints/airpoints-world-mastercard/";
const WestpacAirpointsWorldMastercardID = "2ZGbp1kxwuVP2yLcnpfccZ";

const WestpacAirpointsPlatinumMastercardURL =
  "https://www.westpac.co.nz/credit-cards/airpoints/airpoints-platinum-mastercard/";
const WestpacAirpointsPlatinumMastercardID = "4xLghP5t0WI7Z3IEo3Kdgd";

export async function UpdateWestpacAirpointsPlatinumMastercard(page, env) {
  console.log("updating Westpac Airpoints Platinum Mastercard");
  let rate = await FindWestPacPurchaseRate(
    WestpacAirpointsPlatinumMastercardURL,
    page
  );

  if (CheckRateValid()) {
    let plainRate = PlainStrip(rate);
    await updateItem(
      env,
      WestpacAirpointsPlatinumMastercardID,
      "purchasesRate",
      plainRate
    );
  }

  let cash = await FindWestPacCashRate(
    WestpacAirpointsPlatinumMastercardURL,
    page
  );

  if (CheckRateValid()) {
    let plainRate = PlainStrip(cash);
    await updateItem(
      env,
      WestpacAirpointsPlatinumMastercardID,
      "cashAdvanceRate",
      plainRate
    );
  }

  let fee = await FindWestPacAnnualFee(
    WestpacAirpointsPlatinumMastercardURL,
    page
  );

  if (CheckRateValid()) {
    let plainfee = WestpacAnnualFeeStrip(fee);
    await updateItem(
      env,
      WestpacAirpointsPlatinumMastercardID,
      "feePrimary",
      plainfee
    );
  }

  await updateItem(
    env,
    WestpacAirpointsPlatinumMastercardID,
    "interestFreePeriod",
    await FindInterestFreePeriodWestpac(page)
  );
}

export async function UpdateWestpacAirpointsMastercard(page, env) {
  console.log("updating Westpac Airpoints Mastercard");
  let rate = await FindWestPacPurchaseRate(WestpacAirpointsMastercardURL, page);

  if (CheckRateValid()) {
    let plainRate = PlainStrip(rate);
    await updateItem(
      env,
      WestpacAirpointsMastercardID,
      "purchasesRate",
      plainRate
    );
  }

  let cash = await FindWestPacCashRate(WestpacAirpointsMastercardURL, page);

  if (CheckRateValid()) {
    let plainRate = PlainStrip(cash);
    await updateItem(
      env,
      WestpacAirpointsMastercardID,
      "cashAdvanceRate",
      plainRate
    );
  }

  let fee = await FindWestPacAnnualFee(WestpacAirpointsMastercardURL, page);

  if (CheckRateValid()) {
    let plainfee = WestpacAnnualFeeStrip(fee);
    await updateItem(env, WestpacAirpointsMastercardID, "feePrimary", plainfee);
  }

  await updateItem(
    env,
    WestpacAirpointsMastercardID,
    "interestFreePeriod",
    await FindInterestFreePeriodWestpac(page)
  );
}

export async function UpdateWestpacAirpointsWorldMastercard(page, env) {
  console.log("updating Westpac Airpoints World Mastercard");
  let rate = await FindWestPacPurchaseRate(
    WestpacAirpointsWorldMastercardURL,
    page
  );

  if (CheckRateValid()) {
    let plainRate = PlainStrip(rate);
    await updateItem(
      env,
      WestpacAirpointsWorldMastercardID,
      "purchasesRate",
      plainRate
    );
  }

  let cash = await FindWestPacCashRate(
    WestpacAirpointsWorldMastercardURL,
    page
  );

  if (CheckRateValid()) {
    let plainRate = PlainStrip(cash);
    await updateItem(
      env,
      WestpacAirpointsWorldMastercardID,
      "cashAdvanceRate",
      plainRate
    );
  }

  let fee = await FindWestPacAnnualFee(
    WestpacAirpointsWorldMastercardURL,
    page
  );

  if (CheckRateValid()) {
    let plainfee = WestpacAnnualFeeStrip(fee);
    await updateItem(
      env,
      WestpacAirpointsWorldMastercardID,
      "feePrimary",
      plainfee
    );
  }

  await updateItem(
    env,
    WestpacAirpointsWorldMastercardID,
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
