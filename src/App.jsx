

import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const rows = 15; // Number of rows
  const cols = 20; // Number of columns
  const [wave, setWave] = useState(0); // Current wave position
  const [direction, setDirection] = useState(1); // 1 for moving right, -1 for moving left
  const [colorIndex, setColorIndex] = useState(0); // Current wave color index
  const [waveCycles, setWaveCycles] = useState(0); // Count number of complete cycles

  const colors = ["red", "green", "blue", "pink"]; // Wave colors

  useEffect(() => {
    const interval = setInterval(() => {
      setWave((prevWave) => {
        const nextWave = prevWave + direction;

        // Reverse direction on touching boundaries and change color cycle
        if (nextWave >= cols - 1) {
          setDirection(-1); // Move left
          setWaveCycles((prevCycles) => prevCycles + 1); // Increment cycle
          return cols - 1; // Keep wave within boundary
        } else if (nextWave <= 0) {
          setDirection(1); // Move right
          setWaveCycles((prevCycles) => prevCycles + 1); // Increment cycle
          return 0; // Keep wave within boundary
        }

        return nextWave; // Update wave position
      });
    }, 100); // Wave speed

    return () => clearInterval(interval); // Cleanup on unmount
  }, [direction, cols]);

  useEffect(() => {
    // Change color after every 2 full cycles (or any other number you prefer)
    if (waveCycles >= 6) {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length); // Cycle colors
      setWaveCycles(0); // Reset cycle count
    }
  }, [waveCycles, colors.length]);

  const getCellColor = (row, col) => {
    const distance = Math.abs(wave - col); // Distance from the wave
    if (distance >= 0 && distance < 6) {
      const intensity = Math.max(0, 255 - distance * 40); // Calculate intensity
      const baseColor = colors[colorIndex];

      // Gradually decrease intensity based on distance
      if (baseColor === "red") return `rgba(${intensity}, 0, 0, 1)`;
      if (baseColor === "green") return `rgba(0, ${intensity}, 0, 1)`;
      if (baseColor === "blue") return `rgba(0, 0, ${intensity}, 1)`;
      if (baseColor === "pink") return `rgba(${intensity}, 0, ${intensity}, 1)`;
    }
    return "#000"; // Default grid background
  };

  return (
    <div className="app">
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${rows}, 25px)`,
          gridTemplateColumns: `repeat(${cols}, 25px)`,
        }}
      >
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className="cell"
              style={{ backgroundColor: getCellColor(row, col) }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;


