import { useState } from "react";
import ItemOrders from "./ItemOrders";
import RepairOrders from "./RepairOrders";

function Orders() {
  const [tab, setTab] = useState("items");

  return (
    <div>
      <h3>Orders</h3>

      {/* SUB TABS */}
      <div className="nav-links">
        <button
          className={tab === "items" ? "active" : ""}
          onClick={() => setTab("items")}
        >
          Items
        </button>

        <button
          className={tab === "repairs" ? "active" : ""}
          onClick={() => setTab("repairs")}
        >
          Repairs
        </button>
      </div>

      {tab === "items" && <ItemOrders />}
      {tab === "repairs" && <RepairOrders />}
    </div>
  );
}

export default Orders;