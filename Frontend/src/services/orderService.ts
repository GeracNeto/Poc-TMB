import axios from "axios";
import { IOrder } from "../types/order.interface";

const API_URL = "http://localhost:5000/api/Order";

export const getOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await axios.get<IOrder[]>(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(`Falha ao buscar pedidos: ${error}`);
  }
};

export const createOrder = async (
  newOrder: Partial<IOrder>
): Promise<IOrder | null> => {
  try {
    const response = await axios.post<IOrder>(API_URL, newOrder);
    return response.data;
  } catch (error) {
    throw new Error(`Falha ao criar pedido: ${error}`);
  }
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${orderId}`);
  } catch (error) {
    throw new Error(`Erro ao deletar pedido: ${error}`);
  }
};
