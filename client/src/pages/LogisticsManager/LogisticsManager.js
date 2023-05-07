import React, { useEffect } from "react";
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
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { useState } from "react";
import { ethers } from "ethers";
import { getConfigByChain } from "../../assets/config";
const navItem = [
];
export const LogisticsManager = () => {
  const [show, setShow] = useState(false);
  const [role, setRole] = useState("");
  const handleClose = () => setShow(false);
  useEffect(()=>{
    verifyRole()
  },[])

  const verifyRole = async () => {
    console.log("verifyRole");
    await (window).ethereum.request({ method: "eth_requestAccounts", });
      const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
      const network = await provider.getNetwork()
      const signer = provider.getSigner()
      
      const suppContract = new ethers.Contract(
        getConfigByChain(network.chainId)[0].suppChainAddress,
        SuppChain.abi,
        signer
      )
      console.log("suppContract", suppContract);
      const tx = await suppContract.getRole();
      console.log("tx", tx);
      setRole(tx);
      console.log("role", role);
  }
  const handleShow = () => setShow(true);
  if(role === "Sales Representative"){
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
          <Container>
          {
            // <Button onClick={verifyRole} variant="primary">verifyRole</Button>{" "}
          }
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
    )
  }
  else{
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <h1>You don't have permission</h1>
                </Card.Body>
              </Card>
            </Row>
          </Container>
        </div>
      </Navbar>
    )
  }
}
