export const networkConfig = {
    "80001": [
        {
            suppChainAddress: "0x10c75f53ce6807D6DEd902638eA035BEC95a4c1a", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },
    ],
}

export const getConfigByChain = (chain) => networkConfig[chain]

