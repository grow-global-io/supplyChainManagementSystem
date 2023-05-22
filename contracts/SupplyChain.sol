// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@identity.com/gateway-protocol-eth/contracts/Gated.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract SupplyChain is Ownable, Gated {
    
    
    uint256 private so_ID;
    uint256 private start_so_ID;

    struct Order {
        string SoID;
        string PoID;
        string prodName;
        uint256 qty;
        uint256 orderValue;
        uint256 customerFinalDeliveryDate;
        string status;
        string barCode;
        string batchNo;
        string masterLabel;
        string invoicePath;
        string trackingNo;
    }

    mapping(string => Order) public orderData;
    Order[] public orders;
    mapping(address => string) public roles;
    event GetSoID(string _soId);


    constructor(uint256  gatekeeperNetwork) Gated(0xF65b6396dF6B7e2D8a6270E3AB6c7BB08BAEF22E, gatekeeperNetwork) {
        so_ID = 16532;
        start_so_ID = 16532;
    }

    /*****. Create Some Helper functions Start ***********/
    function getFirstChar(string memory _originString) internal pure returns (string memory){
        bytes memory firstCharByte = new bytes(1);
        firstCharByte[0] = bytes(_originString)[0];
        return string(firstCharByte);
    }

    function replacePoWithSo(string memory _string) internal pure returns (string memory) {
        bytes memory _stringBytes = bytes(_string);
        bytes memory result = new bytes(_stringBytes.length);

        for(uint i = 0; i < _stringBytes.length; i++) {
                result[i] = _stringBytes[i];
                if(i== 0)
                result[i]=bytes("S")[0];
        }
        return  string(result);
    } 

    function st2num(string memory numString) public pure returns(uint256) {
        uint  val=0;
        bytes   memory stringBytes = bytes(numString);
        for (uint  i =  0; i<stringBytes.length; i++) {
            uint exp = stringBytes.length - i;
            bytes1 ival = stringBytes[i];
            uint8 uval = uint8(ival);
           uint jval = uval - uint(0x30);
   
           val +=  (uint(jval) * (10**(exp-1))); 
        }
      return val;
    }
    /*****. Create Some Helper functions End ***********/

    
    /********* Assignes Role *********/
    function addRole(address _account, string memory role) external onlyOwner notNullAddress(_account) {
        roles[_account] = role;
    }

    /********* Get The assigned Role for you *********/
    function getRole() public view returns (string memory) {
        return roles[msg.sender];
    }


    /********* Create order done by SO only, returns the SO ID *********/
    function createOrder (string memory _prodName, uint256 _qty, uint256 _ordrVal, string memory _status) external onlySO {
        string memory _soId = string.concat("SO",Strings.toString(so_ID));
        Order memory order = Order({
            SoID: _soId,
            PoID: string.concat("PO",Strings.toString(so_ID)),
            prodName: _prodName,
            qty: _qty,
            orderValue: _ordrVal,
            customerFinalDeliveryDate: 0,
            status: _status,
            barCode:"",
            batchNo:"",
            masterLabel:"",
            invoicePath:"",
            trackingNo:""
        });
        orders.push(order);
        orderData[_soId] = order;
        so_ID+=1;
        emit GetSoID (_soId);
    }

    
    /*********Able to return order details by taking both SO or PO ********/
    function getOrderDetails(string memory _soOrPo) external view returns (Order memory) {
        if(keccak256(abi.encodePacked(getFirstChar(_soOrPo))) == keccak256(abi.encodePacked("S"))){
            return orderData[_soOrPo];
        }else{
            return orderData[replacePoWithSo(_soOrPo)];
        }
    }

    /********* select * from OrderTable *********/
    function getAllOrderDetails() external view onlySO returns (Order[] memory)  {
        
        uint256 totalOrderCount = so_ID; //16533
        uint256 currentIndex = 0; //0

        Order[] memory items = new Order[](so_ID-start_so_ID);
        
        for (uint256 i = start_so_ID; i < totalOrderCount; i++) { //16522 16533
            Order storage currentItem = orderData[string.concat("SO",Strings.toString(i))];
            items[currentIndex] = currentItem;
            currentIndex += 1;
            
        }
        return items;
    }
    
    
    /********* Can update multiple columns in a single go *********/
    function update(string calldata _so, string[] calldata colName, string[] calldata _value) external onlyInsider {
        
        for (uint i = 0; i < colName.length; i++) {

            if(keccak256(abi.encodePacked(colName[i])) == keccak256(abi.encodePacked("Status"))){
                orderData[_so].status = _value[i];
            }
            else if(keccak256(abi.encodePacked(colName[i])) == keccak256(abi.encodePacked("Customer Final Delivery Date"))){
                orderData[_so].customerFinalDeliveryDate = st2num(_value[i]);
            }
            else if(keccak256(abi.encodePacked(colName[i])) == keccak256(abi.encodePacked("BarCode"))){
                orderData[_so].barCode = _value[i];
            }
            else if(keccak256(abi.encodePacked(colName[i])) == keccak256(abi.encodePacked("BatchNo"))){
                orderData[_so].batchNo = _value[i];
            }
            else if(keccak256(abi.encodePacked(colName[i])) == keccak256(abi.encodePacked("Master Label"))){
                orderData[_so].masterLabel = _value[i];
            }
            else if(keccak256(abi.encodePacked(colName[i])) == keccak256(abi.encodePacked("Invoice Path"))){
                orderData[_so].invoicePath = _value[i];
            }
            else if(keccak256(abi.encodePacked(colName[i])) == keccak256(abi.encodePacked("Tracking No"))){
                orderData[_so].trackingNo = _value[i];
            }
        }
        
    }

    /****************  Access Modifiers ***************** */
    modifier onlySO(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Sales Representative")),"You are not a Sales Rep !!");
        _;
    }
    modifier onlyPO(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Purchase Order Agent")),"You are not a PO Agent !!");
        _;
    }
    modifier onlyWHM(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Ware House Manager")),"You are not a Ware House Manager !!");
        _;
    }
    modifier onlyFin(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Finance")),"You are not a Finance !!");
        _;
    }
    modifier onlyProduction(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Production manager")),"You are not a Production manager !!");
        _;
    }
    modifier onlyBM(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Batch Manager")),"You are not a Batch Manager !!");
        _;
    }
    modifier onlyLM(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked("Logistic Manager")),"You are not a Logistic Manager !!");
        _;
    }
    modifier onlyInsider(){
        require(keccak256(abi.encodePacked(roles[msg.sender])) != keccak256(abi.encodePacked("")),"You are not part of team yet !!");
        _;
    }
    modifier notNullAddress(address _account){
        require(_account != address(0),"Null account is coming from front-end !!");
        _;
    }
}
