import React, { useState } from "react";
import { IOrder } from "../types/order.interface";

interface OrderFormProps {
  formLoader: boolean;
  errorMessage: string;
  onSubmit: (order: Partial<IOrder>) => void;
  onClearError: () => void;
}

export default function OrderForm({
  formLoader,
  errorMessage,
  onSubmit,
  onClearError,
}: OrderFormProps) {
  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    const valorNumerico = valor ? parseFloat(valor) : undefined;
    onSubmit({ cliente, produto, valor: valorNumerico });
    setCliente("");
    setProduto("");
    setValor("");
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setValor(value);
    onClearError();
  };

  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente(e.target.value);
    onClearError();
  };

  const handleProdutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduto(e.target.value);
    onClearError();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
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
          onChange={handleProdutoChange}
          required
          className="mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
          placeholder="Digite o nome do produto"
        />
      </div>

      <div>
        <label
          htmlFor="valor"
          className="block text-sm font-medium text-gray-700"
        >
          Valor (R$)
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">R$</span>
          </div>
          <input
            id="valor"
            type="text"
            value={valor}
            onChange={handleValorChange}
            min="0"
            step="0.01"
            required
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="cliente"
          className="block text-sm font-medium text-gray-700"
        >
          Nome do Cliente
        </label>
        <input
          id="cliente"
          type="text"
          value={cliente}
          onChange={handleClienteChange}
          required
          className="mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
          placeholder="Digite o nome do cliente"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          {formLoader ? (
            <>
              <svg
                className="mr-3 size-5 animate-spin"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Criando...
            </>
          ) : (
            "Criar Pedido"
          )}
        </button>
      </div>
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}
    </form>
  );
}
