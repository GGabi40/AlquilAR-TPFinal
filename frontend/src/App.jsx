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
import NotFound from "./components/error/notFound/NotFound.jsx";
import PropertyView from "./components/propertyView/PropertyView";
import ForgotPassword from "./components/auth/forgotPassword/ForgotPassword";
import ResetPassword from "./components/auth/resetPassword/ResetPassword";
import Profile from "./components/profile/Profile";
import Protected from "./ProtectedRoute";

import { ScrollToTop } from "./hooks/useScrollToTop.js";
import Unauthorized from "./components/error/unauthorized/Unauthorized.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
          <Route path="/properties" element={<PropertyCards />} />{" "}
          {/* Ruta de search */}
          <Route path="/property/:id" element={<PropertyView />} />
          {/* Owner */}
          <Route element={<Protected allowedRoles={["owner"]} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />{" "}
            {/* Falta id de usuario */}
            <Route path="/owner/property/:id" element={<PropertyDetail />} />
          </Route>
          <Route element={<Protected allowedRoles={["superadmin"]} />}>
            <Route path="/admin/dashboard" element={<SuperadminDashboard />} />
          </Route>
          {/* User */}
          <Route element={<Protected allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>
          <Route
            element={
              <Protected allowedRoles={["user", "owner", "superadmin"]} />
            }
          >
            <Route path="/user/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
