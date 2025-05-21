import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Success() {
  const [params] = useSearchParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const productId = params.get("productId");
    const userId = params.get("userId");
    const quantity = params.get("quantity");
    const totalPrice = params.get("totalPrice");

    if (!productId || !userId || !quantity || !totalPrice) {
      toast.error("Missing purchase details.");
      return;
    }

    const savePurchase = async () => {
      try {
        const res = await axios.post(
          "https://ecom-server-2.onrender.com/purchase/save-purchase",
          // "http://localhost:8000/purchase/save-purchase",
          {
            productId,
            userId,
            quantity: parseInt(quantity),
            totalPrice: parseFloat(totalPrice),
          }
        );

        if (res.data.status) {
          setProduct(res.data.product);
          toast.success("Purchase saved successfully!");
        } else {
          toast.error("Failed to save purchase.");
        }
      } catch (err) {
        console.error("Error saving purchase:", err);
        toast.error("Error occurred while saving purchase.");
      }
    };

    savePurchase();
  }, [params]);

  return (
    <div className="text-center mt-5">
      <h2 className="text-success">Payment Successful!</h2>
      <h1>Thank you for purchasing</h1>
      {product ? (
        <div>
          <h4>Product: {product.name}</h4>
          <p>{product.description}</p>
          <h5>Price: ${product.price}</h5>
        </div>
      ) : (
        <p>Loading product info...</p>
      )}
      <Button
        variant="primary"
        onClick={() => navigate("/products", { replace: true })}
      >
        Back to Products
      </Button>
    </div>
  );
}
