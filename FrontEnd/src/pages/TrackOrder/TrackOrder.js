import React, { useState } from 'react'
import Navbar from "../../components/Navbar";
import Dropdown from 'react-bootstrap/Dropdown';
import { getCollectionData, getHashData, createContractObject } from '../../utils/fbutils';
import { ethers } from 'ethers';
import { getConfigByChain } from '../../assets/config';
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";
import { Modal, Table, Toast } from 'react-bootstrap';
import { useAccount, useNetwork } from 'wagmi'
import toast, { Toaster } from "react-hot-toast";
import StatusModal from '../../components/StatusModal';
import DropDown from '../../components/DropDown';



const TrackOrder = () => {
    const [masterTableData, setMasterTableData] = React.useState([])
    const [data, setData] = React.useState([])
    const [statusModalShow, setStatusModalShow] = React.useState(false)
    const [counter, setCounter] = React.useState(0);
    const { address } = useAccount()
    const [progressWidth, setProgressWidth] = React.useState("0%");
    const [modalStatus, setModalStatus] = useState("");

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

        const suppContract = await createContractObject();
        setMasterTableData(await suppContract.getAllOrderDetails());
    }
    const showModal = () => {
        setStatusModalShow(true)
    }
    React.useEffect(() => {
        if (address) {
            fetchBlockchainData();
        } else {
            toast.error("Connect your wallet first !!")
        }


    })
    const navItem = [];
    console.log(masterTableData)
    return (
        <div>
            <Navbar pageTitle={"Track Order"} navItems={navItem}>
                <Toaster position='top-center' reverseOrder='false' />
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
                                <th>Product Order ID</th>
                                <th>Product Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {/* <td>{index + 1}</td> */}
                                <td>
                                    {
                                        <p

                                        >
                                            {data[1]}
                                        </p>
                                    }
                                </td>
                                <td>{data[2]}</td>
                                <td
                                    style={{
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                    }}
                                    onClick={async () => {
                                        const res = await getHashData(data[0])
                                        console.log("resInput",data[0])
                                        console.log("res",res)
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
                            </tr>
                        </tbody>
                    </Table>
                }
            </Navbar>
        </div>
    )
}

export default TrackOrder
