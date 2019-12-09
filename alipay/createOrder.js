const AlipaySDK = require("alipay-sdk").default;
const path = require('path');
const alipayConfig = require(path.join(__dirname, './alipay_config.js'));
const alipay = new AlipaySDK(alipayConfig.AlipayBaseConfig)
const AlipayFormData = require('alipay-sdk/lib/form').default;
async function createOrder(goods) {
    let method = 'alipay.trade.page.pay'; // 统一收单下单并支付页面接口
    // 根据官方给的 API 文档提供的一个参数集合
    let bizContent = {
        out_trade_no: Date.now(), // 根据时间戳来生成一个订单号,
        product_code: 'FAST_INSTANT_TRADE_PAY', // 商品码，当前只支持这个
        total_amount: goods.cost, // 商品价格
        subject: 'aaa', // 商品名称
        timeout_express: '5m', // 超时时间
        passback_params: JSON.stringify(goods.pack_params), // 将会返回的一个参数，可用于自定义商品信息最后做通知使用
    }
    const formData = new AlipayFormData(); // 获取一个实例化对象
    formData.addField('returnUrl', 'http://127.0.0.1:3005/payresult'); // 客户端支付成功后会同步跳回的地址
    formData.addField('notifyUrl', 'http://127.0.0.1:3005/notify.html'); // 支付宝在用户支付成功后会异步通知的回调地址，必须在公网 IP 上才能收到
    formData.addField('bizContent', bizContent); // 将必要的参数集合添加进 form 表单

    // 异步向支付宝发送生成订单请求, 第二个参数为公共参数，不需要的话传入空对象就行
    const result = await alipay.exec(method, {}, {
        formData: formData
    });
    // 返回订单的结果信息
    return result;
}
// 获取 yyyy-mm-dd HH:MM:SS 格式的时间
function getFormatDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    month = month >= 10 ? month : ('0' + month);
    day = day >= 10 ? day : ('0' + day);
    hour = hour >= 10 ? hour : ('0' + hour);
    min = min >= 10 ? min : ('0' + min);
    sec = sec >= 10 ? sec : ('0' + sec);

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

// 将生成订单的方法暴露出去
module.exports = {
    createOrder: createOrder
}