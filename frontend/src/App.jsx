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
import PropertyDetail from "./PropertyDetail/PropertyDetail.jsx";
import UserDashboard from "./dashboards/userDashboard/UserDashboard.jsx";
import SuperadminDashboard from "./dashboards/superadminDashboard/SuperadminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<Register />} />
          <Route path="/add-property/location" element={<PropertyForm />} />
          <Route path="/add-property/features" element={<PropertyFeatures />} />
          <Route path="/add-property/images" element={<PropertyImages />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/superadmin" element={<SuperadminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
