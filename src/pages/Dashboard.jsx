import { useState } from "react";
import { Container, Button, Row, Col, Image, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AddProductModal from "../components/AddProduct";

const Dashboard = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <Container className="my-5">
      <Navbar className="justify-content-between mb-4">
        <h3>Welcome To Admin Dashboard</h3>
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-primary"
            onClick={() => navigate("/products")}
          >
            Go to Products
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Navbar>

      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Product
          </Button>
        </Col>
      </Row>

      <AddProductModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />
    </Container>
  );
};

export default Dashboard;
