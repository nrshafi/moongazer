const task=await taskSpace(2),page=task.page('p1');
await page.cdp('Emulation.clearDeviceMetricsOverride');
await task.finish({keep:[]});
console.log('QA browser space closed.');
