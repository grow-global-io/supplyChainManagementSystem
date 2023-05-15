export const networkConfig = {
    "80001": [
        {
            suppChainAddress: "0xd561813541dDd402cfA6de6E0D68c1b735fF9f3d", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },
    ],
}

export const getConfigByChain = (chain) => networkConfig[chain]

