import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes ,Navigate, Outlet} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import CustomerHome from "./modules/customers/pages/CustomerHome.tsx";



import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TaskDetail from "./modules/operator/pages/TaskDetail.tsx";
import TaskList from "./modules/operator/pages/TaskList.tsx";
import Dashboard from "./modules/operator/pages/Dashboard.tsx";
import { useAppStore } from "@/services/appStore.ts";
// ADMIN IMPORTS


import MainLayout from "./modules/admin/components/MainLayout";
import QuotationsPage from "./modules/admin/pages/QuotationsPage";
import EngineersPage from "./modules/admin/pages/EngineersPage";
import EnquiryDetailPage from "./modules/admin/pages/EnquiryDetailPage";
import EnquiriesPage from "./modules/admin/pages/EnquiriesPage";
import DashboardPage from "./modules/admin/pages/DashboardPage";
import CreateQuotationPage from "./modules/admin/pages/CreateQuotationsPage.tsx";
import GlobalLogin from "./pages/GlobalLogin.tsx";
import EngineerDetailPage from "./modules/admin/pages/EnginnerDetailPasge.tsx";
import CustomerDetails from "./modules/customers/components/CustomerDetails.tsx";
import { customers } from "./data/adminMockData.ts";
import QuotationDetails from "./modules/admin/pages/QuotationsDetailsPage.tsx";

const queryClient = new QueryClient();

const AdminProtected = () => {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const role = useAppStore((s) => s.role);

  if (!isLoggedIn || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <MainLayout />;
};

const OperatorProtected = () => {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const role = useAppStore((s) => s.role);

  if (!isLoggedIn || role !== "operator") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};


const App = () => {
    const isLoggedIn = useAppStore((s) => s.isLoggedIn);

    return (

  <QueryClientProvider client={queryClient}>
      {/* <AppProvider> */}
    <TooltipProvider>
      <Toaster />
      <Sonner />
     
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          

                  {/* CUSTOMER */}
        <Route path="/customer" element={<CustomerHome />} />
        
        
      

              {/* OPERATOR */}
      <Route path="/operator" element={<OperatorProtected />}>
  <Route path="dashboard/:engineerId" element={<Dashboard />} />
  <Route path="tasks" element={<TaskList />} />
  <Route path="tasks/:taskId" element={<TaskDetail />} />
</Route>
 
{/* Admin LOGIN */}
         <Route path="/admin">
  {/* Login */}
  <Route
    index
    element={
      isLoggedIn ? (
        <Navigate to="dashboard" replace />
      ) : (
        <GlobalLogin />
      )
    }
  />

  {/* Protected */}
  <Route element={<AdminProtected />}>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="enquiries" element={<EnquiriesPage />} />
    <Route path="enquiries/:id" element={<EnquiryDetailPage />} />
    <Route path="engineers" element={<EngineersPage />} />
     <Route path="engineers/:id" element={<EngineerDetailPage />} />
    <Route path="quotations" element={<QuotationsPage />} />
    <Route path="quotations/create" element={<CreateQuotationPage />} />
    <Route path="quotations/:id" element={<QuotationDetails />} />
  </Route>
</Route>
       
      
       
        
      <Route path="/globalLogin" element={<GlobalLogin />} />
      
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
    </TooltipProvider>
    {/* </AppProvider> */}
  </QueryClientProvider>
);
};

export default App;
