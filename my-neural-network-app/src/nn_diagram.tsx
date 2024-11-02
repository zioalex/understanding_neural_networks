import React, { useState, useEffect } from 'react';

const NetworkDiagram = ({ step }) => {
  const scalingFactor = 1.5; // Define the scaling factor
  const Node = ({ cx, cy, label, type, stepVisible }) => {
      const getNodeColor = (type, isActive) => {
        if (!isActive) return "#f0f0f0";
        const colors = {
          input: "#333333",
          hidden: "#ffeeba",
          output: "#d5f5e3",
          expected: "#d5f5e3",
          loss: "#f5b7b1"
        };
        return colors[type] || "#f0f0f0";
      };
  
      return (
        <g>
          <circle
            cx={cx * scalingFactor}
            cy={cy * scalingFactor}
            r={30 * scalingFactor}
            fill={step >= stepVisible ? getNodeColor(type, true) : "#f0f0f0"}
            stroke={step >= stepVisible ? "#333" : "#ddd"}
            strokeWidth="3"
          />
          <text
            x={cx * scalingFactor}
            y={cy * scalingFactor}
            textAnchor="middle"
            dy=".3em"
            fill={type === "input" && step >= stepVisible ? "#fff" : "#666"}
            fontSize={16 * scalingFactor}
          >
            {label}
          </text>
        </g>
      );
    };

  const Connection = ({ x1, y1, x2, y2, stepVisible, isBackprop = false }) => (
    <line
      x1={x1 * 1.5}
      y1={y1 * 1.5}
      x2={x2 * 1.5}
      y2={y2 * 1.5}
      stroke={step >= stepVisible ? (isBackprop ? "#ff0000" : "#000") : "#ddd"}
      strokeWidth="2"
    />
  );

  const Value = ({ x, y, value, stepVisible, isGradient = false }) => (
    <g style={{ opacity: step >= stepVisible ? 1 : 0 }}>
      <rect
        x={x - 40}
        y={y - 15}
        width="80"
        height="30"
        fill={isGradient ? "#ffeeee" : "white"}
        stroke={isGradient ? "#ff4444" : "#666"}
        rx="6"
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fill={isGradient ? "#ff4444" : "#333"}
      >
        {value}
      </text>
    </g>
  );

  const WeightUpdate = ({ x, y, oldWeight, newWeight, stepVisible }) => (
    <g style={{ opacity: step >= stepVisible ? 1 : 0 }}>
      <rect
        x={x - 50}
        y={y - 15}
        width="100"
        height="30"
        fill="#e8f4ff"
        stroke="#4a90e2"
        rx="6"
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fill="#2c5282"
      >
        {`${oldWeight} → ${newWeight}`}
      </text>
    </g>
  );

  return (
    <svg width="1000" height="600" className="bg-white rounded shadow p-8">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="15"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <polygon points="0 0, 15 5, 0 10" fill="#ff4444" />
        </marker>
      </defs>

      {/* Forward Connections */}
      <Connection x1={150} y1={150} x2={450} y2={120} stepVisible={2} />
      <Connection x1={150} y1={150} x2={450} y2={380} stepVisible={2} />
      <Connection x1={150} y1={350} x2={450} y2={120} stepVisible={2} />
      <Connection x1={150} y1={350} x2={450} y2={380} stepVisible={2} />
      <Connection x1={450} y1={120} x2={750} y2={250} stepVisible={3} />
      <Connection x1={450} y1={380} x2={750} y2={250} stepVisible={3} />

      {/* Backpropagation */}
      <Connection x1={850} y1={250} x2={750} y2={250} stepVisible={5} isBackprop={true} />
      <Connection x1={750} y1={250} x2={450} y2={120} stepVisible={6} isBackprop={true} />
      <Connection x1={750} y1={250} x2={450} y2={380} stepVisible={6} isBackprop={true} />
      <Connection x1={450} y1={120} x2={150} y2={150} stepVisible={7} isBackprop={true} />
      <Connection x1={450} y1={120} x2={150} y2={350} stepVisible={7} isBackprop={true} />
      <Connection x1={450} y1={380} x2={150} y2={150} stepVisible={7} isBackprop={true} />
      <Connection x1={450} y1={380} x2={150} y2={350} stepVisible={7} isBackprop={true} />

      {/* Nodes */}
      <Node cx={150} cy={150} label="x₁" type="input" stepVisible={1} />
      <Node cx={150} cy={350} label="x₂" type="input" stepVisible={1} />
      <Node cx={450} cy={120} label="h₁" type="hidden" stepVisible={2} />
      <Node cx={450} cy={380} label="h₂" type="hidden" stepVisible={2} />
      <Node cx={750} cy={250} label="ŷ" type="output" stepVisible={3} />
      <Node cx={850} cy={150} label="y" type="expected" stepVisible={4} />
      <Node cx={850} cy={250} label="Loss" type="loss" stepVisible={4} />

      {/* Forward Values */}
      <Value x={150} y={80} value="0.5" stepVisible={1} />
      <Value x={150} y={420} value="0.8" stepVisible={1} />
      <Value x={450} y={50} value="0.49" stepVisible={2} />
      <Value x={450} y={450} value="0.62" stepVisible={2} />
      <Value x={750} y={180} value="0.55" stepVisible={3} />
      <Value x={850} y={80} value="1.0" stepVisible={4} />
      <Value x={850} y={320} value="0.45" stepVisible={4} />

      {/* Gradients */}
      <Value x={800} y={250} value="dL/dy=-0.45" stepVisible={5} isGradient={true} />
      <Value x={500} y={80} value="dL/dh₁=-0.23" stepVisible={6} isGradient={true} />
      <Value x={500} y={420} value="dL/dh₂=-0.22" stepVisible={6} isGradient={true} />
      <Value x={300} y={100} value="dL/dw₁₁=-0.115" stepVisible={7} isGradient={true} />
      <Value x={300} y={200} value="dL/dw₁₂=-0.184" stepVisible={7} isGradient={true} />
      <Value x={300} y={300} value="dL/dw₂₁=-0.110" stepVisible={7} isGradient={true} />
      <Value x={300} y={400} value="dL/dw₂₂=-0.176" stepVisible={7} isGradient={true} />

      {/* Weight Updates */}
      <WeightUpdate x={280} y={120} oldWeight="0.5" newWeight="0.512" stepVisible={8} />
      <WeightUpdate x={280} y={180} oldWeight="0.3" newWeight="0.318" stepVisible={8} />
      <WeightUpdate x={280} y={320} oldWeight="0.6" newWeight="0.611" stepVisible={8} />
      <WeightUpdate x={280} y={380} oldWeight="0.4" newWeight="0.418" stepVisible={8} />
    </svg>
  );
};

const ValueTable = ({ currentStep }) => (
  <div className="p-6 bg-white rounded shadow">
    <table className="min-w-full border-collapse text-left">
      <thead>
        <tr className="bg-gray-50">
          <th className="p-4 border text-lg font-semibold">Step</th>
          <th className="p-4 border text-lg font-semibold">Component</th>
          <th className="p-4 border text-lg font-semibold">Values</th>
        </tr>
      </thead>
      <tbody>
        {[
          {
            step: 1,
            component: "Inputs",
            values: ["x₁ = 0.5", "x₂ = 0.8"],
            color: "#333333",
            textColor: "white"
          },
          {
            step: 2,
            component: "Hidden Layer",
            values: [
              "h₁ = 0.49 (w₁₁ = 0.5, w₁₂ = 0.3)",
              "h₂ = 0.62 (w₂₁ = 0.6, w₂₂ = 0.4)"
            ],
            color: "#ffeeba"
          },
          {
            step: 3,
            component: "Output",
            values: ["ŷ = 0.55"],
            color: "#d5f5e3"
          },
          {
            step: 4,
            component: "Loss",
            values: ["y = 1.0", "Loss = 0.45"],
            color: "#f5b7b1"
          },
          {
            step: 5,
            component: "Output Gradient",
            values: ["dL/dy = -0.45"],
            color: "#ffeeee"
          },
          {
            step: 6,
            component: "Hidden Gradients",
            values: ["dL/dh₁ = -0.23", "dL/dh₂ = -0.22"],
            color: "#ffeeee"
          },
          {
            step: 7,
            component: "Weight Gradients",
            values: [
              "dL/dw₁₁ = -0.115",
              "dL/dw₁₂ = -0.184",
              "dL/dw₂₁ = -0.110",
              "dL/dw₂₂ = -0.176"
            ],
            color: "#ffeeee"
          },
          {
            step: 8,
            component: "Weight Updates",
            values: [
              "w₁₁: 0.5 → 0.512",
              "w₁₂: 0.3 → 0.318",
              "w₂₁: 0.6 → 0.611",
              "w₂₂: 0.4 → 0.418"
            ],
            color: "#e8f4ff"
          },
          {
            step: 9,
            component: "Complete",
            values: ["Ready for next iteration"],
            color: "#e6f3ff"
          }
        ].map(({ step: rowStep, component, values, color, textColor = "black" }) => (
          <tr
            key={rowStep}
            style={{
              backgroundColor: currentStep >= rowStep ? color : "#f3f4f6",
              color: currentStep >= rowStep ? textColor : "black"
            }}
          >
            <td className="p-4 border text-lg">{rowStep}</td>
            <td className="p-4 border text-lg">{component}</td>
            <td className="p-4 border text-lg">
              {values.map((value, idx) => (
                <React.Fragment key={idx}>
                  {value}
                  {idx < values.length - 1 && <br />}
                </React.Fragment>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StepMessage = ({ step }) => {
  const messages = {
    0: "Click Play to start the animation",
    1: "Step 1: Input values enter the network",
    2: "Step 2: Values propagate to hidden layer",
    3: "Step 3: Hidden layer produces output",
    4: "Step 4: Calculate loss",
    5: "Step 5: Start backpropagation",
    6: "Step 6: Propagate to hidden layer",
    7: "Step 7: Calculate weight gradients",
    8: "Step 8: Update weights",
    9: "Step 9: Ready for next iteration"
  };

  return (
    <div className="mt-6 p-6 bg-white rounded shadow w-full max-w-3xl text-center text-lg">
      {messages[step]}
    </div>
  );
};

const NeuralNetwork = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => (prev < 9 ? prev + 1 : 0));
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="mb-6 space-x-6">
          <button
            className="px-6 py-3 text-lg bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="px-6 py-3 text-lg bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setStep(0)}
          >
            Reset
          </button>
          <span className="text-lg text-gray-600">Step: {step}/9</span>
        </div>

        <NetworkDiagram step={step} />
        <StepMessage step={step} />
      </div>

      <div className="md:w-1/3">
        <ValueTable currentStep={step} />
      </div>
    </div>
  );
};

export default NeuralNetwork;