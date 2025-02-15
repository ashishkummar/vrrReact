const GA4_MEASUREMENT_ID = "G-GM5NWSM97Z";  //  
const API_SECRET = "5QbloJVXSjGD2j50zqAS1w";  //  
 
const CLIENT_ID = crypto.randomUUID();  // Unique user identifier

export async function trackEvent(eventName: string, eventParams: Record<string, any> = {}) {
    const payload = {
        client_id: CLIENT_ID,
        events: [{ name: eventName, params: eventParams }]
    };

    try {
        const response = await fetch(
            `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${API_SECRET}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );
        console.log(`GA4 Event Sent: ${eventName}`);
    } catch (error) {
        console.error("GA4 Error:", error);
    }
}
