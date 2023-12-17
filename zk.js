const EthscriptionsClass = require('./utils/EthscriptionsClass.js');
const {getRandomNumber, sleep} = require("./utils/common");
const pattern = /xxxxxx/g;

const DATA = 'data:,{"p":"zrc-20","op":"mint","tick":"sync","amt":"4"}'
const PROVIDER_URL = 'https://mainnet.era.zksync.io'
const SLEEP = 3

const instance = new EthscriptionsClass(PROVIDER_URL);

async function sendTransaction() {
    let startNone = await instance.getNonce();
    // let startNone = 473
    for (let j = 1; j <= 20; j++) {
        const randomNumber = await getRandomNumber(1, 21000);
        console.log('===================================================')
        const modifyData = DATA.replace(pattern, `${randomNumber}`);
        console.log(`Start Mint Data  = ${modifyData}`);
        const buffer = Buffer.from(modifyData, 'utf8');
        const hexData = buffer.toString('hex');
        // const hexData = '646174613a2c7b2270223a226272632d3230222c226f70223a226d696e74222c227469636b223a227a6b73796e6373222c22616d74223a2231303030227d'

        await instance.sendTransaction(hexData, startNone)
        startNone++
        await sleep(SLEEP)
    }
}

(async () => {
    await sendTransaction()
})();
