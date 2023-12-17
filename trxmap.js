const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const {getRandomNumber, sleep} = require("./utils/common");
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const privateKey = ""; // your private key
const blackHole = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";  // black hole address

// const memo = 'data:,6868.trxmap';

async function main(i) {
    let memo = `data:,${i}.trxmap`;
    console.log('start mint = ' + memo)
    const unSignedTxn = await tronWeb.transactionBuilder.sendTrx(blackHole, 1); //0.000001 TRX is the minimum transfer amount.
    const unSignedTxnWithNote = await tronWeb.transactionBuilder.addUpdateData(unSignedTxn, memo, 'utf8');
    const signedTxn = await tronWeb.trx.sign(unSignedTxnWithNote);
    // console.log("signed =>", signedTxn);
    const ret = await tronWeb.trx.sendRawTransaction(signedTxn);
    // console.log("broadcast =>", ret);
    console.log("txid =>", ret.txid);
}

const runMainMultipleTimes = async () => {
    const cacheNumber = [];

    try {
        for (let i = 1; i < 400; i++) { // mint 400 times
          let randomNumber;
          do {
             randomNumber = await getRandomNumber(99, 99999); // mint trxmap random 3,4,5 digests
          } while (cacheNumber.includes(randomNumber));
          cacheNumber.push(randomNumber);

          await main(randomNumber);
          const milliseconds = 3000; // sleep 3s
          await new Promise(resolve => setTimeout(resolve, milliseconds));
        }
    } catch (err) {
        console.error("Error during execution:", err);
    }
};

runMainMultipleTimes();
