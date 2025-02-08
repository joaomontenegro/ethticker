// Function to fetch Ethereum price and update the badge
function updateEthereumPrice() {
  // CoinGecko API endpoint for Ethereum price in USD
  const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Verify that the data structure is as expected
      if (data && data.ethereum && data.ethereum.usd) {
        const price = data.ethereum.usd;
        let formattedPrice;

        // If the price is 1000 or more, format it with a "K" suffix (one decimal place)
        if (price >= 1000) {
          formattedPrice = (price / 1000).toFixed(1) + 'K';
        } else {
          // Otherwise, show the price with two decimals
          formattedPrice = parseFloat(price).toFixed(2);
        }

        // Update the badge text with the formatted price
        chrome.action.setBadgeText({ text: formattedPrice });
        chrome.action.setBadgeBackgroundColor({ color: '#3c3c3c' });
      } else {
        console.error("Unexpected data format:", data);
        chrome.action.setBadgeText({ text: "ERR" });
      }
    })
    .catch(error => {
      console.error("Error fetching Ethereum price:", error);
      chrome.action.setBadgeText({ text: "ERR" });
    });
}

// Update the Ethereum price immediately when the service worker starts.
updateEthereumPrice();

// Create an alarm that fires every 30 seconds (0.5 minutes)
chrome.alarms.create("updateEthereumPriceAlarm", {
  periodInMinutes: 30 / 60
});

// Listen for the alarm event and update the Ethereum price when it fires.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateEthereumPriceAlarm") {
    updateEthereumPrice();
  }
});
