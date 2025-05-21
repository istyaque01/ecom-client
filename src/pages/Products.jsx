import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaMinus } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RQo6fP9EmhkwZRMgjGWxu41w1GsDsxxwHKRwBrS0r9OGmCokDAh9MHIXWFHvqoSVnjy8iu5kuQE0OfJBI5N1P1800H9J9JIpX"
);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const increment = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const navigate = useNavigate();

  const handleEditClick = (product, index) => {
    setEditProduct({ ...product, index });
    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ecom-server-2.onrender.com/products/all"
      );
      // const response = await axios.get("http://localhost:8000/products/all");
      setProducts(response.data?.products);
      console.log(response.data?.products);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Something went wrong while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `https://ecom-server-2.onrender.com/products/update/${editProduct._id}`,
        // `http://localhost:8000/products/update/${editProduct._id}`,
        {
          name: editProduct.name,
          price: editProduct.price,
          description: editProduct.description,
          stock: editProduct.stock,
        }
      );
      if (res.data.status === true) {
        toast.success("Product updated successful");
        setShowEdit(false);
        getAllProducts();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await axios.delete(
        `https://ecom-server-2.onrender.com/products/delete/${selectedProductId}`
        // `http://localhost:8000/products/delete/${selectedProductId}`
      );
      if (res.data.status === true) {
        toast.success("Product deleted");
        getAllProducts();
      }
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    } finally {
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleBuyNow = async (productId) => {
    const stripe = await stripePromise;

    const quantity = quantities[productId] || 1;
    const userId = localStorage.getItem("userId");
    const product = products.find((p) => p._id === productId);

    try {
      const response = await axios.post(
        "https://ecom-server-2.onrender.com/payment/create-checkout-session",
        // "http://localhost:8000/payment/create-checkout-session",
        {
          productId,
          quantity,
          userId,
          totalPrice: product.price * quantity,
        }
      );

      const { id: sessionId } = response.data;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error(error);
        toast.error("Payment redirection failed");
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Payment initiation failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const role = localStorage.getItem("role");
  return (
    <>
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>All Products</h2>
          <div className="d-flex gap-2">
            {role === "admin" && (
              <Button
                variant="outline-primary"
                onClick={() => navigate("/admin")}
              >
                Back to Dashboard
              </Button>
            )}
            <Button variant="outline-primary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Row>
          {products?.map((prod, i) => (
            <Col md={4} key={i} className="mb-4">
              <Card>
                {prod?.image && (
                  <Card.Img
                    variant="top"
                    src={prod?.image}
                    height={200}
                    style={{ objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{prod?.name}</Card.Title>
                  <Card.Text>{prod?.description}</Card.Text>
                  <h5>${prod?.price}</h5>
                  <p
                    className={
                      prod?.stock === "in-stock"
                        ? "text-success"
                        : "text-danger"
                    }
                  ></p>

                  <Button
                    variant="primary"
                    className="w-100 mb-2"
                    onClick={() => handleBuyNow(prod._id)}
                  >
                    Buy Now{" "}
                  </Button>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="light"
                        onClick={() => decrement(prod._id)}
                      >
                        <FaMinus />
                      </Button>
                      <span>{quantities[prod._id] || 1}</span>
                      <Button
                        variant="light"
                        onClick={() => increment(prod._id)}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEditClick(prod, i)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(prod._id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>

          {editProduct && (
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={handleEditChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleEditChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Select
                    name="stock"
                    value={editProduct.stock}
                    onChange={handleEditChange}
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
          )}

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
