const roleConfig = {

    "1": [
        {
            name: "Sales Representative",
        }
    ],
    "2": [
        {
            name: "Purchase Order Agent",
        }
    ],
    "3": [
        {
            name: "Product Manager",
        }
    ],
    "4": [
        {
            name: "Ware House Manager",
        }
    ],
    "5": [
        {
            name: "Finance",
        }
    ],
    "6": [
        {
            name: "Production manager",
        }
    ],
    "7": [
        {
            name: "Batch Manager",
        }
    ],
    "8": [
        {
            name: "Logistic Manager",
        }
    ]
}

export const getRole = (roleId) => roleConfig[roleId];
