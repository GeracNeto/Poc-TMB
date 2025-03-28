import { IOrder } from "../types/order.interface";
import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, deleteOrder } from "../services/orderService";
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
  const [deleteLoader, setDeleteLoader] = useState({
    loader: false,
    orderid: "",
  });

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

  const handleDelete = async (orderid: string) => {
    setDeleteLoader({
      loader: true,
      orderid,
    });
    try {
      await deleteOrder(orderid);
      setOrders(orders.filter((order) => order.id !== orderid));
      alert("Pedido deletado com sucesso!");
    } catch (error) {
      alert("Falha ao deletar pedido. Por favor, tente novamente.");
    } finally {
      setDeleteLoader({
        loader: false,
        orderid: "",
      });
    }
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
          {orders.length ? (
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
                      onClick={() => goToOrderDetail(order.id)}
                      title="Detalhes do pedido"
                    >
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
                        ? new Date(order.dataCriacao).toLocaleDateString(
                            "pt-BR"
                          )
                        : "Data inválida"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order.id);
                        }}
                        disabled={deleteLoader.orderid === order.id}
                        className={`text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors ${
                          deleteLoader.orderid === order.id
                            ? "cursor-not-allowed opacity-70"
                            : "cursor-pointer"
                        }`}
                        title="Deletar pedido"
                      >
                        {deleteLoader.orderid === order.id ? (
                          <svg
                            className="animate-spin h-5 w-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum pedido encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Crie um novo pedido clicando no botão "Novo Pedido"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
