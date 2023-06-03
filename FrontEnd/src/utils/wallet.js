import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { getAuthProvider } from "./getArcanaAuth";
import { ArcanaConnector } from "@arcana/auth-wagmi";

export const GrowWalletConnector = ({ chains }) => {
  return {
    id: "arcana-auth",
    name: "Grow Wallet",
    iconUrl: "https://nftmarketcover.infura-ipfs.io/ipfs/QmdyenW8VPWRN8T1xJGi7cvPsmQPo8nv9Lujf4m4skM9AE",
    iconBackground: "",
    createConnector: () => {
      const connector = new ArcanaConnector({
        chains,
        options: {
	  auth: getAuthProvider(),
        }
      });
      return {
        connector,
      };
    },
  };
};

const connectors = (chains) =>
  connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        GrowWalletConnector({ chains })
        , metaMaskWallet({ chains })
      ],
    },
  ]);

export { connectors };
