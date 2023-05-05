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
  ["Receive Product", "/DeliveryHub/receive"],
  ["Ship Product", "/DeliveryHub/ship"],
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
                          <Form.Label className="text-left">Account number</Form.Label>
                          <Form.Control type="text" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>order</Form.Label>
                          <Form.Control type="text" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Start date</Form.Label>
                          <Form.Control type="date" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Address</Form.Label>
                          <Form.Control type="text" placeholder="" />
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
                            <th>#</th>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>PI1</td>
                            <td>test1</td>
                            <td>$10</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>PI1</td>
                            <td>test1</td>
                            <td>$10</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>PI1</td>
                            <td>test1</td>
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
                              <Form.Label>Product Id</Form.Label>
                              <Form.Control type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Product Name</Form.Label>
                              <Form.Control type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="exampleForm.ControlInput1"
                            >
                              <Form.Label>Product Price</Form.Label>
                              <Form.Control type="number" placeholder="" />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" onClick={handleClose}>
                            Save Changes
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
