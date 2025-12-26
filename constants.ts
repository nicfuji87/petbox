import { Pet, Order } from './types';

// Using a high-quality placeholder that matches the aesthetic if the user didn't provide a URL in the code block context.
// In a real app, this would be an import or a fixed asset URL.
import logo from './assets/images/logo_petbox.png';
export const LOGO_URL = logo;

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Thor',
    species: 'dog',
    breed: 'Golden Retriever',
    size: 'Grande',
    gender: 'Macho',
    weight: '32kg',
    age: '4 anos',
    ownerName: 'Ana Silva',
    allergies: ['Frango', 'Corantes'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlOTyF4p12YZYo1ZSD9Y0ty0akk_kCKoLsnAuc9uE7VCeowl6vP-9dDenaInpvC2kRfNaiHFqIlSeOJsV1hOQmUG8k8HwwAUwx4RC_Jb7z--WE4-8z9biKf4w259iOU5T2s9xjN-UtrCWX5KOCWCzhxH77-OXQ8JrzuGR36xKwPtDovKPje8GsQNKwBcNhq8nhGSUfw88w1aFfbgjmSId55PY38e09VqyCA2saEKaZGrMllYoq5wMJzZhgA1LpyFwOpzklWZZ0Xu86',
    status: 'active'
  },
  {
    id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamês',
    size: 'Pequeno',
    gender: 'Fêmea',
    weight: '4kg',
    age: '2 anos',
    ownerName: 'Carlos Souza',
    allergies: [],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ8T9FEp_SZ1QMR10BtaiW7vMvHw6CJK7giY8WJ24U2DsoaIRUMVMSgC5jUeQrmT3nlx4IjRLz9-8je-_dY0so0iTekp700XN8q72gA_NoHJbprHKLHKQP5lvsnsKnETYmOuulqSSC_S4E7fRbYoBenbMFRmlHiWths542PfpUbWq2iGcSW6Lt68pITMkuaeyb2QxEjLBvJ9lBO7CS0RRWcORC5UHT2Ce2oFR3qC8crLiX5xL7Xf66LarppbGSWpaTH5bupxMkaDTa',
    status: 'active'
  },
  {
    id: '3',
    name: 'Pipoca',
    species: 'dog',
    breed: 'Poodle',
    size: 'Médio',
    gender: 'Fêmea',
    weight: '8kg',
    age: '5 anos',
    ownerName: 'Maria Oliveira',
    allergies: ['Glúten'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc28whUIANYC20OnC2SLmWtrQasZsqoDop5pLuIQSv9lAF_y_iKLfhOghWmOxJUyKYCQVHvVsa9jwANpNGUHMiUCs1KdSHpEpyQ4xCacpKYpaYkkz14PofoF7rOpJcQh5AZMdMW684WacNdg4zjJLYifFf4vffdE1OOox0ZZqLPFCR6aFtwGUAZpmG4O9hZdnt-QkbtTpcKQdoOECqi_sPlkKewcrXRLsA0rWxxDAd-rzXdCFQ6bc7i0NgEnj1ktLMJSJkma8VSdO0',
    status: 'active'
  },
  {
    id: '4',
    name: 'Simba',
    species: 'cat',
    breed: 'SRD',
    size: 'Médio',
    gender: 'Macho',
    weight: '5kg',
    age: '1 ano',
    ownerName: 'Roberto Lima',
    allergies: ['Peixe'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCU-NLMNldtJj0iBhbrOiD4c11Lx3jHdbHOya55KG9f41x2ZUdQe46y35up2heWnyKCTwyepl4O10yYimizQ4zghcCAgYHFU0FtAI6xNA9LscyXcb8cTw4MhDqmLIQWsGbuTXE-nsbwm0I2MdXEqhz6F_piYQ0SAPkF-M0_8BAXqtWgdVQ-bBwDwehNzY7f6F8-qGw4kcBFJZrxw3yywkpUxite88jnRtpoOYqncxqmd9AR9UVYsI0CAttGgQadK6DE57lfcFsYHNy',
    status: 'inactive'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'PB-8291',
    customerName: 'Maria Silva',
    petName: 'Thor',
    species: 'dog',
    petImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd62Obyfh_7gEc8SpcPHcO_iWJAnizscuW-fOv0A-zbKbZQbpLYJxtS_RkDfkeKrFj7P7D5xTEei_lovue_D_zssEQ109IWXbiODBLjKmxFUGlLmLqJsNuHLgALN51HlrUzf2VGeGhc0_FfxldvymomeS8bFUhRYxDWounFNwjoZZxwCyWc5KDCuUfG408lRfUQyhRnVr2tGX-FFrv5ird2GbSSokN_Rob21Y9wdNesyEp4TSgV2AFDTCvsii12KlEtQru47zzsALp',
    plan: 'Assinatura',
    status: 'processing',
    date: 'Hoje, 10:30',
    boxMonth: 'Outubro/23',
    total: 89.90
  },
  {
    id: 'PB-8288',
    customerName: 'João Souza',
    petName: 'Luna',
    species: 'cat',
    petImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNb-arnEMfgHx4ISMmcuEl9GwlrGwoKgp0_SZpjsOT8K6PnMfVRCvOsbuORm_6LOfDnV0B_ZVI8E2jX4iWp_YIVjixHLKDL2rwt-LQKTmkIE2AOVVloX7Xh6AzAs0AqmVQ7Ddjm0jjVOPCvyn0vB5SUQAwlYEyr1ehTjsGTw6PhmMjGQh59EA955e7x6lcFZwIRddIQp1DFWPSw1XZZJQTGldqBU0vx98N5gWgdeNSBaKDfs6QNF7PZh6ySjz6DrR3wqub8APPGGpw',
    plan: 'Avulso',
    status: 'pending',
    date: 'Ontem',
    boxMonth: 'Personalizada',
    total: 109.90
  },
  {
    id: 'PB-8100',
    customerName: 'Carla Dias',
    petName: 'Rex',
    species: 'dog',
    petImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvMnZUNoNuh-bRDiTIJuv3WHX4TdZvGAUpZT_Gj6eUdHkGwZA8RP5ZsB51dOfAYkQpLJ9Dogyn1Kzl_Sec8N04OiTz50tk2fdizYgjiaU4a8Eoz8Ck6Vp7yqhZoUIAQgqtAoKWZIfkOx3VdJB9wLoAuDG0Ieyq852OYONqH_asoMQqk0mnWyoMbJEFGNawfd_BfGFjL7KHLw1p1T1NOJFkLo5xQRaY0twQVfRmM4k1vVlPkCT2qYI2qGfAy9gSF1QBZgHyLWzVhELo',
    plan: 'Assinatura',
    status: 'late',
    date: '2 dias atrás',
    boxMonth: 'Setembro/23',
    total: 89.90
  }
];
