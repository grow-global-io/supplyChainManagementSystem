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
import { getCollectionData, saveData, saveInvoice, savePdf,getFileDownloadURL } from "../../utils/fbutils";
import { getStatus } from "../../assets/statusConfig";
import { formatBigNumber } from "../../utils/fbutils";
import toast, { Toaster } from "react-hot-toast";
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
  const [loading, setLoading] = useState(false);
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
  const [filteredMasterTableData, setFilteredMasterTableData] = useState([]);
  useEffect(() => {
    console.log('this is called');

    setFilteredMasterTableData([]);
    console.log("masterTableData", masterTableData);
    // setFilteredMasterTableData(masterTableData);
    setFilteredMasterTableData(masterTableData.filter(each=>each.status==="Paid" || each.status==="Completed" || each.status==="Order Received" ));

  }, [masterTableData]);
  const fetchBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const network = await provider.getNetwork();
    const signer = provider.getSigner();
    const suppContract = new ethers.Contract(
      getConfigByChain(network.chainId)[0].suppChainAddress,
      SuppChain.abi,
      signer
    );
    setMasterTableData(await suppContract.getAllOrderDetails());
  }
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
    const role = await suppContract.getRole();

    if(role!=="Sales Representative"){
      console.log("You are not a Sales Representative");
      toast.error("You are not a Sales Representative");
      return;
    }
    else{
      console.log("Welcome Sales Representative");
      // window.alert("Welcome Sales Representative");
      toast.success("Welcome Sales Representative");
    }
    const mTableData = await suppContract.getAllOrderDetails();
    setMasterTableData(mTableData);

    const b = mTableData[0][3];
    console.log("test", (Number(b) / Math.pow(10, 18)) * 10 ** 18);

    setRole(role);
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
      setLoading(true);
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
        toast.success(`So ID generated was ${JSON.stringify(_soId)}`);
      });
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(() => {
          toast.success(`Role assigned successfully !!`);
          getOrderDetails();
          setLoading(false);
        });
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
  const formatDate = (date) => {
    const tempDate = date.toString();
    if (tempDate.length < 8) {
      return "";
    }
    const year = tempDate.slice(0, 4);
    const month = tempDate.slice(4, 6);
    const day = tempDate.slice(6, 8);
    const finalDate = year + "-" + month + "-" + day;
    // console.log(finalDate);
    return finalDate;
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
  const [trackingDataModal, setTrackingDataModal] = useState(false);
  const handleTrackingDataModalClose = () => setTrackingDataModal(false);
  const handleTrackingDataModalShow = (item) => {
    setTrackingDataModal(true);
    console.log(item);
    setCurrentSoId(item[0]);
  };
  const [finalTrackingNumber, setFinalTrackingNumber] = useState("");
  const [customerFinalDeliveryDate, setCustomerFinalDeliveryDate] =
    useState("");
  const [currentSoId, setCurrentSoId] = useState("");
  // invoice pdf
  const [invoicePdf, setInvoicePdf] = useState("");
  const handleChangeMethod = (e) => {
    if (e.target.id === "trackingNumber") {
      setFinalTrackingNumber(e.target.value);
    } else if (e.target.id === "customerFinalDeliveryDate") {
      const finalReceiveDate = e.target.value;
      const finalReceiveDateWithoutDashes = finalReceiveDate.replace(/-/g, "");
      setCustomerFinalDeliveryDate(finalReceiveDateWithoutDashes);
    }
    else if(e.target.id === "invoicePdf"){
      // handle only pdf
      // show warning if not pdf
      if(e.target.files[0].type !== "application/pdf"){
        toast.error("Please upload a pdf file only");
        return;
      }
      console.log(e.target.files[0]);

      setInvoicePdf(e.target.files[0])
    }
    // console.log(e.target.value);
    // console.log(e.target.id);
  };
  const updateBlockDataOrderStatus = async (soId, col, val) => {
    setLoading(true)
    try {
      console.log("soId", soId);
      console.log("col", col);
      console.log("val", val);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
      const network = await provider.getNetwork();
      const signer = provider.getSigner();

      const suppContract = new ethers.Contract(
        getConfigByChain(network.chainId)[0].suppChainAddress,
        SuppChain.abi,
        signer
      );
      console.log(soId);
      const tx = await suppContract.update(soId, col, val);
      console.log("tx", tx);
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(() => {
          // toast.success(`Role assigned successfully !!`);
          getOrderDetails();
          setLoading(false);
        });
      // toast('Role Assignment in progress !!', { icon: '👏' })
    } catch (e) {
      // toast.error('An error occured. Check console !!')
      console.log(e);
      // setLoading(false)
    }
  };
  const handleFinalDataSubmit = async () => {
    console.log("handleFinalDataSubmit");
    // console.log(finalData);
    // const invoicePdfUrl = await savePdf(invoicePdf, "invoicePdf");
    console.log(finalTrackingNumber);
    console.log(customerFinalDeliveryDate);
    console.log(currentSoId);
    // customer final delivery date is present
    if (customerFinalDeliveryDate) {
      console.log("customerFinalDeliveryDate is present");
      await updateBlockDataOrderStatus(
        currentSoId,
        ["Customer Final Delivery Date", "Status", "Tracking No"],
        [customerFinalDeliveryDate, "Completed", finalTrackingNumber]
      );
    }
    // customer final delivery date is not present
    else {
      console.log("customerFinalDeliveryDate is not present");
      await updateBlockDataOrderStatus(
        currentSoId,
        ["Status", "Tracking No"],
        ["Completed", finalTrackingNumber]
      );
    }
    handleTrackingDataModalClose();
  };
  const viewInvoice = async (item) => {
    // const downloadUrl = await getFileDownloadURL("invoicePdf/exp 7 IOT.pdf")
    // console.log(downloadUrl);
    console.log("viewInvoice", item);
    // // open link in new tab
    window.open(
      `${item}`,
      "_blank"
    );
  };
  const [updateInvoiceModal, setUpdateInvoiceModal] = useState(false);
  const handleUpdateInvoiceModalClose = () => setUpdateInvoiceModal(false);
  const handleUpdateInvoiceModalShow = (item) => {
    console.log("handleUpdateInvoiceModalShow", item);
    setUpdateInvoiceModal(true);
    console.log(item);
    setCurrentSoId(item[0]);
  }
  const handleInvoiceUpdate = async () => {
    console.log("handleInvoiceUpdate");
    console.log(currentSoId);
    console.log(invoicePdf);
    const invoicePdfUrl = await savePdf(invoicePdf, "invoicePdf");
    console.log(invoicePdfUrl);
    await updateBlockDataOrderStatus(
      currentSoId,
      ["Invoice Path"],
      [invoicePdfUrl]
    );
    handleUpdateInvoiceModalClose();
  }
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
  useEffect(() => {
    verifyRole();
  }, []);
  if(role === "Sales Representative"){
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <Toaster position="top-center" reverseOrder="false" />
        {loading === true ? (
          <Lottie
            options={loadingLoader}
            height={loaderSize}
            width={loaderSize}
          />
        ) : (
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
                      <Modal
                        className="mt-5"
                        show={trackingDataModal}
                        onHide={handleTrackingDataModalClose}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Update Tracking Number</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group
                              className="mb-3"
                              controlId="trackingNumber"
                            >
                              <Form.Label>Tracking Number</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                onChange={handleChangeMethod}
                              />
                            </Form.Group>
                            <Form.Group
                              className="mb-3"
                              controlId="customerFinalDeliveryDate"
                            >
                              <Form.Label>Customer Delivery Date</Form.Label>
                              <Form.Control
                                type="date"
                                placeholder=""
                                onChange={handleChangeMethod}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={handleTrackingDataModalClose}
                          >
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleFinalDataSubmit}
                          >
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      <Modal
                        className="mt-5"
                        show={updateInvoiceModal}
                        onHide={handleUpdateInvoiceModalClose}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Update Invoice</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group
                              className="mb-3"
                              controlId="invoicePdf"
                            >
                              <Form.Label>Upload Invoice Pdf</Form.Label>
                              <Form.Control
                                type="file"
                                placeholder=""
                                onChange={handleChangeMethod}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={handleUpdateInvoiceModalClose}
                          >
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleInvoiceUpdate}
                          >
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                      {
                        // display master product data
                      }
                      <Table className="mt-2" striped bordered hover>
                        <thead>
                          <tr>
                            <th>Sr No.</th>
                            <th>SoID</th>
                            <th>PoID</th>
                            <th>prodName</th>
                            <th>qty</th>
                            <th>orderValue</th>
                            <th>status</th>
                            <th>customerFinalDeliveryDate</th>
                            <th>barCode</th>
                            <th>batchNo</th>
                            <th>masterLabel</th>
                            <th>View Invoice</th>
                            <th>trackingNo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMasterTableData.map((order, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>
                                {
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: "black",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() => {
                                      handleTrackingDataModalShow(order);
                                    }}
                                  >
                                    {order[0]}
                                  </button>
                                }
                              </td>
                              <td>{order[1]}</td>
                              <td>{order[2]}</td>
                              <td>{formatBigNumber(order[3])}</td>
                              <td>{formatBigNumber(order[4])}</td>
                              <td>{order[6]}</td>
                              <td>
                                {formatDate(
                                  formatBigNumber(order.customerFinalDeliveryDate)
                                )}
                              </td>
                              <td>{order[7]}</td>
                              <td>{order[8]}</td>
                              <td>{order[9]}</td>
                              <td>
                                {
                                  // display link only if invoice is generated
                                  order[10] !== "" ? (
                                    // <a href={order[10]} target="_blank">
                                    //   View Invoice
                                    // </a>
                                    <button
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "black",
                                        textDecoration: "underline",
                                      }}
                                      onClick= {
                                        () => {
                                          viewInvoice(order[10]);
                                        }
                                      }
                                    >
                                      View Invoice
                                    </button>
                                  ) : (
                                    ""
                                  )
                                  
                                }
                                <button
                                      style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "black",
                                        textDecoration: "underline",
                                      }}
                                      onClick= {
                                        () => {
                                          handleUpdateInvoiceModalShow(order);
                                        }
                                      }
                                    >
                                      update Invoice
                                    </button>
                              </td>
                              <td>{order[11]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Card.Body>
                </Card>
              </Row>
            </Container>
          </div>
        )}
      </Navbar>
    );
  }
  else{
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <div>
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <h1 style={{ color: "blue", fontSize: "32px", fontWeight: "normal" }}>You don't have permission</h1>
                </Card.Body>
              </Card>
            </Row>
          </Container>
        </div>
      </Navbar>
    );
  }
};
