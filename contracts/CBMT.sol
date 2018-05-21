pragma solidity ^0.4.17;
//import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
import "./usingOraclize.sol";

contract CBMT is usingOraclize {

    mapping(string => bool) currencies;
    bytes32[] currencies_list;
    mapping (uint256 => tran) _trans;
    bool public called = false;
    uint pricePosition = 0;
    uint256 public uprice;
    mapping (address => mapping (string => uint256)) _balances;
    mapping (uint256 => tran) _toTransfer;

    event Transferred(address from, address to, string sourceCurrency, uint value, string destCurrency, uint received);

    struct tran {
        uint256 id;
        address to;
        bytes32 sourceCurrency;
        bytes32 destCurrency;
        bytes32 value;
        bytes32 conversionRate;
        bool completed;
    }

    function CBMT() public {
        addNewCurrency("USDT");
        addNewCurrency("INRT");
        addNewCurrency("EURT");
        addNewCurrency("RUBT");
    }

    function addNewCurrency(string currency) public returns(bool) {
        require (!currencies[currency]);
        currencies[currency] = true;
        currencies_list.push(stringToBytes32(currency));
        return true;
    }

    function getBalance(string currency) view public returns(uint256) {
        require (currencies[currency]);
        return _balances[msg.sender][currency];
    }

    function getToken(string currency, uint256 value) public returns(uint256) {
       require (value>=0);
       require (currencies[currency]);
       _balances[msg.sender][currency] += value;
       return _balances[msg.sender][currency];
    }

    function updatePricePosition(uint p) public returns(bool) {
        pricePosition = p;
    }

    function viewCurrencies() view public returns(bytes32[]) {
        return currencies_list;
    }

    function TransferMoney(address to, uint256 value, string sourceCurrency, string destCurrency, uint to_receive) public returns(bool){
        require(currencies[sourceCurrency]);
        require(currencies[destCurrency]);
        require(_balances[msg.sender][sourceCurrency] >= value);
        // http://free.currencyconverterapi.com/api/v5/convert?q=USD_INR&compact=y
        // string memory URL = strConcat("http://free.currencyconverterapi.com/api/v5/convert?q=", destCurrency, "_", sourceCurrency, "&compact=y");
        // getRate(sourceCurrency, destCurrency, URL);
        // uint to_receive = value/rate;
        _balances[msg.sender][sourceCurrency] -= value;
        _balances[to][destCurrency] += to_receive;
        Transferred(msg.sender, to, sourceCurrency, value, destCurrency, to_receive);
    }

    function __callback(bytes32 myid, string result) public {
        //if (msg.sender != oraclize_cbAddress()) throw;
        called = true;
        uprice = parseInt(result,pricePosition);
    }


    function getRate(string sourceCurrency, string destCurrency, string URL) public payable {
        //string memory sCur;
        //string memory dCur;
        //sCur = bytes32ToString(sourceCurrency);
        //dCur = bytes32ToString(destCurrency);
        //newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
        oraclize_query("URL", URL);
    }

    function isExists(string[] _arr, string _what) pure private returns (bool) {
        for (uint i = 0; i < _arr.length; i++) {
            if (keccak256(_arr[i]) == keccak256(_what)) {
                return true;
            }
        }
        return false;
    }

    function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function bytes32ToString(bytes32 x) public pure returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
           return 0x0;
        }

        assembly {
           result := mload(add(source, 32))
        }
    }
}
