require('dotenv').config();
const {ethers} = require('ethers');
const {Web3} = require('web3');
const privateKey = process.env.PRIVATE_KEY;
const recipientAddress = process.env.RECIEPT_ADDRESS;

ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.DEBUG);
class EthscriptionsClass {
    constructor(providerUrl) {
        this.providerUrl = providerUrl;
        this.provider = new ethers.providers.JsonRpcProvider(
            providerUrl
        );
        this.wallet = new ethers.Wallet(privateKey, this.provider);
    }

    async callRequest(data) {
        try {
            console.log('Transaction start nonce = ', data.nonce);
            const sentTransaction = await this.wallet.sendTransaction(data);
            console.log('Transaction sent:', sentTransaction.hash);
        } catch (e) {
            console.log('call api fail error code = ' + e.code)
            console.log('call api fail error code = ' + e.message)
            if (e.code === 'SERVER_ERROR') {
                console.log('[SERVER_ERROR] Try recall ...')
                await this.callRequest(data)
            }
        }
    }

    async getNonce() {
        try {
            console.log('providerUrl = ', this.providerUrl)
            const web3 = new Web3(this.providerUrl);
            const count = await web3.eth.getTransactionCount(recipientAddress, 'pending')
            console.log('Get nonce success, start nonce = ' + count);
            return count;
        } catch (e) {
            console.log('call get nonce error ', e.code)
            if (e.code === 'ERR_SOCKET_CONNECTION_TIMEOUT') {
                console.log('Try recall ...')
                return await this.getNonce()
            }
        }
    }

    async getGasPrice() {
        try {
            const currentGasPrice = await this.provider.getGasPrice();
            const increasedGasPrice = currentGasPrice.mul(105).div(100); // Increase by 105 = 5%
            // const increasedGasPrice = currentGasPrice.mul(110).div(100); // Increase by 110 = 10%
            console.log('Current gasPrice = ' + (currentGasPrice / 1000000000).toFixed(2))
            console.log('Increased gasPrice = ' + (increasedGasPrice / 1000000000).toFixed(2))
            return increasedGasPrice
        } catch (e) {
            console.log('getGasPrice Error, Try recall ..., e = ' + e)
            return await this.getGasPrice()
        }
    }

    async sendTransaction(hexData, customNonce) {
        const transaction = {
            to: recipientAddress, value: ethers.utils.parseEther('0'), // No Ether value being sent (optional)
            data: '0x' + hexData,
        };
        try {
            const gasPrice = await this.getGasPrice()
            const overrides = {
                gasPrice: gasPrice,
                nonce: parseInt(customNonce),
            };
            const data = {...transaction, ...overrides}
            await this.callRequest(data)
        } catch (e) {
            console.log('sendTransaction ERROR e = ' + e)
        }
    }
}

module.exports = EthscriptionsClass;
