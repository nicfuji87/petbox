import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Personalization from './pages/Personalization';
import MontarBox from './pages/MontarBox';
import PaymentPage from './pages/PaymentPage';
import PetList from './pages/admin/PetList';
import OrderList from './pages/admin/OrderList';
import OrderDetails from './pages/admin/OrderDetails';
import PetProfile from './pages/admin/PetProfile';
import Dashboard from './pages/admin/Dashboard';
import CustomerList from './pages/admin/CustomerList';
import CustomerDetails from './pages/admin/CustomerDetails';
import ProductList from './pages/admin/ProductList';
import SiteSettings from './pages/admin/SiteSettings';
import PartnerList from './pages/admin/PartnerList';
import CouponList from './pages/admin/CouponList';
import NotificationSettings from './pages/admin/NotificationSettings';

import Financial from './pages/admin/Financial';
import Settings from './pages/admin/Settings';
import Login from './pages/Login';
import { BottomNav } from './components/BottomNav';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-text-dark-main">
      {children}
      {/* BottomNav only for non-admin routes (e.g. customer-facing pages) */}
      {!isAdmin && <BottomNav />}
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
          <Route path="/checkout" element={<PaymentPage />} />
          <Route path="/personalize" element={<Personalization />} />
          <Route path="/admin-login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/pets" element={<PetList />} />
          <Route path="/admin/pets/:id" element={<PetProfile />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/customers" element={<CustomerList />} />
          <Route path="/admin/customers/:id" element={<CustomerDetails />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/financial" element={<Financial />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/site-settings" element={<SiteSettings />} />
          <Route path="/admin/partners" element={<PartnerList />} />
          <Route path="/admin/coupons" element={<CouponList />} />
          <Route path="/admin/notifications" element={<NotificationSettings />} />
        </Routes>
      </LayoutWrapper>
    </HashRouter>
  );
};

export default App;