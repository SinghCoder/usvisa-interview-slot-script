const puppeteer = require('puppeteer-core');

async function monitorNetworkTraffic() {
    const browser = await puppeteer.connect({browserURL: 'http://localhost:9222'});
    const pages = await browser.pages();
    const page = pages[0]; // Assuming the first page is the one you want to monitor

    // Enable network request interception
    await page.setRequestInterception(true);

    // Listen for network requests
    page.on('request', async (request) => {
        const url = request.url();
        // console.log(`Intercepted request: ${url}`);
        if (url.includes('/api/v1/schedule-group/get-family-ofc-schedule-days')) {
            // console.log(`Caught request: ${url}`);
            request.continue();
        } else {
            request.continue();
        }
    });

    // Listen for network responses
    page.on('response', async (response) => {
        // Get the corresponding request's post data
        const url = response.url();
        // console.log(`Intercepted response: ${url}`)
        if (url.includes('/api/v1/schedule-group/get-family-ofc-schedule-days')) {
            const request = response.request();
            const postData = request.postData();
            // console.log(`Intercepted response for request with post data: ${postData}`);
            const postIDToLocationMap = {
                "3f6bf614-b0db-ec11-a7b4-001dd80234f6": "Chennai",
                "436bf614-b0db-ec11-a7b4-001dd80234f6": "Hyderabad",
                "466bf614-b0db-ec11-a7b4-001dd80234f6": "Kolkata",
                "486bf614-b0db-ec11-a7b4-001dd80234f6": "Mumbai",
                "4a6bf614-b0db-ec11-a7b4-001dd80234f6": "New Delhi",
            }
            // 'parameters={"primaryId":"2a485ecb-8fc9-ee11-a81c-001dd8039ffb","applications":["2a485ecb-8fc9-ee11-a81c-001dd8039ffb"],"scheduleDayId":"","scheduleEntryId":"","postId":"3f6bf614-b0db-ec11-a7b4-001dd80234f6","isReschedule":"true"}'
            // Extract the postID from the post data
            const postID = postData.split('"postId":"')[1].split('"')[0];
            
            // console.log(`Received response for ${url} with status ${response.status()}`);
            const body = await response.text();
            const bodyJSON = JSON.parse(body.trim());
            /*
            {
  ScheduleDays: [
    {
      ID: 'ad7714f2-7ac3-ed11-83fd-001dd803c225',
      Date: '2025-04-14T00:00:00'
    },
    {
            */
            const days = bodyJSON.ScheduleDays;
            const city = postIDToLocationMap[postID];
            if (days.length > 0) {
                // console.log('Found available days:');
                // Pick the first day, and tell how many days away from today.
                const firstDay = days[0];
                const date = new Date(firstDay.Date);
                const today = new Date();
                const diffTime = date - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                console.log(`${city}${Array(20 - city.length).join(" ")} | ${date.toDateString()}   | ${diffDays}`);
            } else {
                console.log(`${city}${Array(20 - city.length).join(" ")} | No available date |  N/A`);
            }
            // // Parse the JSON response and check the condition
            // const jsonResponse = JSON.parse(body);
            // if (jsonResponse.data === 3) {
            //     console.log('Alert: Data is 3!');
            //     // Trigger your alert/notification here
            // }
        }
    });

    // Prevent the script from exiting
    process.stdin.resume();
    console.log('Monitoring network traffic. Press Ctrl + C to exit.');
    console.log(`City${Array(20 - "City".length).join(" ")} |  Available Date   |   Days Away from Today`)
}

monitorNetworkTraffic();
