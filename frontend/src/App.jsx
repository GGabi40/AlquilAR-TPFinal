import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import Login from "./login/Login";
import MainLayout from "./ui/MainLayout";
import Home from "./home/Home.jsx";
import PropertyForm from "./propertyForm/PropertyForm";
import PropertyFeatures from "./propertyForm/PropertyFeatures";
import Register from "./register/Register";
import OwnerDashboard from "./ownerDashboard/OwnerDashboard.jsx";
import PropertyDetail from "./PropertyDetail/PropertyDetail.jsx";
import UserDashboard from "./userDashboard/UserDashboard.jsx";
import SuperadminDashboard from "./superadminDashboard/SuperadminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<Register />} />
          <Route path="/add-property" element={<PropertyForm />} />
          <Route path="/property-features" element={<PropertyFeatures />} />
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
