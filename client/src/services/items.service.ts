import API from "../api/axois.config";

export type Category = "CAKE" | "BREAD" | "COOKIE" | "OTHER";

export type CakeSubType = "CHEESECAKE" | "BIRTHDAYCAKE" | "MOUSSE";

const itemService = {
  getAll: (): Promise<any> => API.get("/items"),
  create: (data: any): Promise<any> => API.post("/items", data),
  update: (id: number, data: any): Promise<any> =>
    API.put(`/items/${id}`, data),
  delete: (id: number): Promise<any> =>
    API.delete(`/items/${id}`)
};

export default itemService;

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  category: Category;  
  cakeSubType?: CakeSubType;  
  quantity?:number;
  size?: number;
  flavor?: string;
  flourType?: string;
  weight?: number;
  manufacturingDate?: string;
  itemDetail?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}


