// OrderDetails.jsx
import { useParams, Link } from "react-router-dom";
import { IOrder } from "../types/order.interface";
interface OrdersTableProps {
  orders: IOrder[];
}

export function OrderDetail({ orders }: OrdersTableProps) {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <p>Pedido não encontrado.</p>;
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">Detalhes do pedido de ID: {order.id}</h3>

      <p className="font-bold">{order.produto}</p>
      <p>{order.cliente}</p>
      <Link to="/" className="text-blue-500">
        Voltar
      </Link>
    </div>
  );
}
