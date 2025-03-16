import React, { useState } from "react";
import { fetchStockData } from "./fetchStockData";
import { performClustering } from "./ClusterModel";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function App() {
  const [stockInput, setStockInput] = useState("");
  const [clusterData, setClusterData] = useState(null);

  const handleClusterAnalysis = async () => {
    const symbols = stockInput.split(",").map((s) => s.trim().toUpperCase());

    try {
      const stockData = await fetchStockData(symbols);

      if (stockData.length < 2) {
        alert("Not enough valid stocks for clustering.");
        return;
      }

      const { clusteredStocks, centroids } = performClustering(stockData, 3); // 3 clusters

      setClusterData({ clusteredStocks, centroids });
    } catch (error) {
      console.error("Error performing clustering:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Stock Cluster Analysis</h1>
      <input
        type="text"
        placeholder="Enter stock symbols (e.g. AAPL, MSFT, TSLA)"
        value={stockInput}
        onChange={(e) => setStockInput(e.target.value)}
        style={{ width: "300px", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={handleClusterAnalysis}>Analyze</button>

      {clusterData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Cluster Results</h2>
          <ul>
            {clusterData.clusteredStocks.map((stock) => (
              <li key={stock.symbol}>
                {stock.symbol}: Cluster {stock.cluster}
              </li>
            ))}
          </ul>

          {/* Scatter Plot Visualization */}
          <ScatterChart width={600} height={400}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="avgReturn" name="Average Return" />
          <YAxis type="number" dataKey="volatility" name="Volatility" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />

          {/* Only Show Centroids in Legend */}
          <Legend payload={clusterData.centroids.map((_, i) => ({
            value: `Centroid ${i}`,
            type: "star",
            id: `centroid-${i}`,
            color: "black",
          }))} />

          {/* Render each cluster, but exclude from legend */}
          {[...new Set(clusterData.clusteredStocks.map((s) => s.cluster))].map((clusterId) => (
            <Scatter
              key={`cluster-${clusterId}`}
              name="" // Remove from legend
              data={clusterData.clusteredStocks.filter((s) => s.cluster === clusterId)}
              fill={`hsl(${clusterId * 60}, 70%, 50%)`}
            />
          ))}

          {/* Render Centroid Points */}
          {clusterData.centroids.map((centroid, i) => (
            <Scatter
              key={`centroid-${i}`}
              name={`Centroid ${i}`}
              data={[{ avgReturn: centroid[0], volatility: centroid[1] }]}
              fill="black"
              shape="star"
            />
          ))}
         </ScatterChart>

        </div>
      )}
    </div>
  );
}

export default App;
