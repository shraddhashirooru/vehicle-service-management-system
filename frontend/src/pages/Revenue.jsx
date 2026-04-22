import { useEffect, useState } from "react";
import {
  getDailyRevenue,
  getMonthlyRevenue,
  getYearlyRevenue,
} from "../services/api";

function Revenue() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDaily((await getDailyRevenue()).data);
    setMonthly((await getMonthlyRevenue()).data);
    setYearly((await getYearlyRevenue()).data);
  };

  return (
    <div>
      <h3>Revenue</h3>

      <h4>Daily</h4>
      {daily.map((d, i) => (
        <div key={i}>
          {d.date} - ₹{d.revenue}
        </div>
      ))}

      <h4>Monthly</h4>
      {monthly.map((m, i) => (
        <div key={i}>
          {m.month} - ₹{m.revenue}
        </div>
      ))}

      <h4>Yearly</h4>
      {yearly.map((y, i) => (
        <div key={i}>
          {y.year} - ₹{y.revenue}
        </div>
      ))}
    </div>
  );
}

export default Revenue;