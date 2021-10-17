export function Strip(val, field) {
  let regex = /\d{2}.\d{2}/g;
  let data = val[field];
  let res = data.match(regex);
  return res;
}

export function PlainStrip(val) {
  let regex = /\d{2}.\d{2}/g;
  let res = val.match(regex);
  return res;
}

export function PlainStripDays(val) {
  let regex = /\d{2}/g;
  let res = val.match(regex);
  return res;
}

export function WestpacAnnualFeeStrip(val) {
  if (val == 0) return "0";

  let data = val.match(/\$\d{2,3}/g) ?? "0" ;
  let fee = data[0].match(/\d{2,3}/g) ?? "0";
  return fee[0];
}

export async function FindInterestFreePeriodWestpac(page) {
  let html = await page.content();
  let data = html.match(/[Uu]p to \d{2,3} days interest/g);
  let days = data[0].match(/\d\d/g);
  return days[0];
}
