require('dotenv').config();

const EthscriptionsClass = require('./utils/EthscriptionsClass.js');
const FlipsidecryptoClass = require('./utils/FlipsidecryptoClass.js');
const {sleep, getRandomItemsFromArray} = require("./utils/common");
const PROVIDER_URL = 'https://mainnet.infura.io/v3/8cab0868234c4848a8324cb56fd5126f'
const SLEEP = 3
const pattern = /xxxxxx/g;

// =========================
const TICKET = 'PERI'
const LIMIT = 21000
const DATA = `data:,{"p":"erc-20","op":"mint","tick":"${TICKET}","id":"xxxxxx","amt":"1000"}`
const DATA_CHECK = `data:,{"p":"erc-20","op":"mint","tick":"${TICKET}"`

const instance = new EthscriptionsClass(PROVIDER_URL);
const Flipsidecrypto = new FlipsidecryptoClass(LIMIT)

async function checkAvailability(dataHex) {
    // url = f"https://eth-script-indexer-eca25c4cf43b.herokuapp.com/api/ethscriptions/exists/{sha256_hash}"
    console.log('Start checkAvailability = ', dataHex);
    const hash = await sha256(dataHex)
    const baseURrl = 'https://ethscriber.xyz/api/ethscriptions/exists'
    try {
        const response = await fetch(`${baseURrl}/${hash}`);
        const data = await response.json();
        return {
            isTaken: data.result, ownerAddress: data.ethscription?.current_owner || null,
        };
    } catch (e) {
        console.log(e)
        console.log('call api fail error code = ' + e.code)
        console.log('call api fail error code = ' + e.message)
        return true
    }
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

async function getAvailableIds() {
    try {
        console.log(`Start getAvailableIds Data  = ${DATA_CHECK}`);
        const buffer = Buffer.from(DATA_CHECK, 'utf8');
        const hexData = '0x' + buffer.toString('hex');
        const sql = `SELECT INPUT_DATA
                     FROM ethereum.core.fact_transactions
                     WHERE ETH_VALUE = 0
                       AND BLOCK_TIMESTAMP > TIMESTAMP '2023-06-10'
                       AND INPUT_DATA LIKE '${hexData}%'
                     GROUP BY INPUT_DATA LIMIT ${LIMIT}`

        return await Flipsidecrypto.getAvailableIds(sql)
    } catch (e) {
        console.log(e)
    }

    return []
}

async function sendTransaction() {
    let startNone = await instance.getNonce();
    const listAvailableIds = await getAvailableIds()
    let countMintedSuccess = 0
    let LIMIT_MINT = 5
    for (const randomId of listAvailableIds) {
        console.log('===================================================')
        if (countMintedSuccess >= LIMIT_MINT) {
            console.log('++++++ ALL MINTED SUCCESS ++++++++')
            return;
        }
        const modifyData = DATA.replace(pattern, `${randomId}`);
        const {isTaken, ownerAddress} = await checkAvailability(modifyData)
        if (isTaken) {
            console.log(`Id  = ${randomId} already minted by ${ownerAddress}`);
            continue
        }

        console.log(`Start Mint Data  = ${modifyData}`);
        const buffer = Buffer.from(modifyData, 'utf8');
        const hexData = buffer.toString('hex');


        await instance.sendTransaction(hexData, startNone)
        startNone++
        countMintedSuccess++
        await sleep(SLEEP)
    }
}

(async () => {
    // console.log(await getAvailableIds(10))
    await sendTransaction()
})();
