import axios from "axios";

const API_KEY = "CV5VA8PWX93NT3H5"; // Replace this with your actual API key

export async function fetchStockData(symbols) {
  const stockData = [];

  for (const symbol of symbols) {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: "TIME_SERIES_DAILY", // ✅ Switch to the free API
          symbol: symbol,
          apikey: API_KEY,
        },
      });

      console.log(`API Response for ${symbol}:`, response.data); // Debugging

      // Check if API returned an error
      if (response.data["Error Message"]) {
        console.error(`Alpha Vantage Error: ${response.data["Error Message"]}`);
        continue;
      }

      // Check if Time Series data exists
      if (!response.data["Time Series (Daily)"]) {
        console.warn(`No data found for ${symbol}`);
        continue;
      }

      const timeSeries = response.data["Time Series (Daily)"];
      const prices = Object.values(timeSeries).map((entry) => parseFloat(entry["4. close"]));

      // Calculate daily returns
      const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);

      // Compute Average Return
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;

      // Compute Volatility (standard deviation of returns)
      const variance = returns.reduce((a, b) => a + (b - avgReturn) ** 2, 0) / returns.length;
      const volatility = Math.sqrt(variance);

      stockData.push({ symbol, avgReturn, volatility });
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  return stockData;
}
