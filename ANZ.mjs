import { CheckRateValid } from "./validations.mjs";
import { PlainStrip, Strip } from "./regexclean.mjs";
import { updateItem } from "./contentful.mjs";
import * as URL from "./URLs.mjs";

async function FindInterestFreePeriod(page) {
  let html = await page.content();
  let data = html.match(/Up to \d\d days/g);
  let days = data[0].match(/\d\d/g);
  return days[0];
}

async function FindAnnualFee(page) {
  let html = await page.content();
  let data = html.match(/\$\d{2,3}\sp/g);
  let fee = data[0].match(/\d{2,3}/g);
  return fee[0];
}

export async function UpdateANZLowRateVisa(page, env) {
  console.log("ANZ Low Rate Visa");

  // Get the Cash Advance Rate for ANZ Low Rate Visa
  let ANZLowRateCashRate = await ReadValue(
    page,
    URL.ANZLowRateURL,
    "NZLIVC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    env,
    URL.ANZLowRateVisa,
    "cashAdvanceRate",
    Strip(ANZLowRateCashRate, "cashRate")
  );

  // Get the Purchase Advance Rate for ANZ Low Rate Visa
  let ANZLowRatePurchaseRate = await ReadValue(
    page,
    URL.ANZLowRateURL,
    "NZLIVP",
    "purchaseRate"
  );

  // Now update this in contentful
  await updateItem(
    env,
    URL.ANZLowRateVisa,
    "purchasesRate",
    Strip(ANZLowRatePurchaseRate, "purchaseRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    env,
    URL.ANZLowRateVisa,
    "interestFreePeriod",
    await FindInterestFreePeriod(page)
  );
}

export async function UpdateANZAirpointsVisaPlatinum(page, env) {
  console.log("updating ANZ Airpoints platinum visa");

  // Get the Purchase Rate for ANZ Airpoints platinum visa
  let ANZAirpointsVisaPlatinumPurchaseRate = await ReadValue(
    page,
    URL.ANZAirpointVisaPlatinumURL,
    "NZAPPP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaPlatinumID,
    "purchasesRate",
    Strip(ANZAirpointsVisaPlatinumPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Airpoints platinum visa
  let ANZAirpointsVisaPlatinumCashRate = await ReadValue(
    page,
    URL.ANZAirpointVisaPlatinumURL,
    "NZAPPC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaPlatinumID,
    "cashAdvanceRate",
    Strip(ANZAirpointsVisaPlatinumCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaPlatinumID,
    "interestFreePeriod",
    await FindInterestFreePeriod(page)
  );

  // Update the Primary Fee in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaPlatinumID,
    "feePrimary",
    await FindAnnualFee(page)
  );
}

export async function UpdateANZCashbackVisa(page, env) {
  console.log("updating ANZ Cashback Visa");

  // Get the Purchase Rate for ANZ Cashback visa
  let ANZCashbackVisaPurchaseRate = await ReadValue(
    page,
    URL.ANZCashbackVisaURL,
    "NZCVP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaID,
    "purchasesRate",
    Strip(ANZCashbackVisaPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Airpoints visa
  let ANZCashbackVisaCashRate = await ReadValue(
    page,
    URL.ANZCashbackVisaURL,
    "NZCVC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaID,
    "cashAdvanceRate",
    Strip(ANZCashbackVisaCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaID,
    "interestFreePeriod",
    await FindInterestFreePeriod(page)
  );

  // Update the Primary Fee in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaID,
    "feePrimary",
    await FindAnnualFee(page)
  );
}

export async function UpdateANZCashbackVisaPlatinum(page, env) {
  console.log("updating ANZ Cashback Visa Platinum");

  // Get the Purchase Rate for ANZ Cashback visa platinum
  let ANZCashbackVisaPlatinumPurchaseRate = await ReadValue(
    page,
    URL.ANZCashbackVisaPlatinumURL,
    "NZCVPP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaPlatinumID,
    "purchasesRate",
    Strip(ANZCashbackVisaPlatinumPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Cashback visa platinum
  let ANZCashbackVisaPlatinumCashRate = await ReadValue(
    page,
    URL.ANZCashbackVisaPlatinumURL,
    "NZCVPC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaPlatinumID,
    "cashAdvanceRate",
    Strip(ANZCashbackVisaPlatinumCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaPlatinumID,
    "interestFreePeriod",
    await FindInterestFreePeriod(page)
  );

  // Update the Primary Fee in contentful
  await updateItem(
    env,
    URL.ANZCashbackVisaPlatinumID,
    "feePrimary",
    await FindAnnualFee(page)
  );
}

export async function UpdateANZAirpointsVisa(page, env) {
  console.log("updating ANZ Airpoints visa");

  // Get the Purchase Rate for ANZ Airpoints visa
  let ANZAirpointsVisaPurchaseRate = await ReadValue(
    page,
    URL.ANZAirpointsVisaURL,
    "NZAPCP",
    "purchaseRate"
  );

  //Now update this in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaID,
    "purchasesRate",
    Strip(ANZAirpointsVisaPurchaseRate, "purchaseRate")
  );

  // Get the Cash Advance Rate for ANZ Airpoints visa
  let ANZAirpointsVisaCashRate = await ReadValue(
    page,
    URL.ANZAirpointsVisaURL,
    "NZAPCC",
    "cashRate"
  );

  // Now update this in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaID,
    "cashAdvanceRate",
    Strip(ANZAirpointsVisaCashRate, "cashRate")
  );

  // Update the interest Free days in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaID,
    "interestFreePeriod",
    await FindInterestFreePeriod(page)
  );

  // Update the Primary Fee in contentful
  await updateItem(
    env,
    URL.ANZAirpointsVisaID,
    "feePrimary",
    await FindAnnualFee(page)
  );
}

async function ReadValue(page, url, attr, item) {
  await page.goto(url);

  const [data] = await page.evaluate((attrsel) => {
    return [
      ...document.querySelectorAll(`[data-baserate-code='${attrsel}']`),
    ].map((elem) => elem.innerText);
  }, attr);

  return { [item]: data };
}
