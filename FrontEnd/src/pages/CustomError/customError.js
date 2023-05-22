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
import * as loadingImage from "../../assets/loading.json";
import Lottie from "react-lottie";

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
    saveData,
} from "../../utils/fbutils";
import { updateCollectionData } from "../../utils/fbutils";
import { getStatus } from "../../assets/statusConfig";
import { Toaster } from "react-hot-toast";
const navItem = [];

export const CustomError = () => {


    return (
        <Navbar pageTitle={"Error"} navItems={navItem}>
            <div>
                <Container>
                    <Row>
                        <Card>
                            <Card.Body>
                                <h1>Access restricted !! Contact Admin for Access !!</h1>
                            </Card.Body>
                        </Card>
                    </Row>
                </Container>
            </div>
        </Navbar>
    );

};
