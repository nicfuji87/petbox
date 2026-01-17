import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Personalization from './pages/Personalization';
import MontarBox from './pages/MontarBox';
import PetList from './pages/admin/PetList';
import OrderList from './pages/admin/OrderList';
import OrderDetails from './pages/admin/OrderDetails';
import PetProfile from './pages/admin/PetProfile';
import Dashboard from './pages/admin/Dashboard';
import CustomerList from './pages/admin/CustomerList';
import Financial from './pages/admin/Financial';
import Login from './pages/Login';
import { BottomNav } from './components/BottomNav';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isDashboard = location.pathname === '/admin';
  const isOrderList = location.pathname === '/admin/orders';
  const isPetList = location.pathname === '/admin/pets';
  const isCustomerList = location.pathname === '/admin/customers';
  const isFinancial = location.pathname === '/admin/financial';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-dark-main">
      {children}
      {isAdmin && !isDashboard && !isOrderList && !isPetList && !isCustomerList && !isFinancial && !location.pathname.includes('/order/') && !location.pathname.includes('/pet/') && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/montar-box" element={<MontarBox />} />
          <Route path="/personalize" element={<Personalization />} />
          <Route path="/admin-login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/pets" element={<PetList />} />
          <Route path="/admin/pets/:id" element={<PetProfile />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/customers" element={<CustomerList />} />
          <Route path="/admin/financial" element={<Financial />} />
          <Route path="/admin/settings" element={<div className="p-8 text-center">Configurações (Demo)</div>} />
        </Routes>
      </LayoutWrapper>
    </HashRouter>
  );
};

export default App;