import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from '@/components/AppLayout';
import ManagerDashboard from '@/pages/manager/Dashboard';
import ManagerReservations from '@/pages/manager/Reservations';
import ManagerMembers from '@/pages/manager/Members';
import ManagerBilling from '@/pages/manager/Billing';
import MemberFeed from '@/pages/member/Feed';
import MemberDirectory from '@/pages/member/Directory';
import MemberReservations from '@/pages/member/Reservations';
import MemberProfile from '@/pages/member/Profile';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const [mode, setMode] = useState<'manager' | 'member'>(location.pathname.startsWith('/member') ? 'member' : 'manager');
  const navigate = useNavigate();

  const handleModeSwitch = () => {
    const newMode = mode === 'manager' ? 'member' : 'manager';
    setMode(newMode);
    navigate(newMode === 'manager' ? '/manager' : '/member/feed');
  };

  return (
    <AppLayout mode={mode} onModeSwitch={handleModeSwitch}>
      <Routes>
        <Route path="/" element={<Navigate to="/manager" replace />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/reservations" element={<ManagerReservations />} />
        <Route path="/manager/membres" element={<ManagerMembers />} />
        <Route path="/manager/facturation" element={<ManagerBilling />} />
        <Route path="/member/feed" element={<MemberFeed />} />
        <Route path="/member/annuaire" element={<MemberDirectory />} />
        <Route path="/member/reservations" element={<MemberReservations />} />
        <Route path="/member/profil" element={<MemberProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
