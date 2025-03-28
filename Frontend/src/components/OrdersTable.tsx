import { IOrder } from "../types/order.interface";
import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import OrderForm from "./OrderForm";

interface OrdersTableProps {
  orders: IOrder[];
  loader: boolean;
  errorMessage: string;
  setOrders: (orders: IOrder[]) => void;
}

export function OrdersTable({
  orders,
  loader,
  errorMessage,
  setOrders,
}: OrdersTableProps): JSX.Element {
  const navigate = useNavigate();
  const [enableNewOrder, setEnableNewOrder] = useState(false);
  const [formLoader, setFormLoader] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const goToOrderDetail = (orderid: string) => {
    navigate(`/order/${orderid}`);
  };

  const onSubmit = async (newOrder: Partial<IOrder>) => {
    setFormLoader(true);
    try {
      const order = await createOrder(newOrder);
      if (order) {
        setOrders([...orders, order]);
        setEnableNewOrder(false);
      }
    } catch (error) {
      setFormErrorMessage("Erro ao criar pedido");
    } finally {
      setFormLoader(false);
    }
  };

  const handleNewOrderButton = () => {
    setEnableNewOrder(!enableNewOrder);
    setFormErrorMessage("");
  };

  const statusColors: Record<string, string> = {
    Pendente: "bg-yellow-100 text-yellow-800",
    Processando: "bg-blue-100 text-blue-800",
    Finalizado: "bg-green-100 text-green-800",
    // Cancelado: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Lista de Pedidos
        </h2>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          onClick={() => handleNewOrderButton()}
        >
          {enableNewOrder ? "Cancelar" : "Novo Pedido"}
          <span className="ml-2 text-lg">{enableNewOrder ? "×" : "+"}</span>
        </button>
      </div>

      {enableNewOrder && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Criar Novo Pedido
          </h3>
          <OrderForm
            formLoader={formLoader}
            errorMessage={formErrorMessage}
            onSubmit={onSubmit}
            onClearError={() => setFormErrorMessage("")}
          />
        </div>
      )}

      {loader ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : errorMessage.length ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cliente
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Produto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data Criação
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => goToOrderDetail(order.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.cliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.produto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {Number(order.valor).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[order.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.dataCriacao
                      ? new Date(order.dataCriacao).toLocaleDateString("pt-BR")
                      : "Data inválida"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
