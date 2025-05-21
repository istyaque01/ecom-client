import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate()
  return (
    <div className="text-center mt-5">
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <Button variant="primary" onClick={()=>navigate("/")}>Back</Button>
    </div>
  );
};

export default Unauthorized;
