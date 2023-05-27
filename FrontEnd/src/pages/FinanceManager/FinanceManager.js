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
import { Toaster } from "react-hot-toast";
import {
  formatBigNumber,
  getCollectionData,
  getCollectionDataWithId,
  saveData,
} from "../../utils/fbutils";
import { updateCollectionData } from "../../utils/fbutils";
import { getStatus } from "../../assets/statusConfig";
const navItem = [];
export const FinanceManager = () => {
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
    setMasterTableData(await suppContract.getAllOrderDetails());
    setRole(tx);
  };

  const updateBlockDataOrderStatus = async (soId, col, val) => {
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
      console.log(soId);
      const tx = await suppContract.update(soId, col, val);
      console.log("tx", tx);
      // toast('Role Assignment in progress !!', { icon: '👏' })
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(() => {
          // toast.success(`Role assigned successfully !!`);
          // getOrderDetails();
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
  const handleSave = async () => {
    handleClose();
    console.log(currentSoId)
    console.log("handleSave");
    console.log("invoicePath", invoicePath);
    await updateBlockDataOrderStatus(currentSoId, ["Invoice Path", "Status"], [invoicePath, "Paid"]);
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
                              <th>Sr. No.</th>
                              <th>PoID</th>
                              <th>prodName</th>
                              <th>qty</th>
                              <th>orderValue</th>
                              <th>status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMasterTableData.map((order, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>
                                  <Button
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none", color: "black", textDecoration: "underline"
                                    }}
                                    onClick={() => handleShow(order)}
                                    variant="primary"
                                  >
                                    {order[1]}
                                  </Button>{" "}
                                </td>
                                <td>{order[2]}</td>
                                <td>{formatBigNumber(order[3])}</td>
                                <td>{formatBigNumber(order[4])}</td>
                                <td>{order[6]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Modal className="mt-5" show={show} onHide={handleClose}>
                          <Modal.Header closeButton>
                            <Modal.Title>
                              Update Invoice Details
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form>
                              <Form.Group
                                className="mb-3"
                                controlId="invoicePath"
                              >
                                <Form.Label>Invoice Path</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  onChange={handleChange}
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
