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
import {
  getCollectionData,
  saveData,
  saveInvoice,
  savePdf,
  getFileDownloadURL,
  createHashData,
  getHashData, updateHashData, createContractObject
} from "../../utils/fbutils";
import { getStatus } from "../../assets/statusConfig";
import { formatBigNumber } from "../../utils/fbutils";
import toast, { Toaster } from "react-hot-toast";
import * as loadingImage from "../../assets/loading.json";
import Lottie from "react-lottie";
import { BsPlusSquare } from 'react-icons/bs'
import DropDown from "../../components/DropDown";
import StatusModal from "../../components/StatusModal";

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
  const common_url = "https://explorer.apothem.network/tx/"
  // Address States
  const [url1, setUrl1] = useState()
  const [url2, setUrl2] = useState()
  const [url3, setUrl3] = useState()
  const [url4, setUrl4] = useState()
  const [url5, setUrl5] = useState()
  const [url6, setUrl6] = useState()
  const [url7, setUrl7] = useState()
  const [url8, setUrl8] = useState()
  const [url9, setUrl9] = useState()
  const [url10, setUrl10] = useState()

  const [masterProductDataArray, setmasterProductDataArray] = useState([]);
  const [masterMaterialDataArray, setmasterMaterialDataArray] = useState([]);
  const [vendorDataArray, setVendorDataArray] = useState([]);
  // blockChainMasterData start
  const [masterTableData, setMasterTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaderSize, setLoaderSize] = useState(220);
  const [modalStatus, setModalStatus] = useState("");
  const [statusModalShow, setStatusModalShow] = useState(false);
  const [progressWidth, setProgressWidth] = React.useState("0%");


  //  blockChainMasterData end
  const [role, setRole] = useState("");
  const [save, setSave] = useState(false);
  const [masterProductModal, setmasterProductModal] = useState(false);
  const handlemasterProductModalClose = () => setmasterProductModal(false);
  const handlemasterProductModalShow = () => setmasterProductModal(true);

  const [materialModal, setMaterialModal] = useState(false);
  const handleMaterialModalClose = () => setMaterialModal(false);
  const handleMaterialModalShow = () => setMaterialModal(true);
  const [data, setData] = useState();
  const [vendorModal, setVendorModal] = useState(false);
  const handleVendorModalClose = () => setVendorModal(false);
  const handleVendorModalShow = () => setVendorModal(true);
  const [filteredMasterTableData, setFilteredMasterTableData] = useState([]);
  const [counter, setCounter] = useState(0);
  const setCounterFunc = (status) => {
    if (status === "Order Received") {
      setCounter(0);
      setProgressWidth("0%");
    } else if (status === "Looking for Vendor Acceptance") {
      setCounter(1);
      setProgressWidth("12%");
    } else if (status === "Vendor Accepted") {
      setCounter(2);
      setProgressWidth("24%");
    } else if (status === "Fullfilled") {
      setCounter(3);
      setProgressWidth("36%");
    } else if (status === "Ready for Production") {
      setCounter(4);
      setProgressWidth("44%");
    } else if (status === "Ready for Batching") {
      setCounter(5);
      setProgressWidth("56%");
    } else if (status === "Ready for Customer Delivery") {
      setCounter(6);
      setProgressWidth("66%");
    } else if (status === "Ready for Invoice") {
      setCounter(7);
      setProgressWidth("76%");
    } else if (status === "Paid") {
      setCounter(8);
      setProgressWidth("86%");
    } else if (status === "Completed") {
      setCounter(9);
      setProgressWidth("96%");
    }
  };


  useEffect(() => {

    setFilteredMasterTableData([]);
    console.log("masterTableData", masterTableData);
    setFilteredMasterTableData(masterTableData);
    // setFilteredMasterTableData(masterTableData.filter(each => each.status === "Paid" || each.status === "Completed" || each.status === "Order Received"));
  }, [masterTableData]);
  const fetchBlockchainData = async () => {
    const suppContract = await createContractObject();
    const tx = await suppContract.getRole();
    setMasterTableData(await suppContract.getAllOrderDetails());
  };
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
    const suppContract = await createContractObject();
    const role = await suppContract.getRole();

    if (role !== "Sales Representative") {
      console.log("You are not a Sales Representative");
      toast.error("You are not a Sales Representative");
      return;
    } else {
      console.log("Welcome Sales Representative");
      // window.alert("Welcome Sales Representative");
      toast.success("Welcome Sales Representative");
    }
    const mTableData = await suppContract.getAllOrderDetails();
    setMasterTableData(mTableData);

    // const b = mTableData[0][3];
    // console.log("test", (Number(b) / Math.pow(10, 18)) * 10 ** 18);

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
    orderProductStatus: getStatus(1)[0].name,
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
      await window.arcana.provider.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.arcana.provider); //create provider
      const suppContract = await createContractObject();

      const orderQty = parseInt(orderData.orderProductQuantity);
      const orderPrice = parseInt(orderData.orderProductTotalPrice);
      const _soId = await suppContract.getcurrentSOId();
      const tx = await suppContract.createOrder(
        orderData.orderProductName,
        orderQty,
        orderPrice,
        orderData.orderProductStatus
      );

      // console.log("txHash", tx.hash)

      // await createHashData(orderData.orderProductStatus, _soId, tx.hash)

      // toast.success(`So ID generated was ${JSON.stringify(_soId)}`);
      // setLoading(false);
      // getOrderDetails();
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(async () => {
          
          console.log(`orderProductStatus is: ${orderData.orderProductStatus} for soID: ${_soId} and hash is ${tx.hash}`)
          await createHashData(orderData.orderProductStatus, _soId, tx.hash)
          // console.log("so1", _soId)
          toast.success(`So ID generated was ${JSON.stringify(_soId)}`);
          setLoading(false);
          getOrderDetails();
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
    } else if (e.target.id === "invoicePdf") {
      // handle only pdf
      // show warning if not pdf
      // reset if not pdf
      // accept only pdf
      if (e.target.files[0].type === "application/pdf") {
        console.log(e.target.files[0]);
        setInvoicePdf(e.target.files[0]);
      } else {
        toast.error("Please upload only pdf");
        const fileInput = document.getElementById("invoicePdf");
        fileInput.value = "";
        // alert("Please upload only pdf");
        setInvoicePdf("");
      }
    }
    // console.log(e.target.value);
    // console.log(e.target.id);
  };
  const updateBlockDataOrderStatus = async (soId, col, val) => {
    try {
      setLoading(true);
      console.log("soId", soId);
      console.log("col", col);
      console.log("val", val);
      await window.arcana.provider.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.arcana.provider); //create provider
      const suppContract = await createContractObject();

      console.log(soId);

      const tx = await suppContract.update(soId, col, val);
      console.log("tx", tx);
      
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(async() => {
          // toast.success(`Role assigned successfully !!`);
          console.log("update Ran")
          const res = await updateHashData(soId, val[0], tx.hash)
          getOrderDetails();
          setLoading(false);
        });
      // toast('Role Assignment in progress !!', { icon: '👏' })
    } catch (e) {
      // toast.error('An error occured. Check console !!')
      console.log(e);
      setLoading(false);
    }
  };
  const handleFinalDataSubmit = async () => {
    // customer final delivery date is present
    if (customerFinalDeliveryDate) {
      await updateBlockDataOrderStatus(
        currentSoId,
        ["Status", "Customer Final Delivery Date", "Tracking No"],
        ["Completed", customerFinalDeliveryDate, finalTrackingNumber]
      );
    }
    // customer final delivery date is not present
    else {
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
    window.open(`${item}`, "_blank");
  };
  const [updateInvoiceModal, setUpdateInvoiceModal] = useState(false);
  const handleUpdateInvoiceModalClose = () => {
    // const fileInput = document.getElementById("invoicePdf");
    // fileInput.value = "";
    setInvoicePdf("");
    const fileInput = document.getElementById("invoicePdf");
    console.log("while closing", fileInput);
    // reset if any file is present
    if (fileInput) {
      fileInput.value = "";
    }
    setUpdateInvoiceModal(false);
  };

  const handleUpdateInvoiceModalShow = (item) => {
    setInvoicePdf("");
    console.log("handleUpdateInvoiceModalShow", item);
    setUpdateInvoiceModal(true);
    const fileInput = document.getElementById("invoicePdf");
    console.log(fileInput);
    // reset if any file is present
    if (fileInput) {
      fileInput.value = "";
    }
    console.log(item);
    setCurrentSoId(item[0]);
  };
  const handleInvoiceUpdate = async () => {
    console.log("handleInvoiceUpdate");
    console.log(currentSoId);
    console.log(invoicePdf);
    // check if invoice pdf is present
    if (!invoicePdf) {
      toast.error("Please upload invoice pdf");
      return;
    }
    // check if invoice is pdf
    if (invoicePdf.type !== "application/pdf") {
      toast.error("Please upload only pdf");
      setInvoicePdf("");
      return;
    }
    const invoicePdfUrl = await savePdf(invoicePdf, "invoicePdf");
    console.log(invoicePdfUrl);
    await updateBlockDataOrderStatus(
      currentSoId,
      ["Invoice Path"],
      [invoicePdfUrl]
    );
    // const fileInput = document.getElementById("invoicePdf");
    // fileInput.value = "";
    setInvoicePdf("");
    handleUpdateInvoiceModalClose();
  };
  const verifyRole = async () => {
    console.log("verifyRole");
    const suppContract = await createContractObject();
    const tx = await suppContract.getRole();
    console.log("tx", tx);
    setRole(tx);
    console.log("role", role);
  };
  useEffect(() => {
    verifyRole();
  }, []);
  return (
    <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
      <Toaster position="top-center" reverseOrder="false" />
      {loading === true ? (
        <>
          <Lottie
            options={loadingLoader}
            height={loaderSize}
            width={loaderSize}
          />
        </>
      ) : (
        <div>
          <h1
            style={{ color: "blue", fontSize: "32px", fontWeight: "normal" }}
          >
            Welcome Sales Representative
          </h1>
          <Container>
            <Row>
              <Card>
                <Card.Body>
                  <Col>
                    <div className="d-flex justify-content-end">
                      <Button onClick={createOrder} variant="primary" >
                        <BsPlusSquare />&nbsp;&nbsp;Create Order
                      </Button>{" "}
                    </div>
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
                          <Form.Group className="mb-3" controlId="invoicePdf">
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
                    <StatusModal statusModalShow={statusModalShow} setModalStatus={setModalStatus}
                      url1={url1}
                      url2={url2}
                      url3={url3}
                      url4={url4}
                      url5={url5}
                      url6={url6}
                      url7={url7}
                      url8={url8}
                      url9={url9}
                      url10={url10}
                      modalStatus={modalStatus}
                      counter={counter}
                      progressWidth={progressWidth}
                      setCounter={setCounter}
                      setStatusModalShow={setStatusModalShow}
                    />

                    <DropDown masterTableData={masterTableData} setData={setData} data={data} />
                    {
                      data && <Table className="mt-2" striped bordered hover>
                        <thead>
                          <tr>
                            {/* <th>Sr No.</th> */}
                            <th>So ID</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Order Value</th>
                            <th>Status</th>
                            <th>Customer Final Delivery Date</th>
                            <th>Bar Code</th>
                            <th>Batch No</th>
                            <th>Master Label</th>
                            <th>View Invoice</th>
                            <th>Tracking Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {/* <td>{index + 1}</td> */}
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
                                    handleTrackingDataModalShow(data);
                                  }}
                                >
                                  {data[0]}
                                </button>
                              }
                            </td>
                            <td>{data[2]}</td>
                            <td>{formatBigNumber(data[3])}</td>
                            <td>{formatBigNumber(data[4])}</td>
                            <td
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={async () => {
                                const res = await getHashData(data[0])
                                // console.log(order[0])
                                console.log(res)
                                console.log(res["Order Received"]);
                                setUrl1(res["Order Received"])
                                setUrl2(res["Looking for Vendor Acceptance"])
                                setUrl3(res["Vendor Accepted"])
                                setUrl4(res["Fullfilled"])
                                setUrl5(res["Ready for Production"])
                                setUrl6(res["Ready for Batching"])
                                setUrl7(res["Ready for Customer Delivery"])
                                setUrl8(res["Ready for Invoice"])
                                setUrl9(res["Paid"])
                                setUrl10(res["Completed"])
                                setModalStatus(data[6]);
                                setStatusModalShow(true);
                                setCounterFunc(data[6]);
                              }}
                            >
                              {data[6]}
                            </td>
                            <td>
                              {formatDate(
                                formatBigNumber(
                                  data.customerFinalDeliveryDate
                                )
                              )}
                            </td>
                            <td>{data[7]}</td>
                            <td>{data[8]}</td>
                            <td>{data[9]}</td>
                            <td>
                              {
                                // display link only if invoice is generated
                                data[10] !== "" ? (
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
                                    onClick={() => {
                                      viewInvoice(data[10]);
                                    }}
                                  >
                                    View Invoice
                                  </button>
                                ) : (
                                  ""
                                )
                              }
                              {/* <button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    color: "black",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => {
                                    handleUpdateInvoiceModalShow(data);
                                  }}
                                >
                                  update Invoice
                                </button> */}
                            </td>
                            <td>{data[11]}</td>
                          </tr>
                        </tbody>
                      </Table>
                    }
                  </Col>
                </Card.Body>
              </Card>
            </Row>
          </Container>
        </div>
      )}
    </Navbar>
  );
};
