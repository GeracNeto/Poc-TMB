import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OrdersTable } from "./components/OrdersTable";
import { IOrder } from "./types/order.interface";
import { getOrders } from "./services/orderService";
import { OrderDetail } from "./components/OrderDetail";

export default function App() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    setLoader(true);
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
      setLoader(false);
    };
    fetchOrders();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="flex justify-between items-center p-4 bg-slate-900">
          <h2 className="font-medium text-slate-100">Lista de Pedidos TMB</h2>
        </header>

        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                <OrdersTable
                  orders={orders}
                  loader={loader}
                  setOrders={setOrders}
                />
              }
            />
            <Route
              path="/order/:id"
              element={<OrderDetail orders={orders} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
