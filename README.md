## ⚠️⚠️⚠️ Disclaimer ⚠️⚠️⚠️

Tất cả các thao tác đều thực hiện và chạy dưới local, chú ý quản lý private key wallet.

## 1. Yêu cầu cần có

#### 1.1 Cài đặt NodeJS

Vui lòng truy cập [https://nodejs.org/en/download](https://nodejs.org/en/download) và làm theo hướng dẫn cài đặt.

#### 1.2 Recommend

Source Code tương thích với MacOS hoặc Linux (Ubuntu) hơn Window.

Nếu chạy trên Window thì cài đặt WSL2 (giả lập môi trường Ubuntu trên Window) để chạy code.

## 2. Cấu hình môi trường

#### 2.1 Config file ENV 

Tạo file `.env` với key như file `.env.example` như sau:
```
PRIVATE_KEY= <địa chỉ private_key của ví thực hiện ký giao dịch>
RECIEPT_ADDRESS= <địa chỉ public address của ví nhận inscription, nên là địa chỉ của ví ký giao dịch>
```

#### 2.2 Config RPC Node Provider

Về RPC thì trong các file đều có sẵn rồi, tuy nhiên chạy giống nhau hay bị dính Limit.

Do đó, ae chủ động đăng ký và dùng 1 bộ RPC cho riêng tool của mình. Đăng ký free RPC của 1 trong những nhà cung cấp dưới đấy:
```
Alchemy: https://dashboard.alchemy.com/
Infura: https://app.infura.io/
ANKR: https://www.ankr.com/
...
```

## 3. Run

Step 1: Mở cửa sổ Terminal và `cd` đến đường dẫn thư mục Tool

Step 2: Run `npm install`

Step 3: Tùy theo từng mạng chạy lệnh tương ứng. Ví dụ:
- Mint trên ETH: `node eth.js`
- Mint trên Polygon: `node matic.js`
- Mint trxmap trên Tron: `node trxmap.js`
...

## 4. Note

#### 4.1 Private Key

Private Key trong file `.env` chỉ dùng cho các mạng EVM (những ví dùng Metamask).

Còn những mạng Non-EVM thì Private Key sẽ được điền ngày trong file code (ví dụ file `trxmap.js` mạng Tron, file `celestia` mạng Celestia)

#### 4.2 Sleep

Mặc định sẽ set 3s mint 1 lần.

Tuy nhiên, tùy tình trạng mạng và mức độ Fomo nên ae chủ động thay đổi thông số này lên 20-30s trong từng file code ở chỗ `const SLEEP =3` để không bị chết ví

#### 4.3 Gas Price

Bot sẽ lấy gas tự động và tăng lên 5%.

Tương tự như Sleep ae có thể chủ động thay đổi tăng giảm trong file
`utils/EthscriptionsClass.js` ở function `getGasPrice`

#### 4. 4 Repeat Mint trên 1 lệnh chạy

Bot sẽ tự động Repeat mint 100 hoặc 1000 lần tùy theo từng mạng (ví dụ Polygon hay BSC mint 1000 lần thì vô tư do Gas rẻ nhưng trên ETH thì cần phải cân nhắc lại)

Anh em cũng chủ động chỉnh sửa cho phù hợp với nhu cầu của mình bằng cách tìm dòng ` for (let j = 1; j <= 1000; j++)` và đổi 1000 thành số lần mình muốn Repeat

#### Other

Join Discord tạo ticket hoặc thảo luận trên box nếu bạn cần hỗ trợ: https://discord.gg/z4rXJdcstq

