import React, { useState } from "react";
import { IOrder } from "../types/order.interface";

interface OrderFormProps {
  onSubmit: (order: Partial<IOrder>) => void;
}

export default function OrderForm({ onSubmit }: OrderFormProps) {
  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ cliente, produto, valor });

    setCliente("");
    setProduto("");
    setValor(1);
  };

  return (
    <div className="max-w-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="produto"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do Produto
          </label>
          <input
            id="produto"
            type="text"
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="valor"
            className="block text-sm font-medium text-gray-700"
          >
            Valor
          </label>
          <input
            id="valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            min={1}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="Cliente"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do Cliente
          </label>
          <input
            id="Cliente"
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            Criar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}
