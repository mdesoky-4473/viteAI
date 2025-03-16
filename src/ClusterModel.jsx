import { kmeans } from "ml-kmeans";

export function performClustering(stockData, numClusters = 3) {
  if (stockData.length < numClusters) {
    throw new Error("Not enough stocks for clustering.");
  }

  // Extract features (returns and volatility)
  const inputData = stockData.map((s) => [s.avgReturn, s.volatility]);

  // Perform K-Means clustering
  const result = kmeans(inputData, numClusters);

  // Map each stock to its cluster
  const clusteredStocks = stockData.map((s, i) => ({
    ...s,
    cluster: result.clusters[i],
  }));

  // Get cluster centroids
  const centroids = result.centroids;

  return { clusteredStocks, centroids };
}
