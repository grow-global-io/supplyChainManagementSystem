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
import Select from "react-select";
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { useState } from "react";
import { ethers } from "ethers";
import { getConfigByChain } from "../../assets/config";
import * as loadingImage from "../../assets/loading.json";
import Lottie from "react-lottie";
import { Toaster, toast } from "react-hot-toast";
import {
  formatBigNumber,
  getCollectionData,
  getCollectionDataWithId,
  saveData, updateHashData, createContractObject
} from "../../utils/fbutils";
import { updateCollectionData, savePdf } from "../../utils/fbutils";
import { getStatus } from "../../assets/statusConfig";
const navItem = [];
export const FinanceManager = () => {
  const [invoicePdf, setInvoicePdf] = useState("");
  const [finalTrackingNumber, setFinalTrackingNumber] = useState("");
  const [updateInvoiceModal, setUpdateInvoiceModal] = useState(false);

  const [customerFinalDeliveryDate, setCustomerFinalDeliveryDate] =
    useState("");
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
  const viewInvoice = async (item) => {
    // const downloadUrl = await getFileDownloadURL("invoicePdf/exp 7 IOT.pdf")
    // console.log(downloadUrl);
    console.log("viewInvoice", item);
    // // open link in new tab
    window.open(`${item}`, "_blank");
  };

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

  const handlePaidStatusChange = async(item)=>{
    console.log("paid")
    await updateBlockDataOrderStatus(
      item[0],
      ["Status"],
      ["Paid"]
    );
  }
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
    handleClose();
  };
  // blockChainMasterData start
  const [masterTableData, setMasterTableData] = useState([]);
  //  blockChainMasterData end
  const [role, setRole] = useState("");
  const [save, setSave] = useState(false);
  const [filteredMasterTableData, setFilteredMasterTableData] = useState([]);
  useEffect(() => {
    console.log('this is called');

    setFilteredMasterTableData([]);
    console.log("masterTableData", masterTableData);
    // setFilteredMasterTableData(masterTableData);
    setFilteredMasterTableData(masterTableData.filter(each => each.status === "Ready for Invoice"));

  }, [masterTableData]);
  const fetchBlockchainData = async () => {
    const suppContract = await createContractObject();
    setMasterTableData(await suppContract.getAllOrderDetails());
  }
  const loadingLoader = {
    loop: true,
    autoplay: true,
    animationData: loadingImage,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const [loading, setLoading] = useState(false);
  const [loaderSize, setLoaderSize] = useState(220);
  const fetchCollectionData = async () => { };
  useEffect(() => {
    verifyRole();
    fetchCollectionData();
  }, [save]);
  useEffect(() => {
    console.log("masterTableData", masterTableData);
  }, [masterTableData]);
  const verifyRole = async () => {
    console.log("verifyRole");
    const suppContract = await createContractObject();

    console.log("suppContract", suppContract);
    const tx = await suppContract.getRole();
    setMasterTableData(await suppContract.getAllOrderDetails());
    setRole(tx);
  };

  const updateBlockDataOrderStatus = async (soId, col, val) => {
    try {
      setLoading(true)
      await window.arcana.provider.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.arcana.provider); //create provider
      const suppContract = await createContractObject();
      console.log(soId);
      const tx = await suppContract.update(soId, col, val);

      // toast('Role Assignment in progress !!', { icon: '👏' })
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(async () => {
          // toast.success(`Role assigned successfully !!`);
          // getOrderDetails();
          console.log(`soid is: ${soId} for colValue: ${val[0]} and hash is ${tx.hash}`)

          const res = await updateHashData(soId, val[0], tx.hash)
          fetchBlockchainData();
          setLoading(false);
        });
    } catch (e) {
      // toast.error('An error occured. Check console !!')
      console.log(e);
      setLoading(false)
    }
  };
  //
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [currentSoId, setCurrentSoId] = useState(0);

  const handleShow = (item) => {
    setShow(true);
    setCurrentSoId(item[0]);
    console.log("currentSoId", currentSoId);
    console.log("item", item);
  };
  const [invoicePath, setInvoicePath] = useState("");
  const handleChange = (e) => {
    setInvoicePath(e.target.value);
  }

  if (true) {
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <Toaster position='top-center' reverseOrder='false' />
        {
          loading === true ? (
            <>
              <Lottie
                options={loadingLoader}
                height={loaderSize}
                width={loaderSize}
              />
            </>
          ) : (
            <div>
              <h1 style={{ color: "blue", fontSize: "32px", fontWeight: "normal" }}>
                Welcome Finance Manager
              </h1>
              <Container>
                <Row>
                  <Card>
                    <Card.Body>
                      <Col>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>SNo.</th>
                              <th>Product Order Id</th>
                              <th>Product Name</th>
                              <th>Quantity</th>
                              <th>Order Value</th>
                              <th>Status</th>
                              <th>Invoice</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMasterTableData.map((order, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>
                                  {order[1]}
                                  
                                </td>
                                <td>{order[2]}</td>
                                <td>{formatBigNumber(order[3])}</td>
                                <td>{formatBigNumber(order[4])}</td>
                                <td>{order[6]}</td>
                                <td className="d-flex flex-column justify-content-start align-items-start">
                                  {order[10] !== "" ? (<button
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: "black",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() => {
                                      viewInvoice(order[10]);
                                    }}
                                  >
                                    View Invoice
                                  </button>) : (<button
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: "black",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() => handleShow(order)}
                                  >
                                    Update Invoice
                                  </button>)}

                                </td>
                                <td>
                                  {order[10] !== "" &&
                                  <Button variant="primary"
                                  
                                  onClick={()=>handlePaidStatusChange(order)}
                                >
                                  Mark as paid
                                </Button>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Modal
                          className="mt-5"
                          show={show}
                          onHide={handleClose}
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
                              onClick={handleClose}
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
                      </Col>
                    </Card.Body>
                  </Card>
                </Row>
              </Container>
            </div>
          )
        }
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
