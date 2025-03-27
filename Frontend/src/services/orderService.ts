import axios from "axios";
import { IOrder } from "../types/order.interface";

const API_URL = "http://localhost:5222/api/Order";

export const getOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await axios.get<IOrder[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos", error);
    return [];
  }
};

export const createOrder = async (
  newOrder: Partial<IOrder>
): Promise<IOrder | null> => {
  try {
    const response = await axios.post<IOrder>(API_URL, newOrder);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar pedido", error);
    return null;
  }
};
