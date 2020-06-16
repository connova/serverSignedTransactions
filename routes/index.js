var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {

  const Web3 = require('web3');
  var Tx = require('ethereumjs-tx').Transaction;
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  var accounts = await web3.eth.getAccounts();
  console.log('Accounts: ', accounts)

  const contractAddress = '0xad8DcA7271a8d3f4c9921Bb77e96fcAf512b0509';
  const ABI = require('./mycontract.json');
  const account = '0xFdF23657Ceb827b9F959893C7811b0e0403666dA';
  const privateKey = Buffer.from('97963a0519a9a9611d85e53f2f8a474b8e1dc006a44fdf410c92063fb68a15be', 'hex');
  const newAddress = '0x5aB5E52245Fd4974499aa625709EE1F5A81c8157';
  
  var TestContract = new web3.eth.Contract(ABI, contractAddress);
  const _data = TestContract.methods.setOwner(newAddress).encodeABI();
  
  _nonce = await web3.eth.getTransactionCount(account)
  var rawTx = {
    nonce: _nonce,
    gasPrice: '0x20000000000',
    gasLimit: '0x27511',
    to: contractAddress,
    value: 0,
    data: _data
   }

  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  var _receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  console.log('Receipt: ', _receipt);


  res.render('index', { title: 'Express', receipt: JSON.stringify(_receipt) });
});

module.exports = router;
