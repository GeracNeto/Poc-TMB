export interface IOrder {
  id?: number;
  cliente: string;
  produto: string;
  valor: number;
  status?: string;
  dataCriacao?: Date;
}
