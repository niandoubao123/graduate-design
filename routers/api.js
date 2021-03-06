var express = require("express");
var router = express.Router();
var User = require('../models/User')
var Contact = require('../models/indexfiles/Contact');
var ShowPic = require('../models/showPicfiles/ShowPic')
var ThingsOne = require('../models/thingsfiles/ThingsOne')
var ThingsTwo = require('../models/thingsfiles/ThingsTwo')
var AddCar = require('../models/thingsfiles/AddCar')
var Hotel = require('../models/hotelfiles/Hotel')
var Collection = require('../models/collection')
var Reserve = require('../models/Reserve')

var Collect = require('../func/collect')
//验证逻辑
var responseData;
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ""
    }
    next();
})

//注册
router.post('/user/register', function (req, res, next) {
    // res.send("api-User");
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    console.log(username,password)
    //判空
    if (username == "") {
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    }
    if (password == "") {
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }
    //如果用户名已经存在
    User.findOne({
        username: username
    }, function (err, userInfo) {
        if (userInfo) { //如果存在在
            responseData.code = 4;
            responseData.message = "用户名已经注册了";
            res.json(responseData);
            return;
        }
        var user = new User({
            username: username,
            password: password
        }); //如果不存在就保存数据
        responseData.message = "注册成功";
        res.json(responseData)
        return user.save({}, function (err, data) {
            if (!err) {
                console.log(data)
            }
        });
    })
})
//登录
router.post('/user/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == "" || password == "") {
        responseData.code = 1;
        responseData.message = "用户名或密码不能为空";
        res.json(responseData);
        return;
    }
    //查询用户名和密码是否存在
    User.findOne({
        username: username,
        password: password
    }, function (err, userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        }
        //用户名密码正确
        responseData.message = "登陆成功";
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set('userInfo', JSON.stringify({ //userInfo是起名
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    })
})
//退出登录
router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});
//用户咨询信息咨询
router.post('/user/contact', function (req, res, next) {
    var phoneNumber = req.body.phoneNumber;
    var honeyName = req.body.honeyName;
    //判空
    if (phoneNumber == "") {
        responseData.code = 1;
        responseData.message = "电话号码不能为空";
        res.json(responseData);
        return;
    }
    if (honeyName == "") {
        responseData.code = 2;
        responseData.message = "姓名不能为空";
        res.json(responseData);
        return;
    }
    //如果已经存在
    Contact.findOne({
        phoneNumber:phoneNumber
    }, function (err, contact) {
        if (contact) { //如果存在在
            responseData.code = 3;
            responseData.message = "用户已经提交过";
            res.json(responseData);
            return;
        }else{
            var contact = new Contact({
                phoneNumber: phoneNumber,
                honeyName: honeyName
            }); //如果不存在就保存数据
            responseData.message = "提交成功,稍后会有客服人员联系您";
            res.json(responseData)
            return contact.save({}, function (err, data) {
                if (!err) {
                    console.log(data)
                }
            });
        }
       
    })
})
// 获取指定购物车的所有物品 
router.get('/AddCar', function (req, res) {
    var userId = req.query.userid || '';
    AddCar.findOne({
        username: userId
    }).then(function (addCar) {
        responseData.data = addCar.goods;
        res.json(responseData);
    })

});
//添加购物车
router.post('/AddCar/post', function (req, res) {
    var userId = req.body.userid || '';

    var goodstitle = req.body.goodstitle || '';
    var goodsurl = req.body.goodsurl || '';
    var postData = {
        goodsTitle: req.body.goodstitle,
        goodsUrl: req.body.goodsurl,
        goodsMoney: req.body.goodsmoney,
        num: 1
    };
    // console.log(userId,postData)
    //查询当前这订单的信息
    AddCar.findOne({
        username: userId
    }).then(function (addCar) {

        let index = addCar.goods.findIndex(item=>item.goodsTitle==goodstitle&&item.goodsUrl==goodsurl);
        // console.log(index)
        //商品已存在数目加一
        if(index!=-1){
            addCar.goods[index].num+=1;
            addCar.markModified('goods')
            return addCar.save();
        }else{
            //向购物车插入商品
            addCar.goods.push(postData);
            return addCar.save();
        }

        // addCar.goods.push(postData);
        // return addCar.save();
    }).then(function (newAddCar) {
        responseData.message = '已经在购物车等你';
        responseData.data = newAddCar;
        res.json(responseData);
    });
}) 
// 订单删除
router.post('/AddCar/delete', function (req, res) {
    //获取要删除的分类的id
    var username = req.userInfo.username;
    var title = req.body.title || '';
    console.log(title);
    AddCar.updateOne({
        username: username
    },{ $pull: {
           goods: {
               goodsTitle: title,
           }
       }
    });
});
// 获取指定文章的所有评论 
router.get('/comment', function (req, res) {
    var showPicId = req.query.showPicid || '';
    ShowPic.findOne({
        _id: showPicId
    }).then(function (showPic) {
        responseData.data = showPic.comments;
        res.json(responseData);
    })
});

//留言提交
router.post('/comment/post', function (req, res) {
    //内容的id  哪一条留言
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    //查询当前这篇内容的信息
    ShowPic.findOne({
        _id: contentId
    }).then(function (showPic) {
        showPic.comments.push(postData);
        return showPic.save();
    }).then(function (newShowPic) {
        responseData.message = '评论成功';
        responseData.data = newShowPic;
        res.json(responseData);
    });
});
//酒店收藏
router.post('/hotelCollection', (req, res) => {
    const datas = req.body;
    datas.type = 0;
    Collection.findOne({
        username:req.userInfo.username
    },function(err,rs){
        if(rs){
            let index = rs.goods.findIndex(item=>item.title == req.body.title)
            if(index!=-1){
                res.json({code:200,msg:"不要重复收藏"})
                return;
            }else{
                rs.goods.push(datas);
                rs.markModified('goods')
                res.json({code:200,msg:"收藏成功"})
                return rs.save()
            }
        }else{
            res.json({code:200,msg:"收藏成功"})
            return new Collection({
                username: req.userInfo.username,
                goods: [{
                    type: 0,
                    title: req.body.title,
                    money: req.body.money,
                    place: req.body.place,
                    url: req.body.url,
                    collectionId: req.body.collectionId
                }]
            }).save()
        }
    }).then((data)=>{
        // console.log(data)       
    })
    // Collect.collect(req.userInfo.username, req.body, 0, User,  function (data) {
    //     res.json(data)
    // })
    // var collectionId = req.body.collectionId
    // var status1 = !(Boolean(Number(req.body.status)));
    // var data={
    //     type:0,
    //     collectionId: collectionId
    // }
    // if(status1==0){
    //     console.log("取消")
    //     User.findOne({
    //         username: req.userInfo.username
    //     }).then((user) => {
    //         user.goods.splice(data.collectionId,1);
    //         return user.save()
    //     })
    // }
    // if(status1==1) {
    //     console.log('收藏');
    //     User.findOne({
    //         username: req.userInfo.username
    //     }).then((user) => {
    //         user.goods.push(data);
    //         return user.save()
    //     })
    // }  
    // Hotel.update({_id:collectionId},{status:status1},(err,data)=>{
    //     if(err){
    //         console.log(err)
    //     }else{
    //         res.json({msg:"成功",code:200})
    //     }
    // })
})
//预定套餐
router.post('/reserveMeal', (req, res) => {
    const datas = req.body;
    Reserve.findOne({
        username: req.userInfo.username
    }, function (err, rs) {
        if (rs) {
            let index = rs.goods.findIndex(item => item.title == req.body.title)
            if (index != -1) {
                res.json({
                    code: 200,
                    msg: "不要重复预定"
                })
                return;
            } else {
                rs.goods.push(datas);
                rs.markModified('goods')
                res.json({
                    code: 200,
                    msg: "预定成功,在设置中查看"
                })
                return rs.save()
            }
        } else {
            res.json({
                code: 200,
                msg: "预定成功,在设置中查看"
            })
            return new Reserve({
                username: req.userInfo.username,
                goods: [{
                    title: req.body.title,
                    money: req.body.money,
                    place: req.body.place,
                    url: req.body.url,
                    collectionId: req.body.collectionId
                }]
            }).save()
        }
    }).then((data) => {
        // console.log(data)       
    })
})
module.exports = router;