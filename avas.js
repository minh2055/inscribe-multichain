const EthscriptionsClass = require('./utils/EthscriptionsClass.js');
const {getRandomNumber, sleep} = require("./utils/common");
const pattern = /xxxxxx/g;

const DATA = 'data:,{"p":"asc-20","op":"mint","tick":"avav","amt":"69696969"}'
const PROVIDER_URL = 'https://avalanche.blockpi.network/v1/rpc/public'
// const PROVIDER_URL = 'https://filecoin-mainnet.chainstacklabs.com/rpc/v1'
const SLEEP = 3

const instance = new EthscriptionsClass(PROVIDER_URL);

async function sendTransaction() {
    let startNone = await instance.getNonce();
    // if (!startNone) {
    //     console.log(`none not found`);
    //     return
    // }
    // let startNone = 45
    for (let j = 1; j <= 10; j++) {
        const randomNumber = await getRandomNumber(1, 21000);
        console.log('===================================================')
        const modifyData = DATA.replace(pattern, `${randomNumber}`);
        console.log(`Start Mint Data  = ${modifyData}`);
        const buffer = Buffer.from(modifyData, 'utf8');
        const hexData = buffer.toString('hex');
        console.log(hexData)
        const custom_data = {chainId: 43114} // filecoin
        await instance.sendTransaction(hexData, startNone, custom_data)
        startNone++
        await sleep(SLEEP)
    }
}

(async () => {
    await sendTransaction()
})();
