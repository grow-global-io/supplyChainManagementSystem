import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { SiCheckmarx } from 'react-icons/si'
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
import {
  formatBigNumber,
  getCollectionData,
  getCollectionDataWithId,
  saveData, updateHashData, createContractObject
} from "../../utils/fbutils";
import { updateCollectionData } from "../../utils/fbutils";
import { getStatus } from "../../assets/statusConfig";
import * as loadingImage from "../../assets/loading.json";
import Lottie from "react-lottie";
import { Toaster } from "react-hot-toast";
const navItem = [];
export const WarehouseManager = () => {
  const [masterProductDataArray, setmasterProductDataArray] = useState([]);
  const [masterMaterialDataArray, setmasterMaterialDataArray] = useState([]);
  const [vendorDataArray, setVendorDataArray] = useState([]);
  const [purchaseOrderLineItemDataArray, setPurchaseOrderLineItemDataArray] =
    useState([]);
  // blockChainMasterData start
  const [masterTableData, setMasterTableData] = useState([]);
  const [filteredMasterTableData, setFilteredMasterTableData] = useState([]);
  useEffect(() => {
    console.log('this is called');

    setFilteredMasterTableData([]);
    console.log("masterTableData", masterTableData);
    // setFilteredMasterTableData(masterTableData);
    setFilteredMasterTableData(masterTableData.filter(each => each.status === "Fullfilled"));

  }, [masterTableData]);
  //  blockChainMasterData end
  const [role, setRole] = useState("");
  const [save, setSave] = useState(false);
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
  const fetchCollectionData = async () => {
    setmasterProductDataArray(await getCollectionData("masterProductData"));
    setmasterMaterialDataArray(await getCollectionData("masterMaterialData"));
    setVendorDataArray(await getCollectionData("masterVendorData"));
    setPurchaseOrderLineItemDataArray(
      await getCollectionDataWithId("purchaseOrderLineItem")
    );
  };
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
    const tx = await suppContract.getRole();
    setMasterTableData(await suppContract.getAllOrderDetails());
    setRole(tx);
  };
  // purchase order Agent specific code start
  const [POModalShow, setPOModalShow] = useState(false);
  const handlePOModalClose = () => setPOModalShow(false);
  const handlePOModalShow = () => setPOModalShow(true);
  const [currentPO, setCurrentPO] = useState([]);
  const [POData, setPOData] = useState({
    poId: "",
    soId: "",
    materialName: "",
    Qty: "",
    orderValue: 0,
    vendorName: [],
    receiveDate: "",
    shelfLife: "",
    barCode: "",
    batchNumber: "",
  });
  const handlePODataChange = (e) => {
    // setPOData({ ...POData, [e.target.id]: e.target.value });
    if (e.target.id === "Qty") {
      const filteredArray = masterMaterialDataArray.filter((each) => {
        return each.materialName === POData.materialName;
      });
      const materialPrice = parseInt(filteredArray[0].materialUnitPrice);
      const Quantity = parseInt(e.target.value);
      if (Quantity < 0) {
        alert("Quantity should be greater than 0");
        return;
      }
      const orderValue = materialPrice * Quantity;
      POData.orderValue = orderValue;
      console.log("PODataP", POData);
    }
    setPOData({ ...POData, [e.target.id]: e.target.value });
    console.log("POData", POData);
  };
  const createPOLineItem = (soId, poId) => async () => {
    console.log("poId", poId);
    console.log("soId", soId);
    POData.poId = poId;
    POData.soId = soId;
    setCurrentPO(poId);
    handlePOModalShow();
  };
  const handlePODataSubmit = async () => {
    POData.vendorName = selectedVendors;
    console.log("POData", POData);
    console.log("soId", POData.soId);
    await saveData(POData, "purchaseOrderLineItem");
    setSave(!save);
    await updateBlockDataOrderStatus(
      POData.soId,
      ["Status"],
      ["Looking for Vendor Acceptance"]
    );
    handlePOModalClose();
  };
  const updateBlockDataOrderStatus = async (soId, col, val) => {
    try {
      setLoading(true)
      const suppContract = await createContractObject();

      console.log(soId);
      const tx = await suppContract.update(soId, col, val);
      const res = await updateHashData(soId, val[0], tx.hash)
      fetchBlockchainData();
      setLoading(false);
      // const receipt = await provider
      //   .waitForTransaction(tx.hash, 1, 150000)
      //   .then(async () => {
      //     // toast.success(`Role assigned successfully !!`);
      //     // getOrderDetails();
      //     const res = await updateHashData(soId, val[0], tx.hash)
      //     fetchBlockchainData();
      //     setLoading(false);
      //   });

      // toast('Role Assignment in progress !!', { icon: '👏' })
    } catch (e) {
      // toast.error('An error occured. Check console !!')
      console.log(e);
      // setLoading(false)
    }
  };
  const [vendorList, setVendorList] = useState([]);
  useEffect(() => {
    setVendorList([]);
    let tempVendorList = [];
    masterMaterialDataArray.map((each) => {
      if (each.materialName === POData.materialName) {
        // console.log("each", each);
        each.materialVendorResponsible.map((vendor) => {
          console.log("vendor", vendor);
          tempVendorList.push({ value: vendor, label: vendor });
        });
      }
    });
    console.log("tempVendorList", tempVendorList);
    setVendorList(tempVendorList);
    console.log("vendorList", vendorList);
  }, [POData.materialName]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const handleMultipleVendorChange = (e) => {
    setSelectedVendors(Array.isArray(e) ? e.map((x) => x.value) : []);
    console.log("selectedVendors", selectedVendors);
    // POData.vendorName = selectedVendors;
    // console.log("POData", POData);
  };
  const [receiveDateUpdatePOId, setReceiveDateUpdatePOId] = useState("");
  const [receiveDateUpdateCollectionId, setReceiveDateUpdateCollectionId] =
    useState("");
  const updatePOLineItemData = (item) => {
    setPOData(item);
    handleUpdateReceiveDataModalShow();
  };
  const [updateReceiveDataModalShow, setUpdateReceiveDataModalShow] =
    useState(false);
  const handleUpdateReceiveDataModalClose = () =>
    setUpdateReceiveDataModalShow(false);
  const handleUpdateReceiveDataModalShow = () =>
    setUpdateReceiveDataModalShow(true);
  const [receiveDate, setReceiveDate] = useState("");
  const handleUpdateReceiveDataChange = (e) => {
    // setReceiveDate(e.target.value);
    // POData.receiveDate = e.target.value;
    setPOData({ ...POData, [e.target.id]: e.target.value });
    // console.log("e.target.value", e.target.value);
    // console.log("e.target.id", e.target.id);
    // console.log("POData", POData);
  };
  const handleUpdateReceiveDataSubmit = async () => {
    console.log("POData", POData);
    setLoading(true);
    await updateCollectionData("purchaseOrderLineItem", POData.id, POData);
    setSave(!save);
    setLoading(false);
    // updateBlockDataOrderStatus(POData.soId, ["Status"], ["Vendor Accepted"]);
    handleUpdateReceiveDataModalClose();
  };
  // show particular PO details
  const [showPODetails, setShowPODetails] = useState(true);
  const [selectedPO, setSelectedPO] = useState("");
  const [selectedSO, setSelectedSO] = useState("");
  const [
    filteredpurchaseOrderLineItemDataArray,
    setFilteredpurchaseOrderLineItemDataArray,
  ] = useState([]);
  const handleShowPODetails = (soId, poId) => {
    setShowPODetails(false);
    setSelectedPO(poId);
    setSelectedSO(soId);
    console.log("poId", poId);
    console.log("soId", soId);
    // open View purchase order Line items tab
    const tab = document.getElementById(
      "uncontrolled-tab-example-tab-ViewPurchaseOrderLineItems"
    );
    console.log("tab", tab);
    // wait for 1 sec
    setTimeout(() => {
      tab.click();
    }, 1000);

    // filter purchase order line item data array
    console.log(
      "purchaseOrderLineItemDataArray",
      purchaseOrderLineItemDataArray
    );
    let tempFilteredpurchaseOrderLineItemDataArray = [];
    purchaseOrderLineItemDataArray.map((each) => {
      if (each.poId === poId) {
        tempFilteredpurchaseOrderLineItemDataArray.push(each);
      }
    });
    console.log(
      "tempFilteredpurchaseOrderLineItemDataArray",
      tempFilteredpurchaseOrderLineItemDataArray
    );
    setFilteredpurchaseOrderLineItemDataArray(
      tempFilteredpurchaseOrderLineItemDataArray
    );
  };
  // purchase order Agent specific code end
  if (true) {
    return (
      <Navbar pageTitle={"Delivery Hub"} navItems={navItem}>
        <Toaster position='top-center' reverseOrder='false' />
        {
          loading === true ? (
            <Lottie
              options={loadingLoader}
              height={loaderSize}
              width={loaderSize}
            />
          ) : (
            <div>
              <h1 style={{ color: "blue", fontSize: "32px", fontWeight: "normal" }}>
                Welcome Warehouse Manager
              </h1>
              <Container>
                <Row>
                  <Card>
                    <Card.Body>
                      <Col>
                        <Tabs
                          defaultActiveKey="viewOrder"
                          id="uncontrolled-tab-example"
                          className="mb-3"
                        >
                          <Tab eventKey="viewOrder" title="My View">
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>Sr. No.</th>
                                  <th>PoID</th>
                                  <th>prodName</th>
                                  <th>qty</th>
                                  <th>orderValue</th>
                                  <th>status</th>
                                  {
                                    // <th>Create PO Line Item</th>
                                  }
                                </tr>
                              </thead>
                              <tbody>
                                {filteredMasterTableData.map((order, index) => (
                                  <tr>
                                    <td>{index + 1}</td>
                                    {
                                      // <td>{order[1]}</td>
                                    }
                                    <td>
                                      <Button
                                        style={{
                                          backgroundColor: "transparent",
                                          border: "none", color: "black", textDecoration: "underline"
                                        }}
                                        onClick={() =>
                                          handleShowPODetails(order[0], order[1])
                                        }
                                        variant="primary"
                                      >
                                        {order[1]}
                                      </Button>{" "}
                                    </td>
                                    <td>{order[2]}</td>
                                    <td>{formatBigNumber(order[3])}</td>
                                    <td>{formatBigNumber(order[4])}</td>
                                    <td>{order[6]}</td>
                                    {
                                      //   <td>
                                      //   <Button
                                      //     onClick={createPOLineItem(order[0],order[1])}
                                      //     variant="primary"
                                      //   >
                                      //     Click
                                      //   </Button>{" "}
                                      // </td>
                                    }
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            <Modal
                              className="mt-5"
                              show={POModalShow}
                              onHide={handlePOModalClose}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Modal heading</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="materialName"
                                  >
                                    <Form.Label>PO ID</Form.Label>
                                    <Form.Control
                                      type="text"
                                      disabled
                                      placeholder={currentPO}
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="materialName"
                                  >
                                    <Form.Label>Material Name</Form.Label>
                                    <Form.Control
                                      as="select"
                                      onChange={handlePODataChange}
                                    >
                                      <option value="">Select Material</option>
                                      {masterMaterialDataArray.map((material) => (
                                        <option value={material.materialName}>
                                          {material.materialName}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </Form.Group>
                                  <Form.Group className="mb-3" controlId="Qty">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                      type="number"
                                      placeholder="Enter Quantity"
                                      value={POData.Qty}
                                      onChange={handlePODataChange}
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="orderValue"
                                  >
                                    <Form.Label>Order Value</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Order Value"
                                      value={POData.orderValue}
                                      disabled
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
                                  {
                                    //   <Form.Group
                                    //   className="mb-3"
                                    //   controlId="receiveDate"
                                    // >
                                    //   <Form.Label>Receive Data</Form.Label>
                                    //   <Form.Control
                                    //     type="date"
                                    //     placeholder="Enter Receive Date"
                                    //     value={POData.receiveDate}
                                    //     onChange={handlePODataChange}
                                    //   />
                                    // </Form.Group>
                                  }
                                </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handlePOModalClose}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={handlePODataSubmit}
                                >
                                  Save Changes
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </Tab>
                          <Tab
                            disabled={showPODetails}
                            id="viewOrder-tab"
                            eventKey="ViewPurchaseOrderLineItems"
                            title="POLineItem"
                          >
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>Sr. No.</th>
                                  {
                                    // <th>SoID</th>
                                  }
                                  <th>PoID</th>
                                  <th>Material Name</th>
                                  <th>qty</th>
                                  <th>orderValue</th>
                                  <th>Vendor</th>

                                  <th>Receive Date</th>
                                  <th>shelf Life</th>
                                  <th>bar code</th>
                                  <th>batch number</th>
                                  <th>update Data</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredpurchaseOrderLineItemDataArray.map(
                                  (item, index) => (
                                    <tr>
                                      <td>{index + 1}</td>
                                      {
                                        // <td>{item.soId}</td>
                                      }
                                      <td>{item.poId}</td>
                                      <td>{item.materialName}</td>
                                      <td>{item.Qty}</td>
                                      <td>{item.orderValue}</td>
                                      <td>
                                        {item.vendorName.map((vendor) => (
                                          <div>{vendor}</div>
                                        ))}
                                      </td>
                                      <td>{item.receiveDate}</td>
                                      <td>{item.shelfLife}</td>
                                      <td>{item.barCode}</td>
                                      <td>{item.batchNumber}</td>
                                      <td>
                                        <Button
                                          onClick={() => {
                                            updatePOLineItemData(item);
                                          }}
                                        >
                                          <SiCheckmarx />&nbsp; &nbsp; Update Data
                                        </Button>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </Table>
                            {
                              //   <Button
                              //   onClick={createPOLineItem(
                              //     selectedSO,
                              //     selectedPO
                              //   )}
                              //   variant="primary"
                              // >
                              //   Create PO Line Item
                              // </Button>{" "}
                            }
                            <Button
                              onClick={() =>
                                updateBlockDataOrderStatus(
                                  selectedSO,
                                  ["Status"],
                                  ["Ready for Production"]
                                )
                              }
                              variant="primary"
                            >
                              <SiCheckmarx />&nbsp; &nbsp; Mark as Ready for Production
                            </Button>{" "}
                            <Modal
                              className="mt-5"
                              show={updateReceiveDataModalShow}
                              onHide={handleUpdateReceiveDataModalClose}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Update PO Line Item</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="shelfLife"
                                  >
                                    <Form.Label>{`Shelf Life(in months)`}</Form.Label>
                                    <Form.Control
                                      type="number"
                                      placeholder="Enter Shelf Life"
                                      onChange={handleUpdateReceiveDataChange}
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="barCode"
                                  >
                                    <Form.Label>Bar Code</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Bar Code"
                                      onChange={handleUpdateReceiveDataChange}
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="batchNumber"
                                  >
                                    <Form.Label>Batch Number</Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Batch Number"
                                      onChange={handleUpdateReceiveDataChange}
                                    />
                                  </Form.Group>
                                </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={handleUpdateReceiveDataModalClose}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() => {
                                    handleUpdateReceiveDataSubmit();
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </Tab>
                        </Tabs>
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
