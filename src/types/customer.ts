export interface Product {
  id: string;
  name: string;
  model: string;
  warrantyNumber: string;
  purchaseDate: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  products: Product[];
  dealerId: string;
  dealerName: string;
}