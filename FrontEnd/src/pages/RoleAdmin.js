import React, { useState } from 'react';
import ResponsiveDrawer from "../components/Navbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStyles } from "../components/Styles";
import { ethers } from 'ethers';
import { getConfigByChain } from '../assets/config'
import {getRole}  from '../assets/roleConfig'
import toast, { Toaster } from 'react-hot-toast'
import SuppChain from '../artifacts/contracts/SupplyChain.sol/SupplyChain.json'
import * as walkingMan from "../assets/loading.json";
import Lottie from "react-lottie";

const walkingManLoader = {
  loop: true,
  autoplay: true,
  animationData: walkingMan,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function RoleAdmin(props) {

  const classes = useStyles();
  const navItem = [];
  const [loading, setLoading] = useState(false)
  const [loaderSize, setLoaderSize] = useState(220);
  const [formInput, updateFormInput] = useState({
    salesRep: '',
    poAgent: "",
    trdPartyVendor: "",
    wareHouseManager: ""
  });

  const handleAddRole = async (myAddress, role) => {
    setLoading(true)
    try {
      await (window).ethereum.request({ method: "eth_requestAccounts", });
      const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
      const network = await provider.getNetwork()
      const signer = provider.getSigner()
      
      const suppContract = new ethers.Contract(
        getConfigByChain(network.chainId)[0].suppChainAddress,
        SuppChain.abi,
        signer
      )
      
      const tx = await suppContract.addRole(myAddress, role)
      
      toast('Role Assignment in progress !!', { icon: '👏' })
      const receipt = await provider
        .waitForTransaction(tx.hash, 1, 150000)
        .then(() => {
          toast.success(`Role assigned successfully !!`)
          setLoading(false)
        })
    } catch (e) {
      toast.error('An error occured. Check console !!')
      console.log(e)
      setLoading(false)
    }
  }

  return (
    <div>
      <Toaster position='top-center' reverseOrder='false' />
      <ResponsiveDrawer navItems={navItem}>
        {loading === true ? (
          <>
          <Lottie
            options={walkingManLoader}
            height={loaderSize}
            width={loaderSize}
          />
          </>
        ) : (
          <div className={classes.FormWrap}>
            <h1 className={classes.pageHeading}>Add Roles</h1>

            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.RoleForm} >
                <TextField
                  id="salesRepRole"
                  label="Enter Sales Rep Address"
                  variant="outlined"
                  value={formInput.salesRep}
                  onChange={(e) =>
                    updateFormInput((formInput) => ({
                      ...formInput,
                      salesRep: e.target.value,
                    }))
                  }
                  style={{ width: "70%" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                    onClick={() => handleAddRole(formInput.salesRep, getRole(1)[0].name)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                    Add {getRole(1)[0].name}
                </Button>
              </div>
            </form>

            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.RoleForm} >
                <TextField
                  id="poAgentRole"
                  label="Enter PO Agent Address "
                  variant="outlined"
                  value={formInput.poAgent}
                  onChange={(e) =>
                    updateFormInput((formInput) => ({
                      ...formInput,
                      poAgent: e.target.value,
                    }))
                  }
                  style={{ width: "70%" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                    onClick={() => handleAddRole(formInput.poAgent, getRole(2)[0].name)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                    Add {getRole(2)[0].name}
                </Button>
              </div>
            </form>

            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.RoleForm} >
                <TextField
                  id="trdPartyRole"
                  label="Enter Third Party Vendor Address"
                  variant="outlined"
                  value={formInput.trdPartyVendor}
                  onChange={(e) =>
                    updateFormInput((formInput) => ({
                      ...formInput,
                      trdPartyVendor: e.target.value,
                    }))
                  }
                  style={{ width: "70%" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                    onClick={() => handleAddRole(formInput.trdPartyVendor, getRole(3)[0].name)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                    Add {getRole(3)[0].name}
                </Button>
              </div>
            </form>

            <form className={classes.root} noValidate autoComplete="off">
              <div className={classes.RoleForm} >
                <TextField
                  id="whManRole"
                  label=" Enter WareHouse Manager Address"
                  variant="outlined"
                  value={formInput.wareHouseManager}
                  onChange={(e) =>
                    updateFormInput((formInput) => ({
                      ...formInput,
                      wareHouseManager: e.target.value,
                    }))
                  }
                  style={{ width: "70%" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                    onClick={() => handleAddRole(formInput.wareHouseManager, getRole(4)[0].name)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                    Add {getRole(4)[0].name}
                </Button>
              </div>
            </form>
          </div>
        )}

        

      </ResponsiveDrawer>
    </div>
  );
}

export default RoleAdmin;
