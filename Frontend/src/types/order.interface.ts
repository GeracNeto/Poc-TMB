export interface IOrder {
  id: string;
  cliente: string;
  produto: string;
  valor: number;
  status: string;
  dataCriacao: Date;
}
