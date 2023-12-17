const {Flipside} = require("@flipsidecrypto/sdk");
const {hexToUtf8, extractedIds} = require("./common");


const FLIPSIDE_URL = 'https://api-v2.flipsidecrypto.xyz'
const API_FLIPSIDE_KEY = process.env.API_FLIPSIDE_KEY


class FlipsidecryptoClass {
    constructor(limit) {
        this.limit = limit
    }

    async getAvailableIds(sql) {
        try {
            const flipside = new Flipside(API_FLIPSIDE_KEY, FLIPSIDE_URL);
            const queryResultSet = await flipside.query.run({sql: sql});
            const hexArray = queryResultSet.rows

            const utf8Array = hexArray.map(hex => hexToUtf8(hex[0].substring(2)))
            const listMintedIDs = utf8Array.map(data => extractedIds(data))
            const defaultIDs = Array.from({length: this.limit}, (_, index) => index + 1);
            const difference = defaultIDs.filter(item => listMintedIDs.indexOf(item) === -1);

            console.log('getAvailableIds length = ' + difference.length)

            return difference;
        } catch (e) {
            console.log(e)
        }

        return []
    }
}

module.exports = FlipsidecryptoClass;
