import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "@material-ui/core/Button";
import { useStyles } from "../components/Styles";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { getRole } from '../assets/roleConfig'
import * as supplyChain from "../assets/supply-chain-and-shipping.json";
import Lottie from "react-lottie";
import { getData, createContractObject } from "../utils/fbutils";
import { useGateway } from "@civic/ethereum-gateway-react";
import { GatewayProvider, IdentityButton, ButtonMode } from "@civic/ethereum-gateway-react";
import { useAccount, useNetwork } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import toast, { Toaster } from "react-hot-toast";

const suppChainLoader = {
  loop: true,
  autoplay: true,
  animationData: supplyChain,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};



export default function Home() {

  const { requestGatewayToken, gatewayStatus, gatewayToken } = useGateway()
  const { chain } = useNetwork()
  const { address, connector } = useAccount();
  const [wallet, setWallet] = useState();
  const [role, setRole] = useState()
  const [pageURL, setPageURL] = useState()
  const [admin,setAdmin] = useState()

  useEffect(() => {
    if (!connector) return;
    connector.getSigner().then(setWallet);
    
  }, [connector]);

  useEffect(() => {
    const data = getData();
    if (address) {
      getAdmin()
      verifyRole()
      getPageURL()
    }
    console.log("role", role);
    console.log("gatewayStatus", gatewayStatus);
    console.log("gatewayToken", gatewayToken)
  }, [address])

  const classes = useStyles();
  const [loaderSize, setLoaderSize] = useState(520);
  const navItem = [];

  const getAdmin = async () => {
    const contract = await createContractObject();
    const owner = await contract.owner;
    setAdmin(await owner())
  };


  const verifyRole = async () => {
    const suppContract = await createContractObject();
    const tx = await suppContract.getRole();
    setRole(tx)
    getPageURL(tx)
  };

  const getPageURL = (role) => {
    if (role === getRole(1)[0].name) {
      setPageURL("/SalesRep")
    } else if (role === getRole(2)[0].name) {
      setPageURL("/PurchaseOrderAgent")
    } else if (role === getRole(3)[0].name) {
      setPageURL("/ProductionManager")
    } else if (role === getRole(4)[0].name) {
      setPageURL("/WarehouseManager")
    } else if (role === getRole(5)[0].name) {
      setPageURL("/FinanceManager")
    } else if (role === getRole(6)[0].name) {
      setPageURL("/ProductManager")
    } else if (role === getRole(7)[0].name) {
      setPageURL("/BatchManager")
    } else if (role === getRole(8)[0].name) {
      setPageURL("/LogisticsManager")
    } else {
      setPageURL("/CustomError")
    }
  }


  return (
    <>
      <div className={classes.pageWrap}>
        <Navbar navItems={navItem}>
          <Toaster position='top-center' reverseOrder='false' />
          <Grid
            container
            spacing={3}
            style={{ height: "100%", minHeight: "90vh", width: "100%" }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                minHeight: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* <img
                alt="."
                src="/homeArt.png"
                style={{ width: "90%", height: "auto" }}
              /> */}
              <Lottie
                options={suppChainLoader}
                height="auto"
                width="90%"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              style={{
                minHeight: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <div className={classes.HomeCardWrap}>
                {address ? (
                  <>
                    <h1 className={classes.pageHeading}>Welcome User</h1>
                    
                    <Link
                      to="/trackOrder"
                      style={{ textDecoration: "none", color: "#fff" }}
                    >
                      <Button
                        className={classes.HomeBtn}
                        size="large"
                        variant="outlined"
                        color="primary"
                      >
                        Track Order
                      </Button>
                    </Link>
                    {chain && (
                      <IdentityButton mode={ButtonMode.LIGHT} animation={true} />
                      // <button onclick={requestGatewayToken}>Civic Pass</button>

                    )}

                    <br />

                    
                    {admin === address ? (
                      <>
                      <Link
                        to="/roleAdmin"
                        style={{ textDecoration: "none", color: "#fff" }}
                      >
                        <Button
                          className={classes.HomeBtn}
                          size="large"
                          variant="outlined"
                          color="primary"
                        >
                          Assign Role
                        </Button>
                      </Link>
                        <Link
                          to={pageURL}
                          style={{ textDecoration: "none", color: "#fff" }}
                        >
                          <Button
                            className={classes.HomeBtn}
                            size="large"
                            variant="outlined"
                            color="primary"
                          >
                            My Dashboard
                          </Button>
                        </Link>
                      </>
                    ):(
                        <Link
                          to={pageURL}
                          style={{ textDecoration: "none", color: "#fff" }}
                        >
                          <Button
                            className={classes.HomeBtn}
                            size="large"
                            variant="outlined"
                            color="primary"
                          >
                            My Dashboard
                          </Button>
                        </Link>
                    )}
                    
                    
                  </>
                ) : (
                  <>
                    <h1 className={classes.pageHeading}>Connect Wallet To Start</h1>
                    <ConnectButton />
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </Navbar>
      </div>
    </>
  );
}
