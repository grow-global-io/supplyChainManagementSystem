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
import {
  getCollectionData,
  getCollectionDataWithId,
  saveData,
  updateCollectionData,
} from "../../utils/fbutils";
const navItem = [];
export const WarehouseManager = () => {
  const [role, setRole] = useState("");
  const [shelfLife, setShelfLife] = useState(0);
  const [barCode, setBarCode] = useState(0);
  const [batchNumber, setBatchNumber] = useState(0);
  const [show, setShow] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [id, setId] = useState("");
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
    const data4 = await getCollectionDataWithId("PurchaseOrder");
    console.log("data4", data4);
    setPurchaseOrderDataArray(data4);
    // const data5 = await getCollectionDataWithId("PurchaseOrder");
    // console.log("data5", data5);
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
  const handleShow2 = (item, id) => {
    // setSelectedMaterial(item);
    console.log("currentItem", item);
    console.log("id", id);
    // console.log("selectedMaterial", selectedMaterial);
    return () => {
      setId(id);
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
  };
  const handleSave = async () => {
    console.log("handleSave");
    const data = {
      materialName: selectedMaterial.materialName,
      materialCode: selectedMaterial.materialCode,
      // materialSKUBatchNumber: selectedMaterial.materialSKUBatchNumber,
      materialSKUBatchNumber: batchNumber,
      materialUnitPrice: selectedMaterial.materialUnitPrice,
      materialVendorResponsible: selectedMaterial.materialVendorResponsible,
      // materialShelfLife: selectedMaterial.materialShelfLife,
      materialShelfLife: shelfLife,
      // materialBarCode: selectedMaterial.materialBarCode,
      materialBarCode: barCode,
      quantity: selectedMaterial.quantity,
      vendorName: selectedMaterial.vendorName,
      receiveDate: receiveDate,
    };
    console.log("data", data);
    console.log("id", id);
    await updateCollectionData("PurchaseOrder", id, data);
    // await saveData(data, "PurchaseOrder");
    handleClose();
    fetchCollectionData();
  };
  if (role === "Sales Representative") {
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
        <h1>Welcome Warehouse Manager</h1>
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <Col>
                    <Modal className="mt-5" show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Edit Receive Date</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Form.Group className="mb-3" controlId="shelfLife">
                            <Form.Label>shelf life</Form.Label>
                            <Form.Control
                              type="text"
                              value={shelfLife}
                              onChange={(e) => {
                                setShelfLife(e.target.value);
                                console.log("shelfLife", shelfLife);
                              }}
                              name="shelfLife"
                              placeholder=""
                            />
                            <Form.Label>bar code</Form.Label>
                            <Form.Control
                              type="text"
                              value={barCode}
                              onChange={(e) => {
                                setBarCode(e.target.value);
                                console.log("barCode", barCode);
                              }}
                              name="barCode"
                              placeholder=""
                            />
                            <Form.Label>batch number</Form.Label>
                            <Form.Control
                              type="text"
                              value={batchNumber}
                              onChange={(e) => {
                                setBatchNumber(e.target.value);
                                console.log("batchNumber", batchNumber);
                              }}
                              name="batchNumber"
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
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Sr No.</th>
                          <th>material Name</th>
                          <th>material Code</th>
                          <th>materialSKUBatchNumber</th>
                          <th>bar code</th>
                          <th>shelf life</th>
                          <th>material Unit Price</th>
                          <th>materialVendorResponsible</th>
                          <th>vendor</th>
                          <th>quantity</th>
                          <th>receive Date</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseOrderDataArray.map((item, index) => {
                          {
                            console.log("item", item);
                          }
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item.materialName}</td>
                              <td>{item.materialCode}</td>
                              <td>{item.materialSKUBatchNumber}</td>
                              <td>{item.materialBarCode}</td>
                              <td>{item.materialShelfLife}</td>
                              <td>{item.materialUnitPrice}</td>
                              <td>{item.materialVendorResponsible}</td>
                              <td>{item.vendorName}</td>
                              <td>{item.quantity}</td>
                              <td>{item.receiveDate}</td>
                              <td>
                                <button onClick={handleShow2(item, item.id)}>
                                  click
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
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
