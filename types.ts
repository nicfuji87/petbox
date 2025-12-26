export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  size: 'Pequeno' | 'Médio' | 'Grande';
  gender: 'Macho' | 'Fêmea';
  weight: string;
  age: string;
  ownerName: string;
  allergies: string[];
  imageUrl: string;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  customerName: string;
  petName: string;
  species: 'dog' | 'cat';
  petImage: string;
  plan: 'Assinatura' | 'Avulso';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'late';
  date: string;
  boxMonth: string;
  total: number;
}
