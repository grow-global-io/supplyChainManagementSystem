import React from 'react'
import Navbar from "../../components/Navbar";
import Dropdown from 'react-bootstrap/Dropdown';
import { getCollectionData } from '../../utils/fbutils';
import { ethers } from 'ethers';
import { getConfigByChain } from '../../assets/config';
import SuppChain from "../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";


const TrackOrder = () => {
    const [masterProductDataArray,setmasterProductDataArray] =React.useState([])
    const [masterTableData,setMasterTableData] =React.useState([])
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
    React.useEffect(() => {
        async function getData(){
            setmasterProductDataArray(await getCollectionData("masterProductData"));
            await fetchBlockchainData();
        }
        getData();

    },[])
    const navItem = [];
    console.log(masterProductDataArray)
    console.log(masterTableData)
    return (
        <div>
            <Navbar pageTitle={"Track Order"} navItems={navItem}>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Select
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar>
        </div>
    )
}

export default TrackOrder
