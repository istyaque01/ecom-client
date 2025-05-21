import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./protectedRoute/ProtectedRoute";
import { ToastContainer } from "react-toastify";

// Change this to a default export
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* User Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Payment */}
          <Route path="/payment-success" element={<Success />} />
          <Route path="/payment-cancel" element={<Cancel />} />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </>
  );
};

// Add this line at the end of the file
export default App;