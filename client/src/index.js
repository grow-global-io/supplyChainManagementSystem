import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import { WagmiConfig, configureChains, chain, createClient } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {
    RainbowKitProvider,
    connectorsForWallets,
    wallet,
    darkTheme
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import * as serviceWorker from './serviceWorker';


const { chains, provider } = configureChains(
    [chain.polygonMumbai, chain.polygon],
    [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
)

// const {connectors} = getDefaultWallets({
//   appName: "My App",
//   chains
// })

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

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

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
