import { useEffect, useState } from "react";
import { getIssues } from "../services/api";

function ItemOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await getIssues();

    // filter only new components
    const filtered = res.data.filter((i) =>
      i.components?.some((c) => c.type === "new")
    );

    setOrders(filtered);
  };

  return (
    <div>
      <h4>Item Orders</h4>

      {orders.length === 0 ? (
        <p>No item orders</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="list-item">
            Vehicle: {o.vehicle_id} <br />
            Issue: {o.description}

            <button>Mark as Delivered</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ItemOrders;