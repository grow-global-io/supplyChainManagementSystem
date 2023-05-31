import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as CONSTANTS from './constants'
import "bootstrap/dist/css/bootstrap.min.css";
import { WagmiConfig, configureChains, chain, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { getConfigByChain } from "../src/assets/config";
import {
    RainbowKitProvider,
    connectorsForWallets,
    wallet,
    darkTheme
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import * as serviceWorker from './serviceWorker';
import { useAccount } from 'wagmi'
import { Wallet } from 'ethers'
import { GatewayProvider, IdentityButton, ButtonMode } from "@civic/ethereum-gateway-react";


const xdcMainnet = {
    id: CONSTANTS.XdcMainnet.ID,
    name: CONSTANTS.XdcMainnet.NAME,
    network: CONSTANTS.XdcMainnet.NETWORK,
    iconUrl: CONSTANTS.XdcMainnet.ICONURL,
    iconBackground: CONSTANTS.XdcMainnet.ICON_BG,
    nativeCurrency: {
        decimals: CONSTANTS.XdcMainnet.NATIVECURRENCT_NAME,
        name: CONSTANTS.XdcMainnet.NATIVECURRENCT_NAME,
        symbol: CONSTANTS.XdcMainnet.NATIVECURRENCT_SYMBOLS,
    },
    rpcUrls: {
        default: CONSTANTS.XdcMainnet.NATIVECURRENCT_RPCURL_DEFAULT,
    },
    blockExplorers: {
        default: {
            name: CONSTANTS.XdcMainnet.NATIVECURRENCT_BLOCKEXPLORER_DEFAULT_NAME,
            url: CONSTANTS.XdcMainnet.NATIVECURRENCT_BLOCKEXPLORER_DEFAULT_URL,
        },
    },
    testnet: CONSTANTS.XdcMainnet.TESTNET,
}

const XdcTestNet = {
    id: CONSTANTS.XdcTestNet.ID,
    name: CONSTANTS.XdcTestNet.NAME,
    network: CONSTANTS.XdcTestNet.NETWORK,
    iconUrl: CONSTANTS.XdcTestNet.ICONURL,
    iconBackground: CONSTANTS.XdcTestNet.ICON_BG,
    nativeCurrency: {
        decimals: CONSTANTS.XdcTestNet.NATIVECURRENCT_NAME,
        name: CONSTANTS.XdcTestNet.NATIVECURRENCT_NAME,
        symbol: CONSTANTS.XdcTestNet.NATIVECURRENCT_SYMBOLS,
    },
    rpcUrls: {
        default: CONSTANTS.XdcTestNet.NATIVECURRENCT_RPCURL_DEFAULT,
    },
    blockExplorers: {
        default: {
            name: CONSTANTS.XdcTestNet.NATIVECURRENCT_BLOCKEXPLORER_DEFAULT_NAME,
            url: CONSTANTS.XdcTestNet.NATIVECURRENCT_BLOCKEXPLORER_DEFAULT_URL,
        },
    },
    testnet: CONSTANTS.XdcTestNet.TESTNET,
}

const { chains, provider } = configureChains(
    [//chain.polygonMumbai, 
        // chain.polygon, 
        //xdcMainnet,
        XdcTestNet],
    [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
)

// const {connectors} = getDefaultWallets({
//   appName: "My App",
//   chains
// })

const Content = () => {
    const { address, isConnected } = useAccount()
    return <>
        {isConnected && <IdentityButton mode={ButtonMode.LIGHT} animation={true} />}
    </>
}

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            wallet.rainbow({ chains }),
            wallet.walletConnect({ chains }),
            wallet.metaMask({ chains }),
            wallet.trust({ chains }),
            wallet.argent({ chains }),
            wallet.coinbase({ appName: 'My App', chains }),
            wallet.brave({ chains }),
            wallet.omni({ chains }),
            wallet.imToken({ chains }),
            wallet.ledger({ chains }),

        ],
    },
])

const useWallet = (Wallet) => {
    const { connector } = useAccount();
    const [wallet, setWallet] = useState();
    useEffect(() => {
        if (!connector) return;
        connector.getSigner().then(setWallet);
    }, [connector]);

    return wallet;
}

const Gateway = () => {
    const wallet = useWallet();
    if (!wallet) return <><Content /></>

    return <GatewayProvider gatekeeperNetwork={getConfigByChain(80001)[0].gatekeeperNetwork}
        wallet={wallet}
    >
        <Content />
    </GatewayProvider>
}

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

//const { chain } = useNetwork()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                theme={darkTheme()}
                coolMode
                showRecentTransactions={true}
            >
                <App />

            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
