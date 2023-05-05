import React from "react";
import Navbar from "../../components/Navbar";
import {
  Container,
  Row,
  Col,
  Button,
  Tab,
  Tabs,
  Table,
  Modal,
  Card,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useState } from "react";
const navItem = [
];
export const SalesRep = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
      <div>
        <Container>
          <Row>
            <Card>
              <Card.Body>
                <Col>
                  <Tabs
                    defaultActiveKey="createOrder"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="createOrder" title="Create Order">
                      <Form>
                        <Form.Group
                          className="mb-3 "
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label className="text-left">
                            Order Number
                          </Form.Label>
                          <Form.Control type="text" placeholder="SO" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Customer Address</Form.Label>
                          <Form.Control type="text" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Control type="text" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Customer Email</Form.Label>
                          <Form.Control type="email" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Order Start Date</Form.Label>
                          <Form.Control type="date" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Customer Delivery Date</Form.Label>
                          <Form.Control type="date" placeholder="" />
                        </Form.Group>
                        <Button variant="primary">Submit</Button>{" "}
                      </Form>
                    </Tab>
                    <Tab eventKey="productList" title="Product List">
                      <div className="d-flex justify-content-end">
                        <Button
                          onClick={handleShow}
                          className="mb-3"
                          variant="primary"
                        >
                          Create product
                        </Button>{" "}
                      </div>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Product Code</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>SO1</td>
                            <td>test1</td>
                            <td>1</td>
                            <td>$10</td>
                          </tr>
                          <tr>
                            <td>SO2</td>
                            <td>test2</td>
                            <td>1</td>
                            <td>$10</td>
                          </tr>
                          <tr>
                            <td>SO2</td>
                            <td>test2</td>
                            <td>1</td>
                            <td>$10</td>
                          </tr>
                        </tbody>
                      </Table>
                      <Modal className="mt-5" show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Create Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Product Code</Form.Label>
                              <Form.Control type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Product</Form.Label>
                              <Form.Control type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Quantity</Form.Label>
                              <Form.Control type="number" placeholder="" />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Unit Price</Form.Label>
                              <Form.Control type="number" placeholder="" />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleClose}>
                            Save Product
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Tab>
                  </Tabs>
                </Col>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    </Navbar>
  );
};
