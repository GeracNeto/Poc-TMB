import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { OrdersTable } from "./components/OrdersTable";
import { IOrder } from "./types/order.interface";
import { getOrders } from "./services/orderService";

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
      <div className="p-4">
        <nav className="mb-4">
          <Link className="mr-4 text-blue-500" to="/">
            Pedidos
          </Link>
          <Link className="text-blue-500" to="/new">
            Novo Pedido
          </Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={<OrdersTable orders={orders} loader={loader} />}
          />
        </Routes>
      </div>
    </Router>
  );
}
