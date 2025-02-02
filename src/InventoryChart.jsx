import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function InventoryChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.title),
    datasets: [
      {
        label: "Quantity",
        data: data.map((item) => item.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },

      {
        label: "Unit Price",
        data: data.map((item) => item.unitPrice),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px", margin: "auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default InventoryChart;
