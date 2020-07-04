export async function updateItem(env, itemID, field, newValue) {
  let entry = await env.getEntry(itemID);
  entry.fields[field] = { "en-US": parseFloat(newValue) };
  await entry.update();
  let newVersion = await env.getEntry(itemID);
  await newVersion.publish();
  console.log(`updated ${field} to ${newValue}`);
}
