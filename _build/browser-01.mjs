const task = await taskSpace('Islamic product lab QA 20261016');
const page = task.page('p1');
await page.goto('file:///I:/_Study_Resource/islamic_product/zakat-scenario-calculator.html');
console.log({spaceId:task.spaceId});
console.log(await page.snapshot());
