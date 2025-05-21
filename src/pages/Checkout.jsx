import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Get product details from location state
    if (location.state?.product) {
      setProduct(location.state.product);
      setTotalPrice(location.state.product.price * quantity);
    } else {
      toast.error("No product selected");
      navigate("/products");
    }
  }, [location.state, navigate, quantity]);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    setTotalPrice(product.price * newQuantity);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage or your auth context
      const currentUser = JSON.parse(localStorage.getItem("user"));
      
      if (!currentUser) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      // Redirect to success page with all required parameters
      const successUrl = `/success?userId=${currentUser._id}&productId=${product._id}&quantity=${quantity}&totalPrice=${totalPrice}`;
      navigate(successUrl);
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h3>Checkout</h3>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-md-6">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p className="text-muted">Price: ${product.price}</p>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </Form.Group>

                  <div className="mt-3">
                    <h5>Total: ${totalPrice.toFixed(2)}</h5>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-100 mt-3"
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}