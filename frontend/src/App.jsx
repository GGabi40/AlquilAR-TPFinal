import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import Login from "./components/auth/login/Login";
import MainLayout from "./components/ui/MainLayout";
import Home from "./components/home/Home";
import PropertyForm from "./components/propertyForm/PropertyForm";
import PropertyFeatures from "./components/propertyForm/PropertyFeatures";
import PropertyImages from "./components/propertyForm/PropertyImages";
import Register from "./components/auth/register/Register";
import OwnerDashboard from "./components/dashboards/ownerDashboard/OwnerDashboard";
import PropertyDetail from "./components/propertyDetail/PropertyDetail";
import UserDashboard from "./components/dashboards/userDashboard/UserDashboard";
import SuperadminDashboard from "./components/dashboards/superadminDashboard/SuperadminDashboard";
import AboutUs from "./components/pages/AboutUs";
import TermsAndCondicions from "./components/pages/TermsAndCondicions";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import FAQ from "./components/pages/FAQ";
import ContactUs from "./components/pages/ContactUs";
import PublishSteps from "./components/publish/PublishSteps";
import PropertyCards from "./components/propertyCards/PropertyCards";
import NotFound from "./components/error/NotFound";
import PropertyView from "./components/propertyView/PropertyView"
import ForgotPassword from "./components/auth/forgotPassword/ForgotPassword";
import ResetPassword from "./components/auth/resetPassword/ResetPassword";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/add-property" element={<PublishSteps />} />

          <Route path="/add-property/location" element={<PropertyForm />} />
          <Route path="/add-property/features" element={<PropertyFeatures />} />
          <Route path="/add-property/images" element={<PropertyImages />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/terms-conditions" element={<TermsAndCondicions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/properties" element={<PropertyCards />} /> {/* Ruta de search */}
          <Route path="/property/:id" element={<PropertyView />} />

          {/* Owner */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} /> {/* Falta id de usuario */}
          <Route path="/owner/property/:id" element={<PropertyDetail />} />

          <Route path="/admin/dashboard" element={<SuperadminDashboard />} />

          {/* User */}
          <Route path="/user/dashboard" element={<UserDashboard />} /> {/* Falta id de usuario */}
          {/* Agg "mi perfil" */}

          {/* Agg proteccion de rutas */}

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
