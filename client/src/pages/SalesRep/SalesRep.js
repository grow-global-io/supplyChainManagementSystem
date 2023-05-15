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
import { getStatus } from "../../assets/statusConfig";
const navItem = [];
export const SalesRep = () => {
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
  // Sales Representative Specific Code
  const [createOrderModal, setCreateOrderModal] = useState(false);
  const handleCreateOrderModalClose = () => setCreateOrderModal(false);
  const handleCreateOrderModalShow = () => setCreateOrderModal(true);
  const createOrder = async () => {
    console.log("createOrder");
    handleCreateOrderModalShow();
  };
  const [orderData, setOrderData] = useState({
    orderProductName: "",
    orderProductQuantity: 0,
    orderProductTotalPrice: 0,
    orderProductStatus: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const updateTotalPrice = () => {
    console.log("updateTotalPrice");
    setTotalPrice(orderData.orderProductQuantity * masterProductDataArray.find(
      (product) =>
        product.productName ===
        orderData.orderProductName
    )?.productUnitPrice
    )
  }
  const handleOrderDataChange = (name, value) => {
    setOrderData({
      ...orderData,
      [name]: value,
    });
    console.log("orderData", orderData);
  };
  const handleOrderQuantityChange = (e) => {
    setOrderData({
      ...orderData,
      orderProductQuantity: e.target.value,
    });
    updateTotalPrice();
  }
  const orderDataSubmit = async (e) => {
    e.preventDefault();
    handleCreateOrderModalClose();
    console.log(totalPrice);
    console.log("orderData", orderData);
    // await saveData(orderData, "orderData");
    // fetchCollectionData();
    setOrderData({
      orderProductName: "",
      orderProductQuantity: 0,
      orderProductTotalPrice: 0,
      orderProductStatus: "",
    });
  }
  if (true) {
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
          <h1 style={{ color: "blue", fontSize: "32px", fontWeight: "normal" }}>
            Welcome Sales Representative
          </h1>
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <Col>
                    <Button onClick={createOrder} variant="primary">
                      Create Order
                    </Button>{" "}
                    <Modal
                      className="mt-5"
                      show={createOrderModal}
                      onHide={handleCreateOrderModalClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Add Order Details</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Group
                          className="mb-3"
                          controlId="orderProductName"
                        >
                          <Form.Label>Product Name</Form.Label>
                          <Form.Select
                            onChange={(e) => {
                              handleOrderDataChange(
                                "orderProductName",
                                e.target.value
                              );
                            }}
                            aria-label="Default select example"
                          >
                            <option>Select Product</option>
                            {masterProductDataArray.map((product) => {
                              return (
                                <option value={product.productName}>
                                  {product.productName}
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="orderProductQuantity"
                        >
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            onChange={(e) => {
                              handleOrderQuantityChange(
                                "orderProductQuantity",
                                e.target.value
                              );
                            }}
                            type="number"
                            placeholder=""
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="orderProductPrice"
                        >
                          <Form.Label>Total Price</Form.Label>
                          <Form.Control
                            type="number"
                            disabled
                            placeholder=""
                            value={
                              orderData.orderProductQuantity *
                              masterProductDataArray.find(
                                (product) =>
                                  product.productName ===
                                  orderData.orderProductName
                              )?.productUnitPrice
                            }
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="orderProductStatus"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Select onChange={
                            (e) => {
                              handleOrderDataChange(
                                "orderProductStatus",
                                e.target.value
                              );
                            }
                          } aria-label="Default select example">
                            <option>Select order status</option>
                            <option value={getStatus(1)[0].name}>{getStatus(1)[0].name}</option>
                            <option value={getStatus(2)[0].name}>{getStatus(2)[0].name}</option>
                            <option value={getStatus(3)[0].name}>{getStatus(3)[0].name}</option>
                            <option value={getStatus(4)[0].name}>{getStatus(4)[0].name}</option>
                            <option value={getStatus(5)[0].name}>{getStatus(5)[0].name}</option>
                            <option value={getStatus(6)[0].name}>{getStatus(6)[0].name}</option>
                            <option value={getStatus(7)[0].name}>{getStatus(7)[0].name}</option>
                            <option value={getStatus(8)[0].name}>{getStatus(8)[0].name}</option>
                          </Form.Select>
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handleCreateOrderModalClose}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={orderDataSubmit}
                        >
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>
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
