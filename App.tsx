import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Personalization from './pages/Personalization';
import MontarBox from './pages/MontarBox';
import PetList from './pages/admin/PetList';
import OrderList from './pages/admin/OrderList';
import OrderDetails from './pages/admin/OrderDetails';
import PetProfile from './pages/admin/PetProfile';
import { BottomNav } from './components/BottomNav';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-dark-main">
      {children}
      {isAdmin && !location.pathname.includes('/order/') && !location.pathname.includes('/pet/') && <BottomNav />}
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
          <Route path="/admin/pets" element={<PetList />} />
          <Route path="/admin/pets/:id" element={<PetProfile />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/settings" element={<div className="p-8 text-center">Configurações (Demo)</div>} />
        </Routes>
      </LayoutWrapper>
    </HashRouter>
  );
};

export default App;