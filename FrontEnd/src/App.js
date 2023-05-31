import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./App.css";
import { Buffer } from "buffer";
import RoleAdmin from "./pages/RoleAdmin";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./components/Theme";
import Explorer from './pages/Explorer';
import Home from "./pages/Home";
import { SalesRep } from "./pages/SalesRep/SalesRep";
import PurchaseOrderAgent from "./pages/PurchaseOrderAgent/PurchaseOrderAgent";
import { getConfigByChain } from './assets/config'
import Lottie from "react-lottie";
import * as globeLoaderData from "./assets/globe.json";
import * as successLoaderData from "./assets/success.json";
// import { ProductionManager } from "./pages/ProductionManager/ProductionManager";
import { ProductionManager } from "./pages/ProductionManager/ProductionManager";
import { WarehouseManager } from "./pages/WarehouseManager/WarehouseManager";
import { FinanceManager } from "./pages/FinanceManager/FinanceManager";
import { BatchManager } from "./pages/BatchManager/BatchManager";
import { LogisticsManager } from "./pages/LogisticsManager/LogisticsManager";
import { ProductManager } from "./pages/productManager/productManager";
import { CustomError } from './pages/CustomError/customError'
import { useGateway } from "@civic/ethereum-gateway-react";
import { useAccount, useNetwork } from 'wagmi'
import { GatewayProvider, IdentityButton, ButtonMode } from "@civic/ethereum-gateway-react";
import TrackOrder from "./pages/TrackOrder/TrackOrder";

const globeLoader = {
  loop: true,
  autoplay: true,
  animationData: globeLoaderData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const successLoader = {
  loop: true,
  autoplay: true,
  animationData: successLoaderData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function App() {

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { requestGatewayToken, gatewayStatus, gatewayToken } = useGateway()
  const { chain } = useNetwork()
  const { address, connector } = useAccount();
  const [wallet, setWallet] = useState();

  const [loaderSize, setLoaderSize] = useState(320);

  useEffect(() => {
    if (!connector) return;
    connector.getSigner().then(setWallet);
    window.Buffer = Buffer;
  }, [connector]);


  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        setCompleted(true);
      }, 1000);
    }, 4000);
  }, []);

  return (
    <>
      {!completed ? (
        <div className="loading-container container">
          {!loading ? (
            <Lottie
              options={globeLoader}
              height={loaderSize}
              width={loaderSize}
            />
          ) : (
            <Lottie
              options={successLoader}
              height={loaderSize}
              width={loaderSize}
            />
          )}
        </div>
      ) : (
        <div className="App">
            <GatewayProvider gatekeeperNetwork="ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"
            wallet={wallet}
          >
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <Routes>

                  <Route exact path="/trackOrder" element={
                    <TrackOrder />
                  } />
                  <Route exact path="/roleAdmin" element={
                    <RoleAdmin />
                  } />
                  <Route exact path="/explorer" element={
                    <Explorer />
                  } />
                  <Route exact path="/salesRep" element={
                    <SalesRep />
                  } />
                  <Route exact path="/PurchaseOrderAgent" element={
                    <PurchaseOrderAgent />
                  } />
                  <Route exact path="/ProductManager" element={
                    <ProductManager />
                  } />

                  <Route exact path="/ProductionManager" element={
                    <ProductionManager />
                  } />
                  <Route exact path="/WarehouseManager" element={
                    <WarehouseManager />
                  } />
                  <Route exact path="/FinanceManager" element={
                    <FinanceManager />
                  } />

                  <Route exact path="/BatchManager" element={
                    <BatchManager />
                  } />

                  <Route exact path="/CustomError" element={
                    <CustomError />
                  } />

                  <Route exact path="/LogisticsManager" element={
                    <LogisticsManager />
                  } />
                  <Route exact path="/" element={
                    <Home />
                  } />
                </Routes>
              </BrowserRouter>


            </ThemeProvider>
          </GatewayProvider>
        </div>

      )}

    </>
  );

}

export default App;
