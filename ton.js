const TonWeb = require("tonweb");
const TonWebMnemonic = require("tonweb-mnemonic");
const apiKey = 'your api Key'
const RPC = 'https://toncenter.com/api/v2/jsonRPC'
// const RPC = 'https://go.getblock.io/9c7ed4b52939416586ebfcd284ce220e'

const tonweb = new TonWeb(new TonWeb.HttpProvider(RPC, {
    headers: {
        'Authorization': `Bearer ${apiKey}`
    }
}));

const SEED_PHASE = 'sponsor there hurt suspect network glove science brand sentence aim perfect humble crouch piano aerobic aunt horn future allow kind practice modify ramp label';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const init = async (num) => {
    const seed = await TonWebMnemonic.mnemonicToSeed(SEED_PHASE.split(' '));
    const keyPair = TonWeb.utils.keyPairFromSeed(seed);

    const WalletClass = tonweb.wallet.all.v4R2;

    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey
    });
    const hotWalletAddress = await wallet.getAddress();
    const hotWalletAddressString = hotWalletAddress.toString(true, false, false);
    console.log('My HOT wallet is ', hotWalletAddressString);

    // const seqno = await wallet.methods.seqno().call();
    // console.log('seqno: ', seqno);

    const seqno = await getSeqNo()
    await sleep(3000)
    for (let i = 0; i < num; i++) {
        const toAddress = 'your address'; // Ensure correct address format
        const payload = 'data:application/json,{"p":"ton-20","op":"mint","tick":"dedust.io","amt":"1000000000"}';

        const transfer = await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: toAddress,
            amount: TonWeb.utils.toNano('0'),
            seqno: seqno + i,
            payload: payload
        });
        try {
            console.log(await transfer.send(), seqno + i);
            await sleep(30000);
        } catch (e) {
            console.log('retry ' + e)
        }
    }
}

async function getSeqNo() {
    try {
        const seed = await TonWebMnemonic.mnemonicToSeed(SEED_PHASE.split(' '));
        const keyPair = TonWeb.utils.keyPairFromSeed(seed);

        const WalletClass = tonweb.wallet.all.v4R2;

        const wallet = new WalletClass(tonweb.provider, {
            publicKey: keyPair.publicKey
        });

        const seqno = await wallet.methods.seqno().call();
        console.log('seqno:', seqno);
        return seqno
    } catch (error) {
        console.error('Error fetching seqno:', error);
    }
}

// getSeqNo();
//
init(10);
