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
  Dropdown,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { useState } from "react";
import { ethers } from "ethers";
import { getConfigByChain } from "../../assets/config";
import { getCollectionData, saveData } from "../../utils/fbutils";
const navItem = [];
export const SalesRep = () => {
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);
  const [selectedProduct, setselectedProduct] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [vendorDataArray, setVendorDataArray] = useState([]);
  const [materialDataArray, setMaterialDataArray] = useState([]);
  const fetchCollectionData = async () => {
    const data2 = await getCollectionData("MaterialData");
    setMaterialDataArray(data2);
    const data1 = await getCollectionData("VendorProductData");
    setVendorProductDataArray(data1);
    const data3 = await getCollectionData("Vendor");
    setVendorDataArray(data3);
    const data4 = await getCollectionData("SalesOrder");
    setSalesOrderDataArray(data4);
  };
  const [vendorProductDataArray, setVendorProductDataArray] = useState([]);
  const [salesOrderDataArray, setSalesOrderDataArray] = useState([]);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    verifyRole();
    fetchCollectionData();
  }, []);

  const verifyRole = async () => {
    console.log("verifyRole");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const network = await provider.getNetwork();
    const signer = provider.getSigner();

    const suppContract = new ethers.Contract(
      getConfigByChain(network.chainId)[0].suppChainAddress,
      SuppChain.abi,
      signer
    );
    console.log("suppContract", suppContract);
    const tx = await suppContract.getRole();
    console.log("tx", tx);
    setRole(tx);
    console.log("role", role);
  };
  const checkout = async () => {
    console.log("checkOut");
  };
  const [selectedOption, setSelectedOption] = useState("");

  const handleChangeDropDown = (event) => {
    console.log("event.target.value", event.target.value);
    setSelectedOption(event.target.value);
    console.log("selectedOption", selectedOption);
  };
  const handleShow2 = (item) => {
    // setselectedProduct(item);
    // console.log("selectedProduct", selectedProduct);
    return () => {
      console.log("item", item);
      setselectedProduct(item);
      console.log("item", selectedProduct);
      handleShow();
    };
  };
  const handleChange = (name, value) => {
    console.log("name", name);
    console.log("value", value);
    setQuantity(value);
  };
  const handleSave = async () => {
    console.log("handleSave");
    const data = {
      quantity: quantity,
      productCode: selectedProduct.productCode,
      productName: selectedProduct.productName,
      productSKUBatchNumber: selectedProduct.productSKUBatchNumber,
      productUnitPrice: selectedProduct.productUnitPrice,
      productMaterialLinkage: selectedProduct.productMaterialLinkage,
    };
    console.log("data", data);
    await saveData(data, "SalesOrder");
    handleClose();
  };
  if (role === "Sales Representative") {
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
          <Container>
          <h1>Welcome Sales Representative</h1>
            <Row>
              <Card>
                <Card.Body>
                  <Col>
                    <Tabs
                      defaultActiveKey="home"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="home" title="Create Sales Order">
                        <h1>Product List</h1>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Sr No.</th>
                              <th>Product Name</th>
                              <th>product Code</th>
                              <th>product SKU/Batch Number</th>
                              <th>product Unit Price</th>
                              <th>product Material Linkage</th>
                              <th>Checkout</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vendorProductDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.productName}</td>
                                  <td>{item.productCode}</td>
                                  <td>{item.productSKUBatchNumber}</td>
                                  <td>{item.productUnitPrice}</td>
                                  <td>{item.productMaterialLinkage}</td>
                                  <td>
                                    <button onClick={handleShow2(item)}>
                                      Add Fields
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                        <Modal
                          className="mt-5"
                          show={show}
                          onHide={handleClose}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Add quantity</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form>
                              <Form.Group className="mb-3" controlId="quantity">
                                <Form.Label>quantity</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => {
                                    handleChange(e.target.name, e.target.value);
                                  }}
                                  name="quantity"
                                  placeholder=""
                                />
                              </Form.Group>
                            </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Tab>
                      <Tab eventKey="profile" title="View Sales Order">
                        {
                          // <h1>Sales Order List</h1>
                        }
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Sr No.</th>
                              <th>Product Name</th>
                              <th>product Code</th>
                              <th>product SKU/Batch Number</th>
                              <th>product Unit Price</th>
                              <th>product Material Linkage</th>
                              <th>quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {salesOrderDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.productName}</td>
                                  <td>{item.productCode}</td>
                                  <td>{item.productSKUBatchNumber}</td>
                                  <td>{item.productUnitPrice}</td>
                                  <td>{item.productMaterialLinkage}</td>
                                  <td>{item.quantity}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
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
  } else {
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
    );
  }
};
