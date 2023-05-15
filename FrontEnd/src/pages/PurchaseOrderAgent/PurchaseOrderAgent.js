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
export default function PurchaseOrderAgent() {
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [vendorDataArray, setVendorDataArray] = useState([]);
  const [materialDataArray, setMaterialDataArray] = useState([]);
  const [purchaseOrderDataArray, setPurchaseOrderDataArray] = useState([]);
  const [receiveDate, setReceiveDate] = useState("");
  const fetchCollectionData = async () => {
    const data2 = await getCollectionData("MaterialData");
    setMaterialDataArray(data2);
    const data1 = await getCollectionData("VendorProductData");
    setVendorProductDataArray(data1);
    const data3 = await getCollectionData("Vendor");
    setVendorDataArray(data3);
    const data4 = await getCollectionData("PurchaseOrder");
    setPurchaseOrderDataArray(data4);
  };
  const [vendorProductDataArray, setVendorProductDataArray] = useState([]);
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
    // setSelectedMaterial(item);
    // console.log("selectedMaterial", selectedMaterial);
    return () => {
      setSelectedMaterial(item);
      console.log("item", selectedMaterial);
      handleShow();
    };
  };
  const handleChange = (name, value) => {
    console.log("name", name);
    console.log("value", value);
    setQuantity(value);
  };
  const handleReceiveDateChange = (event) => {
    console.log("event.target.value", event.target.value);
    setReceiveDate(event.target.value);
    console.log("receiveDate", receiveDate);
  }
  const handleSave = async () => {
    console.log("handleSave");
    const data = {
      materialName: selectedMaterial.materialName,
      materialCode: selectedMaterial.materialCode,
      materialSKUBatchNumber: selectedMaterial.materialSKUBatchNumber,
      materialUnitPrice: selectedMaterial.materialUnitPrice,
      materialVendorResponsible: selectedMaterial.materialVendorResponsible,
      materialShelfLife: selectedMaterial.materialShelfLife,
      materialBarCode: selectedMaterial.materialBarCode,
      quantity: quantity,
      vendorName: selectedOption,
      receiveDate: receiveDate,
    };
    console.log("data", data);
    await saveData(data, "PurchaseOrder");
    handleClose();
  };
  if (role === "Sales Representative") {
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
        <h1>Welcome purchase Order Agent</h1>
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <Col>
                    <Tabs
                      defaultActiveKey="home"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="home" title="create purchase order">
                        {
                          // <h1>Material Data</h1>
                        }
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Sr No.</th>
                              <th>Material Name</th>
                              <th>Material Code</th>
                              <th>Material SKU/Batch Number</th>
                              <th>Material Unit Price</th>
                              <th>Material Vendor Responsible</th>
                              <th>Material Shelf Life</th>
                              <th>Material Bar Code</th>
                              <th>Checkout</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materialDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.materialName}</td>
                                  <td>{item.materialCode}</td>
                                  <td>{item.materialSKUBatchNumber}</td>
                                  <td>{item.materialUnitPrice}</td>
                                  <td>{item.materialVendorResponsible}</td>
                                  <td>{item.materialShelfLife}</td>
                                  <td>{item.materialBarCode}</td>
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
                            <Modal.Title>Add Data</Modal.Title>
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
                              <Form.Select
                                value={selectedOption}
                                onChange={handleChangeDropDown}
                                aria-label="Default select example"
                              >
                                <option>Open this select menu</option>
                                {vendorDataArray.map((item, index) => {
                                  return (
                                    <option value={item.vendorName}>
                                      {item.vendorName}
                                    </option>
                                  );
                                })}
                              </Form.Select>
                              <Form.Group className="mb-3" controlId="receiveDate">
                                <Form.Label>Receive Date</Form.Label>
                                <Form.Control
                                  type="date"
                                  value={receiveDate}
                                  onChange={(e) => {
                                    handleReceiveDateChange(e);
                                  }}
                                  name="receiveDate"
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
                      <Tab eventKey="profile" title="view purchase order">
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Sr No.</th>
                              <th>material Name</th>
                              <th>material Code</th>
                              <th>materialSKUBatchNumber</th>
                              <th>material Unit Price</th>
                              <th>materialVendorResponsible</th>
                              <th>vendor</th>
                              <th>quantity</th>
                              <th>receive Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchaseOrderDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.materialName}</td>
                                  <td>{item.materialCode}</td>
                                  <td>{item.materialSKUBatchNumber}</td>
                                  <td>{item.materialUnitPrice}</td>
                                  <td>{item.materialVendorResponsible}</td>
                                  <td>{item.vendorName}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.receiveDate}</td>
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
}
