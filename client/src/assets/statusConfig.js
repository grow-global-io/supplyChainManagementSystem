const statusConfig = {
    "1": [
        {
            name: "Order Received",
        }
    ],
    "2": [
        {
            name: "Looking for Vendor Acceptance",
        }
    ],
    "3": [
        {
            name: "Vendor Accepted",
        }
    ],
    "4": [
        {
            name:"Fullfilled"
        }
    ],
    "5": [
        {
            name:"Ready for Production"
        }
    ],
    "6": [
        {
            name:"Ready for Batching"
        }
    ],
    "7": [
        {
            name:"Ready for Customer Delivery"
        }
    ],
    "8": [
        {
            name:"Ready for Invoice"
        }
    ],
    "9": [
        {
            name:"Paid"
        }
    ],
    "10": [
        {
            name:"Completed"
        }
    ]  
}

export const getStatus = (statusId) => statusConfig[statusId];
