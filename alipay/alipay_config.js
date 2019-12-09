let fs = require('fs');
let path =require('path');

// 这里配置基本信息
const AlipayBaseConfig = {
    appId: '2016101600696333', // 应用 ID
    privateKey: fs.readFileSync(path.join(__dirname, '../sandbox-pem/private_pem2048.txt'), 'ascii'), // 应用私钥
    alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhRbaV02t6RMxsLrIRkEt5HB9Zo8EUKgvpcDH5br1BBphuiZEOKwsHhegnlVnEHY4gCdkDsjNzNuhkEvAq9jAdvPz2Ua4lGWzqekd3K7WbJ70CYc4svLA6wHhxWTKm7upFvd274w0/+k/TdyUDXQwX1iPP4mnMqDHBROHkbGoSNGw9edr+T2DGnqYcsoRo4ZaihxhswIvBr531Wd3iJGGcYz0Bul1Mdkhv5VD/c6pfknYo1TnNa7lyF6EAsTUcP79Krm5ipVdBI87hub9CQxkccrz0AWsdSV8eSMCLRgDNfo9LJpf6FbsFAHVNKhVD308KfPFcunjmRuLp7ai+jlvNwIDAQAB', // 支付宝公钥
    gateway: 'https://openapi.alipaydev.com/gateway.do', // 支付宝的应用网关
    charset: 'utf-8',
    version: '1.0',
    signType: 'RSA2'
};

module.exports = {
    AlipayBaseConfig: AlipayBaseConfig,
}