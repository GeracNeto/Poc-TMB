import { useParams, Link } from "react-router-dom";
import { IOrder } from "../types/order.interface";

interface OrdersTableProps {
  orders: IOrder[];
}

const statusColors: Record<string, string> = {
  Pendente: "bg-yellow-100 text-yellow-800",
  Processando: "bg-blue-100 text-blue-800",
  Finalizado: "bg-green-100 text-green-800",
};

export function OrderDetail({ orders }: OrdersTableProps) {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            Pedido não encontrado
          </h3>
          <Link
            to="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Voltar para lista de pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Detalhes do Pedido
          </h2>
          <p className="text-sm text-gray-500">ID: {order.id}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informações do Pedido
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Produto</p>
              <p className="text-sm text-gray-900">{order.produto}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Valor</p>
              <p className="text-sm text-gray-900">
                R$ {Number(order.valor).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  statusColors[order.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Data de Criação
              </p>
              <p className="text-sm text-gray-900">
                {order.dataCriacao
                  ? new Date(order.dataCriacao).toLocaleDateString("pt-BR")
                  : "Data inválida"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Informações do Cliente
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="text-sm text-gray-900">{order.cliente}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
