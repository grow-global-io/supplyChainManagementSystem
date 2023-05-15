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
import {formatBigNumber} from "../../utils/fbutils"
import toast, { Toaster } from 'react-hot-toast'
import * as loadingImage from "../../assets/loading.json";
import Lottie from "react-lottie";

const loadingLoader = {
  loop: true,
  autoplay: true,
  animationData: loadingImage,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};


const navItem = [];
export const SalesRep = () => {
  const [masterProductDataArray, setmasterProductDataArray] = useState([]);
  const [masterMaterialDataArray, setmasterMaterialDataArray] = useState([]);
  const [vendorDataArray, setVendorDataArray] = useState([]);
  // blockChainMasterData start
  const [masterTableData, setMasterTableData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [loaderSize, setLoaderSize] = useState(220);
  //  blockChainMasterData end
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
    getOrderDetails();
    fetchCollectionData();
  }, [save]);
  useEffect(() => {
    console.log("masterTableData", masterTableData);
  }, [masterTableData]);

  const getOrderDetails = async () => {
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
    const mTableData = await suppContract.getAllOrderDetails()
    setMasterTableData(mTableData);

    const b = mTableData[0][3]
    console.log("test", (Number(b) / Math.pow(10, 18))*10 ** 18)
    
    setRole(tx);
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
    orderProductTotalPrice: 100,
    orderProductStatus: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const updateTotalPrice = () => {
    console.log("updateTotalPrice");
    setTotalPrice(
      orderData.orderProductQuantity *
      masterProductDataArray.find(
        (product) => product.productName === orderData.orderProductName
      )?.productUnitPrice
    );
  };
  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
    console.log(orderData);
  };
  const handleOrderDataChange = (name, value) => {
    setOrderData({
      ...orderData,
      [name]: value,
    });
    console.log("orderData", orderData);
  };
  const handleOrderDataBlockChainSubmit = async (orderData) => {
    try {
      setLoading(true)
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
      const network = await provider.getNetwork();
      const signer = provider.getSigner();

      const suppContract = new ethers.Contract(
        getConfigByChain(network.chainId)[0].suppChainAddress,
        SuppChain.abi,
        signer
      );

      const orderQty = parseInt(orderData.orderProductQuantity);
      const orderPrice = parseInt(orderData.orderProductTotalPrice);
      const tx = await suppContract.createOrder(
        orderData.orderProductName,
        orderQty,
        orderPrice,
        orderData.orderProductStatus
      );
      var soId;
      suppContract.on("GetSoID", (_soId) => {
        toast.success(`So ID generated was ${JSON.stringify(_soId)}`)
        
      })
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(() => {
          toast.success(`Role assigned successfully !!`)
          getOrderDetails()
          setLoading(false)
        })
      
    } catch (e) {
      console.log(e);
    }
  };

  const orderDataSubmit = async (e) => {
    e.preventDefault();
    handleCreateOrderModalClose();
    console.log("orderData", orderData);
    handleOrderDataBlockChainSubmit(orderData);
  };

  useEffect(() => {
    if (masterProductDataArray) {
      const filteredArray = masterProductDataArray.filter((each) => {
        return each.productName === orderData.orderProductName;
      });
      const value = filteredArray[0]?.productUnitPrice;
      const multiple =
        parseInt(orderData.orderProductQuantity) * parseInt(value);
      console.log(multiple);
      if (multiple)
        setOrderData({
          ...orderData,
          orderProductTotalPrice: multiple,
        });
      else {
        setOrderData({
          ...orderData,
          orderProductTotalPrice: 0,
        });
      }
    }
  }, [orderData.orderProductQuantity]);
  
  
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <Toaster position='top-center' reverseOrder='false' />
        {loading === true ? (
          <Lottie
            options={loadingLoader}
            height={loaderSize}
            width={loaderSize}
          />
        ):(
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
                            value={orderData.orderProductName}
                            onChange={handleChange}
                            aria-label="Default select example"
                            name="orderProductName"
                          >
                            <option >Select Product</option>
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
                            onChange={handleChange}
                            value={orderData.orderProductQuantity}
                            type="number"
                            placeholder=""
                            name="orderProductQuantity"
                            disabled={orderData.orderProductName === ""}
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
                            name="orderProductTotalPrice"
                            value={orderData.orderProductTotalPrice}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="orderProductStatus"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Select
                            onChange={handleChange}
                            name="orderProductStatus"
                            value={orderData.orderProductStatus}
                          >
                            <option>Select order status</option>
                            <option value={getStatus(1)[0].name}>
                              {getStatus(1)[0].name}
                            </option>
                            <option value={getStatus(2)[0].name}>
                              {getStatus(2)[0].name}
                            </option>
                            <option value={getStatus(3)[0].name}>
                              {getStatus(3)[0].name}
                            </option>
                            <option value={getStatus(4)[0].name}>
                              {getStatus(4)[0].name}
                            </option>
                            <option value={getStatus(5)[0].name}>
                              {getStatus(5)[0].name}
                            </option>
                            <option value={getStatus(6)[0].name}>
                              {getStatus(6)[0].name}
                            </option>
                            <option value={getStatus(7)[0].name}>
                              {getStatus(7)[0].name}
                            </option>
                            <option value={getStatus(8)[0].name}>
                              {getStatus(8)[0].name}
                            </option>
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
                        <Button variant="primary" onClick={orderDataSubmit}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    {
                      // display master product data
                    }
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>SoID</th>
                          <th>PoID</th>
                          <th>prodName</th>
                          <th>qty</th>
                          <th>orderValue</th>
                          <th>status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {masterTableData.map((order) => (
                          <tr>
                            <td>{order[0]}</td>
                            <td>{order[1]}</td>
                            <td>{order[2]}</td>
                            <td>{formatBigNumber(order[3])}</td>
                            <td>{formatBigNumber(order[4])}</td>
                            <td>{(order[6])}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Card.Body>
              </Card>
            </Row>
          </Container>
        </div >
        )}
        
      </Navbar>
    )}