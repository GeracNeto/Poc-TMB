import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { OrdersTable } from "./components/OrdersTable";
import { IOrder } from "./types/order.interface";
import { getOrders } from "./services/orderService";
import { OrderDetail } from "./components/OrderDetail";
import { useSignalR } from "./services/signalr";

export default function App() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const orderUpdate = useSignalR();

  useEffect(() => {
    setLoader(true);
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        setErrorMessage("Erro ao listar os pedidos");
      } finally {
        setLoader(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderUpdate) {
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          if (order.id === orderUpdate.id) {
            return { ...order, status: orderUpdate.status };
          }
          return order;
        });
      });
    }
  }, [orderUpdate]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <img src="https://cdn.prod.website-files.com/6357d4aeff33e738c1d2c99a/65f1a2c6485719759df26f56_img-01.png" alt="TMB Logo"  className="h-10 sm:block hidden"/>
            <h1 className="text-xl font-bold text-gray-900">Gerenciador de Pedidos</h1>
            <nav>
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Lista de Pedidos
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route
              path="/"
              element={
                <OrdersTable
                  orders={orders}
                  loader={loader}
                  errorMessage={errorMessage}
                  setOrders={setOrders}
                />
              }
            />
            <Route
              path="/order/:id"
              element={<OrderDetail orders={orders} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
