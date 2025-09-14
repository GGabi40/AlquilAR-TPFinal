import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import Login from "./login/Login";
import MainLayout from "./ui/MainLayout";
import Home from "./home/Home.jsx";
import PropertyForm from "./propertyForm/PropertyForm";
import PropertyFeatures from "./propertyForm/PropertyFeatures";
import PropertyImages from "./propertyForm/PropertyImages";
import Register from "./register/Register";
import OwnerDashboard from "./dashboards/ownerDashboard/OwnerDashboard.jsx";
import PropertyDetail from "./propertyDetail/PropertyDetail.jsx";
import UserDashboard from "./dashboards/userDashboard/UserDashboard.jsx";
import SuperadminDashboard from "./dashboards/superadminDashboard/SuperadminDashboard.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import TermsAndCondicions from "./pages/TermsAndCondicions.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import FAQ from "./pages/FAQ.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import PublishSteps from "./publish/PublishSteps.jsx";
import PropertyCards from "./propertyCards/PropertyCards.jsx";
import NotFound from "./error/NotFound.jsx";
import PropertyView from "./propertyView/PropertyView.jsx"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<Register />} />
          <Route path="/add-property" element={<PublishSteps />} />

          <Route path="/add-property/location" element={<PropertyForm />} />
          <Route path="/add-property/features" element={<PropertyFeatures />} />
          <Route path="/add-property/images" element={<PropertyImages />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/terms-condicions" element={<TermsAndCondicions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/properties" element={<PropertyCards />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/property/:id" element={<PropertyView />} />

          {/* Owner */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/property/:id" element={<PropertyDetail />} />

          <Route path="/admin/dashboard" element={<SuperadminDashboard />} />

          {/* User */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          {/* Agg path para /property/:id -> inquilino ingresa a detalles */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
