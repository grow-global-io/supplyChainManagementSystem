import React from 'react'
import Navbar from "../../components/Navbar";
import Dropdown from 'react-bootstrap/Dropdown';
import { getCollectionData } from '../../utils/fbutils';
import { ethers } from 'ethers';
import { getConfigByChain } from '../../assets/config';
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { Modal, Table } from 'react-bootstrap';


const TrackOrder = () => {
    const [masterTableData, setMasterTableData] = React.useState([])
    const [data, setData] = React.useState([])
    const [statusModalShow, setStatusModalShow] = React.useState(false)
    const [counter, setCounter] = React.useState(0);
    const [progressWidth, setProgressWidth] = React.useState("0%");

    const setCounterFunc = (status) => {
        if (status === "Order Received") {
            setCounter(0);
            setProgressWidth("0%");
        } else if (status === "Looking for Vendor Acceptance") {
            setCounter(1);
            setProgressWidth("20%");
        } else if (status === "Vendor Accepted") {
            setCounter(2);
            setProgressWidth("30%");
        } else if (status === "Fullfilled") {
            setCounter(3);
            setProgressWidth("40%");
        } else if (status === "Ready for Production") {
            setCounter(4);
            setProgressWidth("50%");
        } else if (status === "Ready for Batching") {
            setCounter(5);
            setProgressWidth("60%");
        } else if (status === "Ready for Customer Delivery") {
            setCounter(6);
            setProgressWidth("70%");
        } else if (status === "Ready for Invoice") {
            setCounter(7);
            setProgressWidth("80%");
        } else if (status === "Paid") {
            setCounter(8);
            setProgressWidth("90%");
        } else if (status === "Completed") {
            setCounter(9);
            setProgressWidth("100%");
        }
    };
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
    const showModal = () => {
        setStatusModalShow(true)
    }
    React.useEffect(() => {
        async function getData() {
            await fetchBlockchainData();
        }
        getData();

    }, [])
    const navItem = [];
    console.log(masterTableData)
    return (
        <div>
            <Navbar pageTitle={"Track Order"} navItems={navItem}>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Select
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {masterTableData.map((product) => {
                            return <Dropdown.Item onClick={() => setData(product)}>{product["PoID"] + " " + product[2]}</Dropdown.Item>
                        })
                        }
                    </Dropdown.Menu>
                </Dropdown>
                {
                    data.length > 0 ? (<Table striped bordered hover className='mt-5'>
                        <thead>
                            <tr>
                                <th>SOID</th>
                                <th>Product Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{data["PoID"]}</td>
                                <td>{data[2]}</td>
                                <td style={{
                                    cursor: "pointer",
                                    textDecoration: "underline"
                                }}
                                    onClick={() => {
                                        showModal();
                                        setCounterFunc(data["status"]);
                                    }
                                    }>{data["status"]}</td>
                            </tr>
                        </tbody>
                    </Table>) : <></>
                }
                <Modal
                    className="mt-5"
                    show={statusModalShow}
                    onHide={() => {
                        setStatusModalShow(false);
                        setCounter(0);
                    }}
                    style={{ height: "100%", width: "100%" }}
                >
                    <Modal.Title style={{ padding: "30px" }}>
                        Status
                    </Modal.Title>
                    <Modal.Body style={{ backgroundColor: "#cfcfcf", padding: "2.5rem" }}>
                        <div className="progress-bar1">
                            <div
                                className="progress1"
                                id="progress"
                                style={{ width: progressWidth }}
                            ></div>
                            <div
                                className={
                                    counter >= 0
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 1
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 2
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 3
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 4
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 5
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 6
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 7
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 8
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                            <div
                                className={
                                    counter >= 9
                                        ? "progress-step progress-step-active"
                                        : "progress-step"
                                }
                            ></div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <p
                                style={{
                                    transform: "translate(-15px, 10px)",
                                    fontSize: "1em",
                                    textAlign: "center",
                                }}
                            >
                                Order <br /> Received
                            </p>
                            <p
                                style={{
                                    transform: "translate(-16px, -97px)",
                                    fontSize: "1em",
                                    textAlign: "center",
                                }}
                            >
                                Looking <br /> for Vendor <br /> Acceptance
                            </p>

                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-22px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Vendor <br /> Accepted
                            </p>
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-15px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Fullfilled
                            </p>
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-10px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Production
                            </p>
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-10px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Batching
                            </p>
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-9px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Customer <br /> Delivery
                            </p>
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(-11px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Ready for <br /> Invoice
                            </p>
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(7px, 10px)",
                                    textAlign: "center",
                                }}
                            >
                                Paid
                            </p>
                            <p
                                style={{
                                    fontSize: "1em",
                                    transform: "translate(24px, -80px)",
                                    textAlign: "center",
                                }}
                            >
                                Completed
                            </p>
                        </div>
                        <h3
                            className="text-center mt-5"
                            style={{ color: "#1A237E" }}
                        >
                            {
                                data['status']
                            }
                        </h3>
                    </Modal.Body>
                </Modal>
            </Navbar>
        </div>
    )
}

export default TrackOrder
