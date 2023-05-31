export const networkConfig = {
    "80001": [
        {
            //suppChainAddress: "0xd561813541dDd402cfA6de6E0D68c1b735fF9f3d", //proxy deployment
            suppChainAddress: "0x1FcCdb329C8a8eBEf72046561b64D848cC68aC78", //non proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai",
            gatekeeperNetwork: "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6" //testing
            //gatekeeperNetwork:"ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6" //original
        },
    ],
    "137": [
        {
            //suppChainAddress: "0xd561813541dDd402cfA6de6E0D68c1b735fF9f3d", //proxy deployment
            suppChainAddress: "0x8a1c6D06b412eE35BF2edB8a5884df48a1a763c3", //non proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai",
            gatekeeperNetwork: "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6" //testing
            //gatekeeperNetwork:"ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6" //original
        },
    ],
    "51": [
        {
            suppChainAddress: "0x25Bea65a0d084707E2aBf90163364343cf8da00E", //non proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "Apothem",
            networkName: "XDC TestNet",
            gatekeeperNetwork: "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6"
        },
    ],
}

export const getConfigByChain = (chain) => networkConfig[chain]

