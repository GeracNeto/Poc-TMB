import { IOrder } from "../types/order.interface";
import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import OrderForm from "./OrderForm";

interface OrdersTableProps {
  orders: IOrder[];
  loader: boolean;
  setOrders: (orders: IOrder[]) => void; 
}

/**
 * Componente de tabela de pedidos
 *
 * @param {IOrder[]} orders - Lista de pedidos
 * @param {Function} setOrders - Função para atualizar pedidos
 * @param {boolean} loader - Indicador de carregamento da tabela
 * @returns {JSX.Element} - Retorna a tabela dos pedidos
 */
export function OrdersTable({
  orders,
  setOrders,
  loader,
}: OrdersTableProps): JSX.Element {
  const navigate = useNavigate();
  const [enableNewOrder, setEnableNewOrder] = useState<boolean>(false);

  const goToOrderDetail = (orderid: string) => {
    navigate(`/order/${orderid}`);
  };

  const onSubmit = async (newOrder: Partial<IOrder>) => {
    const order = await createOrder(newOrder);

    if (order) {
      setOrders([...orders, order]);
    }
  };

  return (
    <div>
      <button
        className="flex items-center px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer mb-4"
        onClick={() => setEnableNewOrder(!enableNewOrder)}
      >
        Novo Pedido
        <span className="ml-2 text-xl">+</span>
      </button>

      {enableNewOrder && (
        <div className="mb-6">
          <OrderForm onSubmit={onSubmit} />
        </div>
      )}

      {loader ? (
        <div>Carregando...</div>
      ) : (
        <>
          <h3 className="font-semibold mb-2">Lista de Pedidos</h3>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Cliente</th>
                <th className="border p-2">Produto</th>
                <th className="border p-2">Valor</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Data Criação</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => goToOrderDetail(order.id)}
                >
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">{order.cliente}</td>
                  <td className="border p-2">{order.produto}</td>
                  <td className="border p-2">R$ {order.valor}</td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">
                    {order.dataCriacao
                      ? new Date(order.dataCriacao).toDateString()
                      : "Data inválida"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
