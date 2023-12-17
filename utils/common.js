const {Web3} = require('web3')

module.exports = {
    getRandomNumber: async function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    sleep: async function (seconds) {
        console.log('Send transaction success,sleep 3s ...');
        const milliseconds = seconds * 1000;
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    },
    getRandomString: async function () {
        const randomIndex = Math.floor(Math.random() * 26)
        return String.fromCharCode(97 + randomIndex)
    },
    hexToUtf8: function (hexData) {
        return Buffer.from(hexData, 'hex').toString('utf-8')
    },
    extractedIds: function (data) {
        try {
            const jsonData = decodeURIComponent(data.split('data:,')[1]);
            const parsedData = JSON.parse(jsonData);
            return parseInt(parsedData.id);
        } catch (e) {
            return 0;
        }
    },
    getRandomItemsFromArray: async function (array, numberOfItems) {
        const randomItems = [];

        while (randomItems.length < numberOfItems && array.length > 0) {
            const randomIndex = Math.floor(Math.random() * array.length);
            const randomItem = array.splice(randomIndex, 1)[0];
            randomItems.push(randomItem);
        }

        return randomItems;
    }

};
