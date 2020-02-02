var express = require("express");
var multiparty = require("multiparty"); //图片上传模块
var router = express.Router();
var mongoose = require("mongoose");
var Pic = require('../models/indexfiles/Pic');
var Picc = require('../models/indexfiles/Picc');
var Lvpai = require('../models/indexfiles/Lvpai');
var City = require('../models/indexfiles/City');
var Beauty = require('../models/indexfiles/Beauty');
var Contact = require('../models/indexfiles/Contact');
var Invitation = require('../models/Invitation');
var PhotoOne = require('../models/photofiles/PhotoOne');
var PhotoTwo = require('../models/photofiles/PhotoTwo');
var PhotoThree = require('../models/photofiles/PhotoThree');
var PhotoFour = require('../models/photofiles/PhotoFour');
var ThingsOne = require('../models/thingsfiles/ThingsOne');
var ThingsTwo = require('../models/thingsfiles/ThingsTwo');
var AddCar = require('../models/thingsfiles/AddCar');
var Order = require('../models/thingsfiles/Order');
var MallTao = require('../models/mallfiles/MallTao');
var MallStore = require('../models/mallfiles/MallStore');
var Hotel = require('../models/hotelfiles/Hotel');
var ShowPic = require('../models/showPicfiles/ShowPic');
var IdeaOne = require('../models/ideafiles/IdeaOne');
var IdeaTwo = require('../models/ideafiles/IdeaTwo');

///////////////////////////////////支付//////////////////////////////////////////////////////
const path = require("path");
// 前端响应要创建订单的数据对象
router.get('/payinfo', (req, res) => {
    let data = req.query;
    // 做一个简单的商品判断
    if (data) {
        res.send(Object.assign(data, {
            code: 200,
        }));
    } else {
        res.setHeader('content-type', 'application/javascript');
        res.send('alert("信息有误，请重新尝试！！！")');
    }
})
// 获取创建订单的自定义模块
const createOrder = require(path.join(__dirname, '../alipay/createOrder.js')).createOrder;
// 获取验签自定义模块
// const checkSign = require(path.join(__dirname, '../alipay/checkSign.js'));
// 生成订单请求
router.post('/createOrder', (req, res) => {
    console.log(req.body.cost)
    req.body.pack_params = {
        cost: req.body.cost,
        place: req.body.place,
        username: req.body.username
    }
    //查找购物车
    AddCar.find({username:req.userInfo.username}).then(function (addCar) {
        //创建已支付订单
        var order = new Order({
            username: addCar[0].username,
            goods:addCar[0].goods,
            cost: req.body.cost,
            status:'已支付',
            place: req.body.place
        }).save(function (err) {
            if (err) {
                console.log(err);
            }
            console.log("增加成功")
        });
        //清空购物车
        AddCar.deleteOne({username:req.userInfo.username}).then(function(err,doc){
           if(err){
               console.log(err)
           }
           console.log("删除成功")
        })
    })
   
    async function asyncCreate() {
        const result = await createOrder(req.body);
        res.send(result);
    }
    asyncCreate();
});


// 支付的信息展示
router.get('/payresult', (req, res) => {
    let htmlStr = '';
    htmlStr += `<p>` + '商户订单号' + ': ' + req.query.out_trade_no + '</p>'
    htmlStr += `<p>` + '支付宝交易订单号' + ': ' + req.query.trade_no + '</p>'
    htmlStr += `<p>` + '交易金额' + ': ' + req.query.total_amount + '￥</p>'
    htmlStr += `<p>` + '交易时间' + ': ' + req.query.timestamp + '￥</p>'
    htmlStr += '<h1 style:"text-align:center;">支付成功！！！<a href="/thingsCar">返回首页!</a></h1>'
    res.send(htmlStr);
})

///////////////////////////////////////////////////////////////////////////////////////////
var data;
//处理通用数据，分类信息，用户信息（应为在哪个页面都显示）
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        pics: [],
        lvpais:[],
        citys:[],
        beautys: []
    }
    Lvpai.find().then(function (lvpais) {
         data.lvpais = lvpais;
     })
    City.find().then(function (citys) {
        data.citys = citys;
    })
    Beauty.find().then(function (beautys) {
         data.beautys = beautys;
     })
    Pic.find().then(function (pics) {
        data.pics = pics;
        next();
    });
   
});
//首页
router.get('/', function (req, res, next) {
Picc.find().populate(['pic', 'picc']).sort({_id:-1}).then(function (piccs) {
    data.piccs = piccs;
    res.render('main/index', data);
})
})
//首页结婚登记
router.get('/dengji', function (req, res, next) { 
   res.render("main/indexfiles/dengji", {
       userInfo: req.userInfo, //将信息给模板,首页
   });
})
//首页结婚日历
router.get('/rili', function (req, res, next) {
    res.render("main/indexfiles/rili", {
        userInfo: req.userInfo, //将信息给模板,首页
    });
})
//请帖
router.get('/invite', function (req, res, next) {
    Invitation.find().then(function (invitations) {
        res.render("main/invitation", {
            userInfo: req.userInfo, //将信息给模板,首页
            invitations:invitations
        });
    })
   
})
//酒店
router.get('/hotel', function (req, res, next) {
    Hotel.find().then(function (hotels) {
         res.render("main/hotel", {
             userInfo: req.userInfo, //将信息给模板,首页
             hotels:hotels
         });
    })
})
//商城
router.get('/mall', function (req, res, next) {
    Lvpai.find().then(function (lvpais) {
    City.find().then(function (citys) {
        MallTao.find().then(function (mallTaos) {
           MallStore.find().then(function (mallStores) {
                res.render("main/mall", {
                    userInfo: req.userInfo, //将信息给模板,首页
                    lvpais:lvpais,
                    citys: citys,
                    mallTaos:mallTaos,
                    mallStores:mallStores
                });
           })
        })
    })
    })
})
//婚品展示页面
router.get('/things', function (req, res, next) {
    ThingsOne.find().then(function (thingsOnes) {
        ThingsTwo.find().then(function (thingsTwos) {
           AddCar.find({username:req.userInfo.username}).then(function(addCars){
        //    res.render("main/thingsCar", {
           res.render("main/things", {
               userInfo: req.userInfo, //将信息给模板,首页
               thingsOnes: thingsOnes,
               thingsTwos: thingsTwos,  
               addCars:addCars   
           });
           })
        })
     })  
})
//已支付订单列表
router.get('/order-list', function (req, res, next) {
     Order.find({
         username: req.userInfo.username
     }).then(function (orders) {
         //    res.render("main/thingsCar", {
         res.render("main/thingsfiles/order-list", {
             userInfo: req.userInfo, //将信息给模板,首页
             orders: orders
         });
     })
})
//婚品购买购物车展示页面
router.get('/thingsCar', function (req, res, next) {
    if (req.url == '/things') {
        res.redirect('/things');
    } else {
        AddCar.findOne({
            username: req.userInfo.username,
        }, function (err, addCar) {
            if (addCar) {
                ThingsOne.find().then(function (thingsOnes) {
                    ThingsTwo.find().then(function (thingsTwos) {
                        AddCar.find({username:req.userInfo.username}).then(function(addCars){
                        res.render("main/thingsfiles/thingsCar", {
                            userInfo: req.userInfo, //将信息给模板,首页
                            thingsOnes: thingsOnes,
                            thingsTwos: thingsTwos,  
                            addCars:addCars   
                        });
                        })
                    })
                })   
            } else {
                res.redirect('/things');
            }
        })      
    }

})
//创建订单操作
router.post('/createCar', function (req, res) {
    var user = req.userInfo.username;
    //查询是否已经存在
    AddCar.findOne({
        username: user,
    }, function (err, rs){
        if (rs) {
            res.render('main/success',{
                userInfo: req.userInfo,
                message: '购物车已经创建，点击开始购物',
                url: '/thingsCar'
            });
            return;
        } else {
            return new AddCar({
                username: user,
            }).save();
        }
    }).then(function (err, data) {
        if (!err) {
            res.render('main/success', {
                userInfo: req.userInfo,
                message: '订单创建成功，可以添加商品了',
                url: '/thingsCar'
            });
        }
    })
})
//删除商品操作
//订单删除
router.get('/addCar/delete', function (req, res) {
    //获取要删除的分类的id
    var username = req.userInfo.username;
    var title = req.query.title || '';
    // console.log(title);
    AddCar.updateOne({
        username: username
    },{ $pull: {
           goods: {
               goodsTitle: title,
           }
       }
    },function (err,data) {
         res.render('main/success', {
             userInfo: req.userInfo,
             message: '删除成功',
             url: '/thingsCar'
         });
    });
});
//进入确认订单页面
router.get('/orderConfirm', function (req, res, next) {
    AddCar.find({
        username: req.userInfo.username
    }).then(function (addCars) {
        res.render("main/thingsfiles/orderConfirm", {
            userInfo: req.userInfo, //将信息给模板,首页
            addCars: addCars
        });
    })
})
//攻略
router.get('/idea', function (req, res, next) {
    IdeaOne.find().then(function (ideaOnes) {
    IdeaTwo.find().then(function (ideaTwos) {
        res.render("main/idea", {
            userInfo: req.userInfo, //将信息给模板,首页
            ideaOnes: ideaOnes,
            ideaTwos: ideaTwos
        });
    })
    })
})
//美图
router.get('/pic', function (req, res, next) {
    PhotoOne.find().then(function (photoOnes) {
        PhotoTwo.find().then(function (photoTwos) {
            PhotoThree.find().then(function (photoThrees) {
                PhotoFour.find().then(function (photoFours) {
                     res.render("main/pic", {
                         userInfo: req.userInfo, //将信息给模板,首页
                         photoOnes: photoOnes,
                         photoTwos: photoTwos,
                         photoThrees: photoThrees,
                         photoFours: photoFours
                     });
                })
                
            })
        });
        
    });
   
})
//晒幸福
router.get('/showPic', function (req, res, next) {
     var page = Number(req.query.page || 1);
     var limit = 4;
     var pages = 0;
     ShowPic.count().then(function (count) {
         //计算总页数
         pages = Math.ceil(count / limit);
         //取值不能超过pages
         page = Math.min(page, pages);
         //取值不能小于1
         page = Math.max(page, 1);
         var skip = (page - 1) * limit;
         ShowPic.find().sort({
             _id: -1
         }).limit(limit).skip(skip).then(function (showPics) {
             res.render('main/showPicfiles/showPic', {
                 userInfo: req.userInfo,
                 showPics: showPics,
                 count: count,
                 pages: pages,
                 limit: limit,
                 page: page
             });
         });
     })
})
//发表动态页面
router.get('/showPicAdd', function (req, res, next) {
    res.render("main/showPicfiles/showPic-add", {
        userInfo: req.userInfo, //将信息给模板,首页
    });
})
//发动态操作
router.post('/showPicAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/showPic"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var content = fields.content[0];
        var addTime = new Date();
        var user = req.userInfo.username;
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        ShowPic.findOne({
            addTime:addTime,
            user:user,
            content,content,
            title: title,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('main/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new ShowPic({
                    addTime: addTime,
                    user: user,
                    content,content,
                    title: title,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('main/success', {
                    userInfo: req.userInfo,
                    message: '动态发表成功',
                    url: '/showPic'
                });
            }
        })
    });
})
//查看动态详情页
router.get('/showview', function (req, res) {
    if(req.userInfo.username!=null){
      var showPicId = req.query.showPicid || '';
      ShowPic.findOne({
          _id: showPicId
      }).then(function (showPics) {
          showPics.views++;
          showPics.save();
          res.render('main/showPicfiles/showview', {
              userInfo: req.userInfo,
              showPics: showPics
          });
      });
    }else{
         res.render('main/error', {
             userInfo: req.userInfo,
             message: '请先登录，才能查看',
             url: '/showPic'
         });
    }   
});
//***********************************************************所有详情页*********************************************************************** */
//进入首页旅拍套餐详情页
router.get('/lvpaides', function (req, res) {
    var lvpaiId = req.query.lvpaiid || '';
    Lvpai.findOne({
        _id: lvpaiId
    }).then(function (lvpais) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: lvpais
        });
    });
});
//进入首页热门城市详情页
router.get('/citydes', function (req, res) {
    var cityId = req.query.cityid || '';
    City.findOne({
        _id: cityId
    }).then(function (citys) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: citys
        });
    });
});
//进入首页婚礼案例详情页
router.get('/exampledes', function (req, res) {
    var piccId = req.query.piccid || '';
    Picc.findOne({
        _id: piccId
    }).then(function (piccs) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes:piccs
        });
    });
});
//进入首页结婚美图详情页
router.get('/beautydes', function (req, res) {
    var beautyId = req.query.beautyid || '';
    Beauty.findOne({
        _id: beautyId
    }).then(function (beautys) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: beautys
        });
    });
});
//进入图片请贴详情页
router.get('/invitationdes', function (req, res) {
    var invitationId = req.query.invitationid || '';
    Invitation.findOne({
        _id: invitationId
    }).then(function (invitations) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: invitations
        });
    });
});
//进入婚宴酒店详情页
router.get('/hoteldes', function (req, res) {
    var hotelId = req.query.hotelid || '';
    Hotel.findOne({
        _id: hotelId
    }).then(function (hotels) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: hotels
        });
    });
});
//进入结婚商城精选套餐详情页
router.get('/mallTaodes', function (req, res) {
    var mallTaoId = req.query.mallTaoid || '';
    MallTao.findOne({
        _id: mallTaoId
    }).then(function (mallTaos) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: mallTaos
        });
    });
});
//进入结婚商城婚庆商家详情页
router.get('/mallStoredes', function (req, res) {
    var mallStoreId = req.query.mallStoreid || '';
    MallStore.findOne({
        _id: mallStoreId
    }).then(function (mallStores) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: mallStores
        });
    });
});
//进入婚品采购物品详情页
router.get('/thingsOnedes', function (req, res) {
    var thingsOneId = req.query.thingsOneid || '';
    ThingsOne.findOne({
        _id: thingsOneId
    }).then(function (thingsOnes) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: thingsOnes
        });
    });
});
router.get('/thingsTwodes', function (req, res) {
    var thingsTwoId = req.query.thingsTwoid || '';
    ThingsTwo.findOne({
        _id: thingsTwoId
    }).then(function (thingsTwos) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: thingsTwos
        });
    });
});
//进入结婚攻略上详情页
router.get('/ideaOnedes', function (req, res) {
    var ideaOneId = req.query.ideaOneid || '';
    IdeaOne.findOne({
        _id: ideaOneId
    }).then(function (ideaOnes) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: ideaOnes
        });
    });
});
//进入结婚攻略下详情页
router.get('/ideaTwodes', function (req, res) {
    var ideaTwoId = req.query.ideaTwoid || '';
    IdeaTwo.findOne({
        _id: ideaTwoId
    }).then(function (ideaTwos) {
        res.render('main/view', {
            userInfo: req.userInfo,
            viewdes: ideaTwos
        });
    });
});
//进入结婚美图大图详情页
router.get('/photodes', function (req, res) {
    var photoId = req.query.photoid || '';
    var N = req.query.n|| '';
    console.log(N)
    if(N==1){
        PhotoOne.findOne({
            _id: photoId
        }).then(function (photoOnes) {
            res.render('main/view', {
                userInfo: req.userInfo,
                viewdes: photoOnes
            });
        });
    }
    if(N==2){
        PhotoTwo.findOne({
            _id: photoId
        }).then(function (photoTwos) {
            res.render('main/view', {
                userInfo: req.userInfo,
                viewdes: photoTwos
            });
        });
    }
    if(N==3){
        PhotoThree.findOne({
            _id: photoId
        }).then(function (photoThrees) {
            res.render('main/view', {
                userInfo: req.userInfo,
                viewdes: photoThrees
            });
        });
    }
    if(N==4){
        PhotoFour.findOne({
            _id: photoId
        }).then(function (photoFours) {
            res.render('main/view', {
                userInfo: req.userInfo,
                viewdes: photoFours
            });
        });
    }

});
module.exports = router;