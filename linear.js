const EthscriptionsClass = require('./utils/EthscriptionsClass.js');
const {getRandomNumber, sleep} = require("./utils/common");
const pattern = /xxxxxx/g;

const DATA = 'data:application/json,{"p":"lins-20","op":"mint","tick":"lins","amt":"1000","nonce":"xxxxxx"}'
const PROVIDER_URL = 'https://linea.drpc.org'
// const PROVIDER_URL = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1'
const SLEEP = 60

const instance = new EthscriptionsClass(PROVIDER_URL);

async function sendTransaction() {
    let startNone = await instance.getNonce();
    
    for (let j = 1; j <= 10; j++) {
        const timestamp = Date.now();
        console.log('timestamp = ' + timestamp);
        const randomNumber = await getRandomNumber(1, 21000);
        console.log('===================================================')
        const modifyData = DATA.replace(pattern, `${timestamp}`);
        console.log(`Start Mint Data  = ${modifyData}`);
        const buffer = Buffer.from(modifyData, 'utf8');
        const hexData = buffer.toString('hex');
        console.log(hexData)
        // const custom_data = {chainId: 314} // filecoin
        await instance.sendTransaction(hexData, startNone)
        startNone++
        await sleep(SLEEP)
    }
}

(async () => {
    await sendTransaction()
})();
