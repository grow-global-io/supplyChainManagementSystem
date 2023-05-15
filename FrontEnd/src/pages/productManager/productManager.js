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
import Select from "react-select";
import Form from "react-bootstrap/Form";
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { useState } from "react";
import { ethers } from "ethers";
import { getConfigByChain } from "../../assets/config";
import { getCollectionData, saveData } from "../../utils/fbutils";
const navItem = [];
export const ProductManager = () => {
  const [masterProductDataArray, setmasterProductDataArray] = useState([]);
  const [masterMaterialDataArray, setmasterMaterialDataArray] = useState([]);
  const [vendorDataArray, setVendorDataArray] = useState([]);
  const [role, setRole] = useState("");
  const [save, setSave] = useState(false);

  const [masterProductModal, setmasterProductModal] = useState(false);
  const handlemasterProductModalClose = () => setmasterProductModal(false);
  const handlemasterProductModalShow = () => setmasterProductModal(true);

  const [materialModal, setMaterialModal] = useState(false);
  const handleMaterialModalClose = () => setMaterialModal(false);
  const handleMaterialModalShow = () => setMaterialModal(true);

  const [vendorModal, setVendorModal] = useState(false);
  const handleVendorModalClose = () => setVendorModal(false);
  const handleVendorModalShow = () => setVendorModal(true);

  const fetchCollectionData = async () => {
    setmasterProductDataArray(await getCollectionData("masterProductData"));
    setmasterMaterialDataArray(await getCollectionData("masterMaterialData"));
    setVendorDataArray(await getCollectionData("masterVendorData"));
  };
  const [vendorList, setVendorList] = useState([]);
  useEffect(() => {
    setVendorList(
      vendorDataArray.map((vendor) => {
        return { value: vendor.vendorName, label: vendor.vendorName };
      })
    );
  }, [vendorDataArray]);
  const [materialList, setMaterialList] = useState([]);
  useEffect(() => {
    setMaterialList(
      masterMaterialDataArray.map((material) => {
        return { value: material.materialName, label: material.materialName };
      })
    );
  }, [masterMaterialDataArray]);
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
  const [masterProductData, setmasterProductData] = useState({
    productName: "",
    productCode: "",
    productSKUBatchNumber: 0,
    productUnitPrice: 0,
    productMaterialLinkage: [],
  });
  const handleVendorProductChange = (name, value) => {
    setmasterProductData({
      ...masterProductData,
      [name]: value,
    });
  };
  const vendorProductSubmit = async (e) => {
    e.preventDefault();
    handlemasterProductModalClose();
    masterProductData.productMaterialLinkage = selectedMaterials;
    await saveData(masterProductData, "masterProductData");
    fetchCollectionData();
    setmasterProductData({
      productName: "",
      productCode: "",
      productSKUBatchNumber: 0,
      productUnitPrice: 0,
      productMaterialLinkage: [],
    });
  };
  const [masterMaterialData, setmasterMaterialData] = useState({
    materialName: "",
    materialCode: "",
    materialUnitPrice: "",
    materialVendorResponsible: [],
  });
  const handlemasterMaterialDataChange = (name, value) => {
    setmasterMaterialData({
      ...masterMaterialData,
      [name]: value,
    });
  };
  const masterMaterialDataSubmit = async (e) => {
    e.preventDefault();
    handleMaterialModalClose();
    masterMaterialData.materialVendorResponsible = selectedVendors;
    await saveData(masterMaterialData, "masterMaterialData");
    fetchCollectionData();
    setmasterMaterialData({
      materialName: "",
      materialCode: "",
      materialUnitPrice: "",
      materialVendorResponsible: [],
    });
  };
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    vendorEmail: "",
    vendorPhone: "",
    vendorAddress: "",
  });
  const handleVendorDataChange = (name, value) => {
    setVendorData({
      ...vendorData,
      [name]: value,
    });
  };
  const [selectedVendors, setSelectedVendors] = useState([]);
  const handleMultipleVendorChange = (e) => {
    setSelectedVendors(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const handleMultipleMaterialChange = (e) => {
    setSelectedMaterials(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const VendorDataSubmit = async (e) => {
    e.preventDefault();
    handleVendorModalClose();
    await saveData(vendorData, "masterVendorData");
    fetchCollectionData();
    setVendorData({
      vendorName: "",
      vendorEmail: "",
      vendorPhone: "",
      vendorAddress: "",
    });
  };

  if (true) {
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
          <h1 style={{ color: "blue", fontSize: "32px", fontWeight: "normal" }}>
            Welcome Product Manager
          </h1>
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <Col>
                    <Modal
                      className="mt-5"
                      show={masterProductModal}
                      onHide={handlemasterProductModalClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Add Product</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={vendorProductSubmit}>
                          <Form.Group className="mb-3" controlId="productName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                              name="productName"
                              value={masterProductData.productName}
                              onChange={(e) => {
                                handleVendorProductChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="productCode">
                            <Form.Label>Product Code</Form.Label>
                            <Form.Control
                              name="productCode"
                              value={masterProductData.productCode}
                              onChange={(e) => {
                                handleVendorProductChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="productSKUBatchNumber"
                          >
                            <Form.Label>SKU/Batch Number</Form.Label>
                            <Form.Control
                              name="productSKUBatchNumber"
                              value={masterProductData.productSKUBatchNumber}
                              onChange={(e) => {
                                handleVendorProductChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              type="number"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="productUnitPrice"
                          >
                            <Form.Label>Unit Price</Form.Label>
                            <Form.Control
                              name="productUnitPrice"
                              value={masterProductData.productUnitPrice}
                              onChange={(e) => {
                                handleVendorProductChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              type="number"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="productMaterialLinkage"
                          >
                            <Form.Label>Material Linkage</Form.Label>
                            <Select
                              onChange={(e) => {
                                handleMultipleMaterialChange(e);
                              }}
                              isMulti
                              options={materialList}
                            />
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handlemasterProductModalClose}
                        >
                          Close
                        </Button>
                        <Button variant="primary" onClick={vendorProductSubmit}>
                          Save Product
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Modal
                      className="mt-5"
                      show={materialModal}
                      onHide={handleMaterialModalClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Add Material</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={masterMaterialDataSubmit}>
                          <Form.Group className="mb-3" controlId="materialName">
                            <Form.Label>Material Name</Form.Label>
                            <Form.Control
                              name="materialName"
                              value={masterMaterialData.materialName}
                              onChange={(e) => {
                                handlemasterMaterialDataChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="materialCode">
                            <Form.Label>Material Code</Form.Label>
                            <Form.Control
                              value={masterMaterialData.materialCode}
                              onChange={(e) => {
                                handlemasterMaterialDataChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              name="materialCode"
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="materialUnitPrice"
                          >
                            <Form.Label>Unit Price</Form.Label>
                            <Form.Control
                              value={masterMaterialData.materialUnitPrice}
                              onChange={(e) => {
                                handlemasterMaterialDataChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              name="materialUnitPrice"
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="materialVendorResponsible"
                          >
                            <Form.Label>Vendors Responsible</Form.Label>
                            <Select
                              onChange={(e) => {
                                handleMultipleVendorChange(e);
                              }}
                              isMulti
                              options={vendorList}
                            />
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handleMaterialModalClose}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={masterMaterialDataSubmit}
                        >
                          Add Material
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Modal
                      className="mt-5"
                      show={vendorModal}
                      onHide={handleVendorModalClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Add Vendor</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Form.Group className="mb-3" controlId="vendorName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              name="vendorName"
                              value={vendorData.vendorName}
                              onChange={(e) => {
                                handleVendorDataChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="vendorEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              value={vendorData.vendorEmail}
                              onChange={(e) => {
                                handleVendorDataChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              name="vendorEmail"
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="vendorPhone">
                            <Form.Label>Ph</Form.Label>
                            <Form.Control
                              value={vendorData.vendorPhone}
                              onChange={(e) => {
                                handleVendorDataChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              name="vendorPhone"
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                          <Form.Group
                            className="mb-3"
                            controlId="vendorAddress"
                          >
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                              value={vendorData.vendorAddress}
                              onChange={(e) => {
                                handleVendorDataChange(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              name="vendorAddress"
                              type="text"
                              placeholder=""
                            />
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handleVendorModalClose}
                        >
                          Close
                        </Button>
                        <Button variant="primary" onClick={VendorDataSubmit}>
                          Add Vendor
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Tabs
                      defaultActiveKey="productList"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="productList" title="Product">
                        <div className="d-flex justify-content-end my-2">
                          <Button
                            onClick={handlemasterProductModalShow}
                            variant="primary"
                          >
                            Create Product
                          </Button>{" "}
                        </div>
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
                            {masterProductDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.productName}</td>
                                  <td>{item.productCode}</td>
                                  <td>{item.productSKUBatchNumber}</td>
                                  <td>{item.productUnitPrice}</td>
                                  <td>
                                    {item.productMaterialLinkage.map((item) => {
                                      return <p>{item}</p>;
                                    })}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Tab>
                      <Tab eventKey="materialList" title="Material">
                        <div className="d-flex justify-content-end my-2">
                          <Button
                            onClick={handleMaterialModalShow}
                            variant="primary"
                          >
                            Create Material
                          </Button>{" "}
                        </div>

                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Sr No.</th>
                              <th>Material Name</th>
                              <th>Material Code</th>
                              <th>Material Unit Price</th>
                              <th>Material Vendor Responsible</th>
                            </tr>
                          </thead>
                          <tbody>
                            {masterMaterialDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.materialName}</td>
                                  <td>{item.materialCode}</td>
                                  <td>{item.materialUnitPrice}</td>
                                  <td>
                                    {item.materialVendorResponsible.map(
                                      (item) => {
                                        return <p>{item}</p>
                                      }
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Tab>
                      <Tab eventKey="vendorList" title="Vendors">
                        <div className="d-flex justify-content-end my-2">
                          <Button
                            onClick={handleVendorModalShow}
                            variant="primary"
                          >
                            Add Vendor
                          </Button>{" "}
                        </div>

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
                            {vendorDataArray.map((item, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.vendorName}</td>
                                  <td>{item.vendorEmail}</td>
                                  <td>{item.vendorPhone}</td>
                                  <td>{item.vendorAddress}</td>
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
