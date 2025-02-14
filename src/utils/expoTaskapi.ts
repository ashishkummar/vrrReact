export async function loadPixlFromET(_etID: string) {
  try {
    const response = await fetch(
      `https://expotask.exponential.com/node/creative-request/tracking-pixels/apilist/${encodeURIComponent(_etID)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.length) {
      console.warn("No tracking pixels found.");
      return;
    }

    return data; 
  
  } catch (error) {
    console.error("Error fetching tracking pixels:", error);
  }
}

 