import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const MLModel = () => {
  const [model, setModel] = useState(null); // Store trained model
  const [inputValue, setInputValue] = useState(""); // Store user input
  const [prediction, setPrediction] = useState(null); // Store prediction result

  useEffect(() => {
    async function trainModel() {
      // Define a simple model
      const newModel = tf.sequential();
      newModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      newModel.compile({ loss: "meanSquaredError", optimizer: "sgd" });

      // Training data: x values and their corresponding y values (y = 2x + 1)
      const xs = tf.tensor2d([0, 1, 2, 3, 4], [5, 1]);
      const ys = tf.tensor2d([1, 3, 5, 7, 9], [5, 1]);

      // Train the model
      await newModel.fit(xs, ys, { epochs: 250 });

      setModel(newModel); // Store the trained model in state
    }

    trainModel();
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (!model || inputValue === "") return;

    const xInput = parseFloat(inputValue);
    const tensorInput = tf.tensor2d([xInput], [1, 1]);
    const output = model.predict(tensorInput);
    const result = output.dataSync()[0]; // Extract result

    setPrediction(result.toFixed(2)); // Update prediction state
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Interactive ML Model</h1>
      <p>Enter a value for x and get a predicted y:</p>

      <form onSubmit={handlePredict}>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter x value"
          required
        />
        <button type="submit" disabled={!model}>Predict</button>
      </form>

      {prediction !== null && <h2>Prediction: {prediction}</h2>}
    </div>
  );
};

export default MLModel;
