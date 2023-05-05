import React, { useState, useEffect } from 'react';
import ResponsiveDrawer from "../components/Navbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useRole } from "../context/RoleDataContext";
import { useStyles } from "../components/Styles";
import { ethers } from 'ethers';
import { getConfigByChain } from '../assets/config'
import { getRole } from '../assets/roleConfig'
import BigNumber from 'bignumber.js'
import toast, { Toaster } from 'react-hot-toast'
import SuppChain from '../artifacts/contracts/SupplyChain.sol/SupplyChain.json'
import RingLoader from "react-spinners/RingLoader";

function RoleAdmin(props) {
  const accounts = props.accounts;

  const classes = useStyles();
  const navItem = [];
  const [loading, setLoading] = useState(false)
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
          <RingLoader color='#000000' loading={loading} size={50} />
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
                  onClick={() => handleAddRole(formInput.salesRep, getRole().salesRep)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                  Add Sales Representative
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
                  onClick={() => handleAddRole(formInput.poAgent, getRole().poAgent)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                  Add PO Agent
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
                  onClick={() => handleAddRole(formInput.trdPartyVendor, getRole().trdVendor)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                  Add Vendor
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
                  onClick={() => handleAddRole(formInput.wareHouseManager, getRole().whMan)}
                  style={{ width: "30%", marginLeft: "10px" }}
                >
                  Add WareHouse Manager
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className={classes.FormWrap}>
          <h1 className={classes.pageHeading}>Local Accounts</h1>
          {accounts.slice(1).map((acc) => (
            <h3 className={classes.tableCount}>{acc}</h3>
          ))}

        </div>

      </ResponsiveDrawer>
    </div>
  );
}

export default RoleAdmin;
