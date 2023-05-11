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
  Dropdown
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { useState } from "react";
import { ethers } from "ethers";
import { getConfigByChain } from "../../assets/config";
import { getCollectionData, saveData } from "../../utils/fbutils";
const navItem = [];
export const ProductionManager = () => {
  const [show, setShow] = useState(false);
  const [vendorProductDataArray, setVendorProductDataArray] = useState([]);
  const [materialDataArray, setMaterialDataArray] = useState([]);
  const [vendorDataArray, setVendorDataArray] = useState([]);
  const [role, setRole] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [save,setSave]=useState(false);
  
  const [selectedOption, setSelectedOption] = useState('');

  const handleChangeDropDown = (event) => {
    console.log("event.target.value", event.target.value);
    setSelectedOption(event.target.value);
    console.log("selectedOption", selectedOption);
  };

  const [vendorProductModal, setVendorProductModal] = useState(false);
  const handleVendorProductModalClose = () => setVendorProductModal(false);
  const handleVendorProductModalShow = () => setVendorProductModal(true);

  const [materialModal, setMaterialModal] = useState(false);
  const handleMaterialModalClose = () => setMaterialModal(false);
  const handleMaterialModalShow = () => setMaterialModal(true);

  const [vendorModal, setVendorModal] = useState(false);
  const handleVendorModalClose = () => setVendorModal(false);
  const handleVendorModalShow = () => setVendorModal(true);

  
  const fetchCollectionData = async () => {
    const data1 = await getCollectionData("VendorProductData");
    setVendorProductDataArray(data1);
    const data2 = await getCollectionData("MaterialData");
    setMaterialDataArray(data2);
    const data3 = await getCollectionData("Vendor");
    setVendorDataArray(data3);
    console.log('data1',data1);
    console.log('data2',data2);
    console.log('data3',data3);
    console.log("vendorProductDataArray", vendorProductDataArray);
    console.log("materialDataArray", materialDataArray);
    console.log("vendorDataArray", vendorDataArray);
  }
  useEffect(() => {
    verifyRole();
    fetchCollectionData();
  }, [save]);
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
 
  // 
  const [vendorProductData, setVendorProductData] = useState(
    {
      productName: "",
      productCode: "",
      productSKUBatchNumber: 0,
      productUnitPrice: 0,
      productMaterialLinkage: "",
      status:""
    }
  );
  const handleVendorProductChange = (name, value) => {
    setVendorProductData({
      ...vendorProductData,
      [name]: value,
    });
  }
  const vendorProductSubmit = async (e) => {
    e.preventDefault();
    handleVendorProductModalClose();
    console.log("vendorDataSubmit");
    vendorProductData.status = selectedOption;
    console.log("vendorProductData", vendorProductData);
    // save vendorProduct  data to firestore
    await saveData(vendorProductData,"VendorProductData");
    setSave(!save);
    setVendorData(
      {
        productName: "",
        productCode: "",
        productSKUBatchNumber: 0,
        productUnitPrice: 0,
        productMaterialLinkage: "",
        status:""
      }
    );
  }
  // 
  const [materialData, setMaterialData] = useState(
    {
      materialName: "",
      materialCode: "",
      materialSKUBatchNumber: "",
      materialUnitPrice: "",
      materialShelfLife:"",
      materialBarCode:"",
      materialVendorResponsible:"",
    }
  )
  const handleMaterialDataChange = (name, value) => {
    setMaterialData({
      ...materialData,
      [name]: value,
    });
  }
  const MaterialDataSubmit = async (e) => {
    e.preventDefault();
    handleMaterialModalClose();
    console.log("MaterialDataSubmit");
    console.log("materialData", materialData);
    await saveData(materialData,"MaterialData");
    setMaterialData(
      {
        materialName: "",
        materialCode: "",
        materialSKUBatchNumber: "",
        materialUnitPrice: "",
        materialShelfLife:"",
        materialBarCode:"",
        materialVendorResponsible:"",
      }
    );
  }
  // 
  const [vendorData, setVendorData] = useState(
    {
      vendorName:"",
      vendorEmail:"",
      vendorPhone:"",
      vendorAddress:"",
    }
  )
  const handleVendorDataChange = (name, value) => {
    setVendorData({
      ...vendorData,
      [name]: value,
    });
  }
  const VendorDataSubmit = async (e) => {
    e.preventDefault();
    handleVendorModalClose();
    console.log("VendorDataSubmit");
    console.log("vendorData", vendorData);
    await saveData(vendorData,"Vendor");
    setVendorData(
      {
        vendorName:"",
        vendorEmail:"",
        vendorPhone:"",
        vendorAddress:"",
      }
    );
  }
  if (role === "Sales Representative") {
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
                <Button onClick={fetchCollectionData} variant="primary">getCollectionData</Button>{" "}
                  <Col>
                    <Tabs
                      defaultActiveKey="createOrder"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="createOrder" title="Create Order">
                        <Button onClick={handleVendorProductModalShow} variant="primary">Create Vendor Product</Button>{" "}
                        <Button onClick={handleMaterialModalShow} variant="primary">Create Material</Button>{" "}
                        <Button onClick={handleVendorModalShow} variant="primary">Add Vendor</Button>{" "}
                        
                        <Modal className="mt-5" show={vendorProductModal} onHide={handleVendorProductModalClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>Add Vendor Product</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form onSubmit={vendorProductSubmit}>
                            <Form.Group className="mb-3" controlId="productName">
                              <Form.Label>Product Name</Form.Label>
                              <Form.Control name="productName" value={
                                vendorProductData.productName
                              } onChange={
                                (e) => {
                                  handleVendorProductChange(e.target.name, e.target.value)
                                }
                              } type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="productCode">
                              <Form.Label>Product Code</Form.Label>
                              <Form.Control name="productCode" value={
                                vendorProductData.productCode
                              } onChange={
                                (e) => {
                                  handleVendorProductChange(e.target.name, e.target.value)
                                }
                              } type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="productSKUBatchNumber">
                              <Form.Label>SKU/Batch Number</Form.Label>
                              <Form.Control name="productSKUBatchNumber" value={
                                vendorProductData.productSKUBatchNumber
                              } onChange={
                                (e) => {
                                  handleVendorProductChange(e.target.name, e.target.value)
                                }
                              } type="number" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="productUnitPrice">
                              <Form.Label>Unit Price</Form.Label>
                              <Form.Control name="productUnitPrice" value={
                                vendorProductData.productUnitPrice
                              } onChange={
                                (e) => {
                                  handleVendorProductChange(e.target.name, e.target.value)
                                }
                              } type="number" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="productMaterialLinkage">
                              <Form.Label>Material Linkage</Form.Label>
                              <Form.Control name="productMaterialLinkage" value={
                                vendorProductData.productMaterialLinkage
                              } onChange={
                                (e) => {
                                  handleVendorProductChange(e.target.name, e.target.value)
                                }
                              } type="text" placeholder="" />
                            </Form.Group>
                            <Form.Select value={selectedOption} onChange={handleChangeDropDown} aria-label="Default select example">
                              <option value="">Status</option>
                              <option value="pending">pending</option>
                              <option value="accepted">accepted</option>
                              <option value="option3">option3</option>
                            </Form.Select>
                          </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleVendorProductModalClose}>
                              Close
                            </Button>
                            <Button variant="primary" onClick={vendorProductSubmit}>
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Modal>

                        <Modal className="mt-5" show={materialModal} onHide={handleMaterialModalClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>Add Material</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form onSubmit={MaterialDataSubmit}> 
                            <Form.Group className="mb-3" controlId="materialName">
                              <Form.Label>Material Name</Form.Label>
                              <Form.Control name="materialName" value={
                                materialData.materialName
                              } onChange={
                                (e) => {
                                  handleMaterialDataChange(e.target.name, e.target.value)
                                }
                              }  type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="materialCode">
                              <Form.Label>Material Code</Form.Label>
                              <Form.Control value={
                                materialData.materialCode
                              } onChange={
                                (e) => {
                                  handleMaterialDataChange(e.target.name, e.target.value)
                                }
                              } name="materialCode" type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="materialSKUBatchNumber">
                              <Form.Label>SKU/Batch Number</Form.Label>
                              <Form.Control value={
                                materialData.materialSKUBatchNumber
                              } onChange={
                                (e) => {
                                  handleMaterialDataChange(e.target.name, e.target.value)
                                }
                              } name="materialSKUBatchNumber" type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="materialShelfLife">
                              <Form.Label>Shelf Life</Form.Label>
                              <Form.Control value={
                                materialData.materialShelfLife
                              } onChange={
                                (e) => {
                                  handleMaterialDataChange(e.target.name, e.target.value)
                                }
                              } name="materialShelfLife" type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="materialBarCode">
                              <Form.Label>Bar Code</Form.Label>
                              <Form.Control value={
                                materialData.materialBarCode
                              } onChange={
                                (e) => {
                                  handleMaterialDataChange(e.target.name, e.target.value)
                                }
                              } name="materialBarCode" type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="materialUnitPrice">
                              <Form.Label>Unit Price</Form.Label>
                              <Form.Control value={
                                materialData.materialUnitPrice
                              } onChange={
                                (e) => {
                                  handleMaterialDataChange(e.target.name, e.target.value)
                                }
                              } name="materialUnitPrice" type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="materialVendorResponsible">
                              <Form.Label>Vendors Responsible</Form.Label>
                              <Form.Control value={
                                materialData.materialVendorResponsible
                              } onChange={
                                (e) => {
                                  handleMaterialDataChange(e.target.name, e.target.value)
                                }
                              } name="materialVendorResponsible" type="text" placeholder="" />
                            </Form.Group>
                          </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleMaterialModalClose}>
                              Close
                            </Button>
                            <Button variant="primary" onClick={MaterialDataSubmit}>
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Modal>

                        <Modal className="mt-5" show={vendorModal} onHide={handleVendorModalClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>Add Vendor</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form>
                            <Form.Group className="mb-3" controlId="vendorName">
                              <Form.Label>Name</Form.Label>
                              <Form.Control name="vendorName" value={
                                vendorData.vendorName
                              } onChange={
                                (e) => {
                                  handleVendorDataChange(e.target.name, e.target.value)
                                }
                              } type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="vendorEmail">
                              <Form.Label>Email</Form.Label>
                              <Form.Control value={
                                vendorData.vendorEmail
                              } onChange={
                                (e) => {
                                  handleVendorDataChange(e.target.name, e.target.value)
                                }
                              } name="vendorEmail" type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="vendorPhone">
                              <Form.Label>Ph</Form.Label>
                              <Form.Control value={
                                vendorData.vendorPhone
                              } onChange={
                                (e) => {
                                  handleVendorDataChange(e.target.name, e.target.value)
                                }
                              } name="vendorPhone" type="text" placeholder="" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="vendorAddress">
                              <Form.Label>Address</Form.Label>
                              <Form.Control value={
                                vendorData.vendorAddress
                              } onChange={
                                (e) => {
                                  handleVendorDataChange(e.target.name, e.target.value)
                                }
                              } name="vendorAddress" type="text" placeholder="" />
                            </Form.Group>
                          </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleVendorModalClose}>
                              Close
                            </Button>
                            <Button variant="primary" onClick={VendorDataSubmit}>
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </Tab>
                      <Tab eventKey="productList" title="View List">
                        <h1>Vendor Product Data</h1>
                        <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Sr No.</th>
                            <th>Product Name</th>
                            <th>product Code</th>
                            <th>product SKU/Batch Number</th>
                            <th>product Unit Price</th>
                            <th>product Material Linkage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            vendorProductDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.productName}</td>
                                  <td>{item.productCode}</td>
                                  <td>{item.productSKUBatchNumber}</td>
                                  <td>{item.productUnitPrice}</td>
                                  <td>{item.productMaterialLinkage}</td>
                                </tr>
                              )
                            })
                          } 
                        </tbody>
                      </Table>
                      <h1>Material Data</h1>
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
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            materialDataArray.map((item, index) => {
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
                                </tr>
                              )
                            })
                          } 
                        </tbody>
                      </Table>
                      <h1>Vendor Data</h1>
                        <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Sr No.</th>
                            <th>Vendor Name</th>
                            <th>Vendor Email</th>
                            <th>Vendor Phone</th>
                            <th>Vendor Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            vendorDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.vendorName}</td>
                                  <td>{item.vendorEmail}</td>
                                  <td>{item.vendorPhone}</td>
                                  <td>{item.vendorAddress}</td>
                                </tr>
                              )
                            })
                          } 
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
