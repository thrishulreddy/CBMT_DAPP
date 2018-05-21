import "../stylesheets/app.css";
// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import cbmt_artifacts from '../../build/contracts/CBMT.json'
var CBMT = contract(cbmt_artifacts);
window.getToken = function(currency, give) {
  let curr = $("#fromCurrency").val()+"T";
  let val = $("#amt").val();
console.log("curr is" + curr);
console.log("val is" + val);
  try {
    $("#msg1").html("Tokens have been requested. Please wait.")
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    CBMT.deployed().then(function(contractInstance) {
      contractInstance.getToken(curr, val, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        return contractInstance.getToken.call(curr, val).then(function(v) {
        console.log("string is" + v.toString());
         $("#get").val(v.toString());
          $("#msg1").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}
window.getBalance = function(currency) {
  let currBal = $("#fromCurrency").val()+"T";
  console.log("currBal passed is" + currBal);
  try {
    $("#msg2").html("Balance has been requested. Please wait.")
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    CBMT.deployed().then(function(contractInstance) {
      contractInstance.getBalance(currBal, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        return contractInstance.getBalance.call(currBal).then(function(v) {
        console.log("balance is" + v.toString());
        $("#balance").val(v.toString());
          $("#msg2").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}
window.getRate = function(frmCur, toCur,urlRate){
  let fromCurr = $("#fromCurrency").val();
  let toCurr = $("#toCurrency").val();
  let url = "http://free.currencyconverterapi.com/api/v5/convert?q="+fromCurr+"_"+toCurr+"&compact=y";
console.log("url is" + url);
console.log("fromCurr  is" + fromCurr);
try {
    $("#msg3").html("Rate has been requested. Please wait.")
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    CBMT.deployed().then(function(contractInstance) {
      contractInstance.getRate(fromCurr, toCurr, url, {gas: 150000, from: web3.eth.accounts[0]}).then(function() {
        return contractInstance.getRate.call(fromCurr,toCurr,url).then(function(v) {
          console.log("get Rate called");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}
window.getUprice = function(){
try {
    $("#msg3").html("Rate has been requested. Please wait.")
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
CBMT.deployed().then(function(contractInstance) {
      contractInstance.uprice.call().then(function(v) {
        console.log("rate is" + v.toString());
        $("#rate").val(v.toString());
          $("#msg3").html("");
        });
      });
  } catch (err) {
    console.log(err);
  }
}
window.transfer = function(send, frmCurr,toCurr,rate,toAdd) {
  let fCurr = $("#fromCurrency").val()+"T";
  let tCurr = $("#toCurrency").val()+"T";
  let sendAmt = $("#send").val();
  let uPrice = $("#rate").val();
  let toRec = sendAmt/uPrice;
  let toAddress = $("#toAddress").val();
console.log("amt is" + sendAmt);
console.log("toRec is" + toRec);
  try {
    $("#msg1").html("Tokens have been requested. Please wait.")
    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    CBMT.deployed().then(function(contractInstance) {
      contractInstance.TransferMoney(toAddress, sendAmt, fCurr, tCurr,toRec, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        return contractInstance.TransferMoney.call(toAddress,sendAmt,fCurr,tCurr,toRec).then(function(v) {
        console.log("Amount has been transferred");
        $("#received").val(toRec);
          $("#msg1").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}
$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  CBMT.setProvider(web3.currentProvider);
  let currency = $("#fromCurrency").val()+"T";
//  let toCurrency = $("#toCurrency").val();
    CBMT.deployed().then(function(contractInstance) {
      contractInstance.getBalance.call(currency).then(function(v) {
        $("#balance").val(v.toString());
      });
   })
   CBMT.deployed().then(function(contractInstance) {
      contractInstance.uprice.call().then(function(v) {
        console.log("rate is" + v.toString());
        $("#rate").val(v.toString());
          $("#msg3").html("");
        });
      });
});
