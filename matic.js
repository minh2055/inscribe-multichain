const EthscriptionsClass = require('./utils/EthscriptionsClass.js');
const {getRandomNumber, sleep} = require("./utils/common");
const pattern = /xxxxxx/g;

const DATA = 'data:,{"a":"NextInscription","p":"oprc-20","op":"mint","tick":"anteater","amt":"100000000"}'
const PROVIDER_URL = 'https://polygon-mainnet.infura.io/v3/12efc8c77afc47688ec0b3efc4987c32'
// const PROVIDER_URL = 'https://polygon-mainnet.g.alchemy.com/v2/I8wMFs9wEJskBRgoTJmbqTt7VQ9KreT1'
const SLEEP = 3

const instance = new EthscriptionsClass(PROVIDER_URL);

async function sendTransaction() {
    let startNone = await instance.getNonce();

    for (let j = 1; j <= 1000; j++) {
        const randomNumber = await getRandomNumber(1, 2100000);
        console.log('===================================================')
        const modifyData = DATA.replace(pattern, `${randomNumber}`);
        console.log(`Start Mint Data  = ${modifyData}`);
        const buffer = Buffer.from(modifyData, 'utf8');
        const hexData = buffer.toString('hex');

        await instance.sendTransaction(hexData, startNone)
        startNone++
        await sleep(SLEEP)
    }
}

(async () => {
    console.log(`==============`)
    console.log(`Mint DATA =  ${DATA}`)
    console.log(`PROVIDER_URL = ${PROVIDER_URL}`)
    console.log(`SLEEP = ${SLEEP}`)
    console.log(`==============`)

    await sendTransaction()
})();
