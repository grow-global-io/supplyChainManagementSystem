// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SupplyChain is Initializable, ContextUpgradeable, OwnableUpgradeable {
    event ManufacturerAdded(address indexed _account);

    //product code
    uint256 public uid;
    uint256 sku;
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


    function initialize() public initializer {
        __Ownable_init();
        //owner = msg.sender;
        so_ID = 16532;
        start_so_ID = 16532;
        uid = 1;
    }

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


    function getRole() public view returns (string memory) {
        return roles[msg.sender];
    }

    function addRole(address _account, string memory role) external onlyOwner notNullAddress(_account) {
        roles[_account] = role;
    }

    function createOrder (string memory _prodName, uint256 _qty, uint256 _ordrVal, string memory _status) external onlySO{
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
    }

    
    //Able to return order details by taking both SO or PO 
    function getOrderDetails(string memory _soOrPo) external view returns (Order memory) {
        if(keccak256(abi.encodePacked(getFirstChar(_soOrPo))) == keccak256(abi.encodePacked("S"))){
            return orderData[_soOrPo];
        }else{
            return orderData[replacePoWithSo(_soOrPo)];
        }
    }
    function getTest() public view returns(uint256){
        return so_ID-start_so_ID;
    }

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
    
    function updateStatus(string memory _so, string memory _status) external onlyInsider {
        orderData[_so].status = _status;
    }

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
