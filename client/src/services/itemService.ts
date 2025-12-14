import axios from "axios";

const API_URL = "http://localhost:5000/items";

// Định nghĩa kiểu Category rõ ràng
export type Category = "CAKE" | "BREAD" | "COOKIE" | "OTHER";

export type CakeSubType = "CHEESECAKE" | "BIRTHDAYCAKE" | "MOUSSE";

const itemService = {
  getAll: (): Promise<any> => axios.get(API_URL),
  create: (data: any): Promise<any> => axios.post(API_URL, data),
  update: (id: number, data: any): Promise<any> =>
    axios.put(`${API_URL}/${id}`, data),
  delete: (id: number): Promise<any> =>
    axios.delete(`${API_URL}/${id}`)
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


