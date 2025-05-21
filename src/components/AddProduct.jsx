import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddProductModal = ({ show, handleClose }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    inStock: "in-stock",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setImageFile(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("inStock", form.inStock);
    if (imageFile) formData.append("image", imageFile);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/products/upload",
        formData
      );
      if (res.data.status === true) {
        handleClose();
        toast.success("Products Uploaded");
        setLoading(false);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={2}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Select name="stock" onChange={handleChange}>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image Upload</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Product"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
