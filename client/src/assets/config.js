export const networkConfig = {
    "80001": [
        {
            suppChainAddress: "0x73b586295c2b754043a701F4c31d72bA7e8fB6AB", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },
    ],
}

export const getConfigByChain = (chain) => networkConfig[chain]

