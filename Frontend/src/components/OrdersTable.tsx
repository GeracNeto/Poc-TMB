import { Link } from "react-router-dom";
import { IOrder } from "../types/order.interface";

interface OrdersTableProps {
  orders: IOrder[];
  loader: boolean;
}

/**
 * Componente de tabela de pedidos
 *
 * @param {IOrder[]} orders - Lista de pedidos
 * @param {boolean} loader - Indicador de carregamento da tabela
 * @returns {JSX.Element} - Retorna a tabela dos pedidos
 */
export function OrdersTable({ orders, loader }: OrdersTableProps) {
  return (
    <div>
      {loader ? (
        <div>Carregando...</div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">Lista de Pedidos</h2>
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
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">{order.cliente}</td>
                  <td className="border p-2">
                    <Link className="text-blue-500" to={`/order/${order.id}`}>
                      {order.produto}
                    </Link>
                  </td>
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
