import { useEffect, useState } from "react";
import {
  getDailyRevenue,
  getMonthlyRevenue,
  getYearlyRevenue,
} from "../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Revenue() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError("");

      const [d, m, y] = await Promise.all([
        getDailyRevenue(),
        getMonthlyRevenue(),
        getYearlyRevenue(),
      ]);

      setDaily(d.data);
      setMonthly(m.data);
      setYearly(y.data);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to load revenue"
      );
    } finally {
      setLoading(false);
    }
  };

  const todayRevenue =
    daily.length > 0
      ? daily[daily.length - 1].revenue
      : 0;

  const monthRevenue =
    monthly.length > 0
      ? monthly[monthly.length - 1].revenue
      : 0;

  const yearRevenue =
    yearly.length > 0
      ? yearly[yearly.length - 1].revenue
      : 0;

  const pieColors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA66CC",
  ];

  return (
    <div className="container">
      <h2>Revenue Dashboard</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading revenue...</p>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px",
              marginBottom: "25px",
            }}
          >
            <div className="list-item">
              <h4>Today</h4>
              <p>₹{Number(todayRevenue).toFixed(2)}</p>
            </div>

            <div className="list-item">
              <h4>This Month</h4>
              <p>₹{Number(monthRevenue).toFixed(2)}</p>
            </div>

            <div className="list-item">
              <h4>This Year</h4>
              <p>₹{Number(yearRevenue).toFixed(2)}</p>
            </div>
          </div>

          {/* DAILY CHART */}
          <div className="list-item">
            <h3>Daily Revenue</h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />
                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="revenue"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* MONTHLY CHART */}
          <div
            className="list-item"
            style={{ marginTop: "20px" }}
          >
            <h3>Monthly Revenue</h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />
                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* YEARLY CHART */}
          <div
            className="list-item"
            style={{ marginTop: "20px" }}
          >
            <h3>Yearly Revenue</h3>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <PieChart>
                <Pie
                  data={yearly}
                  dataKey="revenue"
                  nameKey="year"
                  outerRadius={110}
                  label
                >
                  {yearly.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          pieColors[
                            index %
                              pieColors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Revenue;