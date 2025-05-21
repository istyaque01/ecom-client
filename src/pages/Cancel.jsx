// src/pages/Cancel.js
import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();
  return (
    <div className="text-center mt-5">
      <h2 className="text-danger">Payment Cancelled</h2>
      <p>Your payment was not completed.</p>
      <Button variant="warning" onClick={() => navigate("/products")}>
        Back to Products
      </Button>
    </div>
  );
}
