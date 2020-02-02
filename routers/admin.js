var express = require("express");
var multiparty = require("multiparty"); //图片上传模块
var router = express.Router();
var User = require('../models/User');
var Pic = require('../models/indexfiles/Pic');
var Picc = require('../models/indexfiles/Picc');
var Lvpai = require('../models/indexfiles/Lvpai');
var City = require('../models/indexfiles/City');
var Beauty = require('../models/indexfiles/Beauty');
var Invitation = require('../models/Invitation');
var ThingsOne = require('../models/thingsfiles/ThingsOne');
var ThingsTwo = require('../models/thingsfiles/ThingsTwo');
var AddCar = require('../models/thingsfiles/AddCar');
var Order = require('../models/thingsfiles/Order');
var PhotoOne = require('../models/photofiles/PhotoOne');
var PhotoTwo = require('../models/photofiles/PhotoTwo');
var PhotoThree = require('../models/photofiles/PhotoThree');
var PhotoFour = require('../models/photofiles/PhotoFour');
var Hotel = require('../models/hotelfiles/Hotel');
var MallTao = require('../models/mallfiles/MallTao');
var MallStore = require('../models/mallfiles/MallStore');
var ShowPic = require('../models/showPicfiles/ShowPic');
var IdeaOne = require('../models/ideafiles/IdeaOne');
var IdeaTwo = require('../models/ideafiles/IdeaTwo');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});
router.get('/',function(req,res,next){
    res.render('admin/indexfiles/index', {
        userInfo: req.userInfo,
    })
})
//婚礼用品  订单列表  显示
router.get('/thingsOrder', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 2;
    var pages = 0;
    Order.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Order.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (orders) {
            res.render('admin/thingsfiles/thingsOrder', {
                userInfo: req.userInfo,
                orders: orders,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
// 订单删除
router.get('/thingsOrder/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    Order.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/thingsOrder'
        });
    });
});


//首页旅拍套餐列表显示
router.get('/index/lvpai', function (req, res, next) {
     var page = Number(req.query.page || 1);
     var limit = 4;
     var pages = 0;
     Lvpai.count().then(function (count) {
         //计算总页数
         pages = Math.ceil(count / limit);
         //取值不能超过pages
         page = Math.min(page, pages);
         //取值不能小于1
         page = Math.max(page, 1);
         var skip = (page - 1) * limit;
         Lvpai.find().sort({
             _id: -1
         }).limit(limit).skip(skip).then(function (lvpais) {
             res.render('admin/indexfiles/lvpai-list', {
                 userInfo: req.userInfo,
                 lvpais: lvpais,
                 count: count,
                 pages: pages,
                 limit: limit,
                 page: page
             });
         });
     })
})
//首页旅拍套餐添加页面
router.get('/lvpaiAdd', function (req, res, next) {
    res.render('admin/indexfiles/lvpai-add', {
        userInfo: req.userInfo,
    })
})
//旅拍套餐增加操作
router.post('/lvpaiAdd', function (req, res) {
     var form = new multiparty.Form();
     form.uploadDir = "uploads/lvpai"; //上传图片保存的目录
     form.parse(req, function (err, fields, files) {
         var title = fields.title[0];
         var place = fields.place[0];
         var money = fields.money[0];
         var url = files.url[0].path;
         console.log(url, title, place);
         //查询是否已经存在
         Lvpai.findOne({
             title: title,
             place: place,
             url: url,
             money: money
         }, function (err, rs) {
             if (rs) {
                 res.render('admin/success', {
                     userInfo: req.userInfo,
                     message: '图片已经存在'
                 });
                 return;
             } else {
                 return new Lvpai({
                     title: title,
                     place: place,
                     url: url,
                     money: money
                 }).save();
             }
         }).then(function (err, data) {
             if (!err) {
                 res.render('admin/success', {
                     userInfo: req.userInfo,
                     message: '图片添加创建成功',
                     url: '/admin/index/lvpai'
                 });
             }
         })
     });
})
// 旅拍套餐删除
router.get('/index/lvpai/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    Lvpai.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/index/lvpai'
        });
    });

});
//首页热门城市列表显示
router.get('/index/city', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    City.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        City.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (citys) {
            res.render('admin/indexfiles/city-list', {
                userInfo: req.userInfo,
                citys: citys,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//首页热门城市添加页面
router.get('/cityAdd', function (req, res, next) {
    res.render('admin/indexfiles/city-add', {
        userInfo: req.userInfo,
    })
})
//热门城市增加操作
router.post('/cityAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/lvpai"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        City.findOne({
            title: title,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new City({
                    title: title,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/index/city'
                });
            }
        })
    });
})
// 热门城市删除
router.get('/index/city/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    City.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/index/city'
        });
    });

});
//首页结婚美图列表显示
router.get('/index/beauty', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    Beauty.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Beauty.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (beautys) {
            res.render('admin/indexfiles/beauty-list', {
                userInfo: req.userInfo,
                beautys: beautys,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//首页结婚美图添加页面
router.get('/beautyAdd', function (req, res, next) {
    res.render('admin/indexfiles/beauty-add', {
        userInfo: req.userInfo,
    })
})
//结婚美图增加操作
router.post('/beautyAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/beauty"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var description = fields.description[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        Beauty.findOne({
            num:num,
            title: title,
            description: description,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new Beauty({
                    num: num,
                    title: title,
                    description: description,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/index/beauty'
                });
            }
        })
    });
})
// 结婚美图删除
router.get('/index/beauty/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    Beauty.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/index/beauty'
        });
    });

});
//首页上轮播图列表
router.get('/index/banner1', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    Pic.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Pic.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (pics) {
            res.render('admin/indexfiles/banner1', {
                userInfo: req.userInfo,
                pics: pics,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//轮播图添加页面
router.get('/banneroneAdd', function (req, res, next) {
    res.render('admin/indexfiles/banner1-add', {
        userInfo: req.userInfo
    })
})
//轮播图增加操作
router.post('/banneroneAdd', function (req, res) {
     var form = new multiparty.Form();
     form.uploadDir = "uploads/banner1"; //上传图片保存的目录
     form.parse(req, function (err, fields, files) {
         var name = fields.name[0];
         var url = files.url[0].path;
         console.log(url,name);
          //查询是否已经存在
          Pic.findOne({
              name: name,
              url: url
          }, function (err, rs) {
              if (rs) {
                  res.render('admin/success', {
                      userInfo: req.userInfo,
                      message: '图片已经存在'
                  });
                  return;
              } else {
                  return new Pic({
                      name: name,
                      url:url
                  }).save();
              }
          }).then(function (err, data) {
              if (!err) {
                  res.render('admin/success', {
                      userInfo: req.userInfo,
                      message: '图片添加创建成功',
                      url: '/admin/index/banner1'
                  });
              }
          })
     });
})
// 轮播删除
router.get('/index/banner1/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    Pic.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/index/banner1'
        });
    });

});
//首页下轮播图列表
router.get('/index/banner2', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    Picc.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Picc.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (piccs) {
            res.render('admin/indexfiles/banner2', {
                userInfo: req.userInfo,
                piccs: piccs,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//首页下轮播图添加页面
router.get('/bannertwoAdd', function (req, res, next) {
    res.render('admin/indexfiles/banner2-add', {
        userInfo: req.userInfo
    })
})
//首页下轮播图增加操作
router.post('/bannertwoAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/banner2"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var place = fields.place[0];
        var url  = files.url[0].path;
        console.log(url, title,place);
        //查询是否已经存在
        Picc.findOne({
            title: title,
            place: place,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new Picc({
                    title: title,
                        place: place,
                        url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/index/banner2'
                });
            }
        })
    });
})
// 首页下轮播删除
router.get('/index/banner2/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    Picc.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/index/banner2'
        });
    });

});
//成功提示页
router.get('/success', function (req, res, next) {
    res.render('admin/success', {
        userInfo: req.userInfo
    })
})
//管理员列表显示
router.get('/userAdmin', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    User.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        User.find({isAdmin:true}).limit(limit).skip(skip).then(function (users) {
            console.log(users);
            res.render('admin/admin-list', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//用户列表显示
router.get('/user', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    User.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/indexfiles/member-list', {
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
// 用户删除
router.get('/user/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    User.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/user'
        });
    });

});
//************************************************************************************************************************* */
//图片请帖列表显示
router.get('/invitation', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    Invitation.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Invitation.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (invitations) {
            res.render('admin/invitationfiles/invitation-list', {
                userInfo: req.userInfo,
                invitations: invitations,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//图片请帖添加页面
router.get('/invitationAdd', function (req, res, next) {
    res.render('admin/invitationfiles/invitation-add', {
        userInfo: req.userInfo,
    })
})
//图片请帖增加操作
router.post('/invitationAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/invitation"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        Invitation.findOne({
            title: title,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new Invitation({
                    title: title,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/invitation'
                });
            }
        })
    });
})
//图片请贴编辑修改页面
router.get('/invitation/update', function (req, res) {
    var id = req.query.id || "";
    Invitation.findOne({
        _id: id
    }).then(function (invitation) {
        if (invitation) {
            res.render('admin/invitationfiles/invitation-edit', {
                userInfo: req.userInfo,
                invitation: invitation
            });
        }
    })
})
//图片请贴编辑后保存
router.post('/invitation/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/invitation"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var url = files.url[0].path;
        Invitation.update({ _id: id }, {
            title: title,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/invitation'
                });
            }

        })
    });

});
// 图片请帖删除
router.get('/invitation/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    Invitation.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/invitation'
        });
    });

});

//************************************************************************************************************************* */
//************************************************************************************************************************* */
//************************************************************************************************************************* */
//************************************************************************************************************************* */
//婚宴酒店列表显示
router.get('/hotel', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    Hotel.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        Hotel.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (hotels) {
            res.render('admin/hotelfiles/hotel-list', {
                userInfo: req.userInfo,
                hotels: hotels,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//婚宴酒店添加页面
router.get('/hotelAdd', function (req, res, next) {
    res.render('admin/hotelfiles/hotel-add', {
        userInfo: req.userInfo,
    })
})
//婚宴酒店增加操作
router.post('/hotelAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var place = fields.place[0];
        var money = fields.money[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        Hotel.findOne({
            title: title,
            num: num,
            place:place,
            money: money,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new Hotel({
                    title: title,
                    num: num,
                    place:place,
                    money: money,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/hotel'
                });
            }
        })
    });
})
//婚宴酒店编辑页面
router.get('/hotel/update', function (req, res) {
    var id = req.query.id || "";
    Hotel.findOne({
        _id: id
    }).then(function (hotel) {
        if (hotel){
            res.render('admin/hotelfiles/hotel-edit', {
                userInfo: req.userInfo,
                hotel:hotel
            });
        }
    })
})
//婚宴酒店编辑后保存
router.post('/hotel/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var money = fields.money[0];
        var place = fields.place[0];
        var num   = fields.num[0];
        var url   = files.url[0].path;
        console.log(title,money,place,num,url,id)             
        Hotel.update({_id:id},{
            title:title,
            money:money,
            num:num,
            place:place,
            url:url
        }, function (err, data) {
            if(err){
                throw err;
            }else{
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/hotel'
                });
            }
            
        })
    });

});
// 婚宴酒店删除
router.get('/hotel/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    Hotel.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/hotel'
        });
    });

});
//**************************************************结婚商城*********************************************************************** */
//结婚商城------结婚套餐列表显示
router.get('/mallTao', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    MallTao.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        MallTao.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (mallTaos) {
            res.render('admin/mallfiles/mallTao-list', {
                userInfo: req.userInfo,
                mallTaos: mallTaos,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚商城------结婚套餐添加页面
router.get('/mallTaoAdd', function (req, res, next) {
    res.render('admin/mallfiles/mallTao-add', {
        userInfo: req.userInfo,
    })
})
//结婚商城------结婚套餐增加操作
router.post('/mallTaoAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/mall"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var name = fields.name[0];
        var money = fields.money[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        MallTao.findOne({
            title: title,
            num: num,
            name:name,
            money: money,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new MallTao({
                    title: title,
                    num: num,
                    name: name,
                    money: money,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/mallTao'
                });
            }
        })
    });
})
//结婚商城------结婚套餐编辑页面
router.get('/mallTao/update', function (req, res) {
    var id = req.query.id || "";
    MallTao.findOne({
        _id: id
    }).then(function (mallTao) {
        if (mallTao) {
            res.render('admin/mallfiles/mallTao-edit', {
                userInfo: req.userInfo,
                mallTao: mallTao
            });
        }
    })
})
//结婚商城------结婚套餐编辑后保存
router.post('/mallTao/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/mall"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var money = fields.money[0];
        var name = fields.name[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        MallTao.update({ _id: id }, {
            title: title,
            money: money,
            num: num,
            name: name,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/mallTao'
                });
            }

        })
    });

});
// 结婚商城------结婚套餐删除
router.get('/mallTao/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    MallTao.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/mallTao'
        });
    });

});
//*****************************************婚庆店家推荐********************************************************************* */
//结婚商城------婚庆店家列表显示
router.get('/mallStore', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    MallStore.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        MallStore.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (mallStores) {
            res.render('admin/mallfiles/mallStore-list', {
                userInfo: req.userInfo,
                mallStores: mallStores,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚商城------婚庆店家添加页面
router.get('/mallStoreAdd', function (req, res, next) {
    res.render('admin/mallfiles/mallStore-add', {
        userInfo: req.userInfo,
    })
})
//结婚商城------婚庆店家增加操作
router.post('/mallStoreAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/mall"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var name = fields.name[0];
        var money = fields.money[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        MallStore.findOne({
            title: title,
            num: num,
            name: name,
            money: money,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new MallStore({
                    title: title,
                    num: num,
                    name: name,
                    money: money,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/mallStore'
                });
            }
        })
    });
})
//结婚商城------婚庆店家编辑页面
router.get('/mallStore/update', function (req, res) {
    var id = req.query.id || "";
    MallStore.findOne({
        _id: id
    }).then(function (mallStore) {
        if (mallStore) {
            res.render('admin/mallfiles/mallStore-edit', {
                userInfo: req.userInfo,
                mallStore: mallStore
            });
        }
    })
})
//结婚商城------婚庆店家编辑后保存
router.post('/mallStore/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/mall"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var money = fields.money[0];
        var name = fields.name[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        MallStore.update({
            _id: id
        }, {
            title: title,
            money: money,
            num: num,
            name: name,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/mallStore'
                });
            }

        })
    });

});
// 结婚商城------婚庆店家删除
router.get('/mallStore/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    MallStore.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/mallStore'
        });
    });

});
//************************************************************************************************************************* */
//婚品采购列表显示------->穿搭服饰
router.get('/thingsOne', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    ThingsOne.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        ThingsOne.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (thingsOnes) {
            res.render('admin/thingsfiles/thingsOne-list', {
                userInfo: req.userInfo,
                thingsOnes: thingsOnes,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//婚品采购------->穿搭服饰添加页面
router.get('/thingsOneAdd', function (req, res, next) {
    res.render('admin/thingsfiles/thingsOne-add', {
        userInfo: req.userInfo,
    })
})
//结婚美图婚品------->穿搭服饰增加操作
router.post('/thingsOneAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/things"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var money = fields.money[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        ThingsOne.findOne({
            title: title,
            num: num,
            money:money,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new ThingsOne({
                    title: title,
                    num: num,
                    money: money,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/thingsOne'
                });
            }
        })
    });
})
//婚品---》穿搭服饰编辑修改页面
router.get('/thingsOne/update', function (req, res) {
    var id = req.query.id || "";
    ThingsOne.findOne({
        _id: id
    }).then(function (thingsOne) {
        if (thingsOne) {
            res.render('admin/thingsfiles/thingsOne-edit', {
                userInfo: req.userInfo,
                thingsOne: thingsOne
            });
        }
    })
})
//穿搭服饰编辑后保存
router.post('/thingsOne/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/things"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var money = fields.money[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(title, money, num, url, id)
        ThingsOne.update({ _id: id }, {
            title: title,
            money: money,
            num: num,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/thingsOne'
                });
            }

        })
    });

});
// 婚品采购------->穿搭服饰删除
router.get('/thingsOne/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    ThingsOne.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/thingsOne'
        });
    });

});
//**************************************************************************************************************** */
//婚品采购-- -- -- - > 相关用品
router.get('/thingsTwo', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    ThingsTwo.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        ThingsTwo.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (thingsTwos) {
            res.render('admin/thingsfiles/thingsTwo-list', {
                userInfo: req.userInfo,
                thingsTwos: thingsTwos,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//婚品采购-- -- -- - > 相关用品添加页面
router.get('/thingsTwoAdd', function (req, res, next) {
    res.render('admin/thingsfiles/thingsTwo-add', {
        userInfo: req.userInfo,
    })
})
//婚品采购-- -- -- - > 相关用品增加操作
router.post('/thingsTwoAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var money = fields.money[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        ThingsTwo.findOne({
            title: title,
            num: num,
            money:money,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new ThingsTwo({
                    title: title,
                    num: num,
                    money:money,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/thingsTwo'
                });
            }
        })
    });
})
//相关用品编辑修改页面
router.get('/thingsTwo/update', function (req, res) {
    var id = req.query.id || "";
    ThingsTwo.findOne({
        _id: id
    }).then(function (thingsTwo) {
        if (thingsTwo) {
            res.render('admin/thingsfiles/thingsTwo-edit', {
                userInfo: req.userInfo,
                thingsTwo: thingsTwo
            });
        }
    })
})
//相关用品编辑后保存
router.post('/thingsTwo/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/things"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var money = fields.money[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(title, money, num, url, id)
        ThingsTwo.update({ _id: id }, {
            title: title,
            money: money,
            num: num,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/thingsTwo'
                });
            }

        })
    });

});
// 婚品采购-- -- -- - > 相关用品删除
router.get('/thingsTwo/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    ThingsTwo.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/thingsTwo'
        });
    });

});
//************************************************************************************************************************* */
//结婚美图列表显示------->婚纱照
router.get('/photo', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    PhotoOne.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        PhotoOne.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (photoOnes) {
            res.render('admin/photofiles/photo-list', {
                userInfo: req.userInfo,
                photoOnes: photoOnes,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚美图添加页面
router.get('/photoAdd', function (req, res, next) {
    res.render('admin/photofiles/photo-add', {
        userInfo: req.userInfo,
    })
})
//结婚美图增加操作
router.post('/photoAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        PhotoOne.findOne({
            title: title,
            num:num,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new PhotoOne({
                    title: title,
                    num:num,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/photo'
                });
            }
        })
    });
})
//婚纱照编辑修改页面
router.get('/photo/update', function (req, res) {
    var id = req.query.id || "";
    PhotoOne.findOne({
        _id: id
    }).then(function (photoOne) {
        if (photoOne) {
            res.render('admin/photofiles/photo-edit', {
                userInfo: req.userInfo,
                photoOne: photoOne
            });
        }
    })
})
//婚纱照编辑后保存
router.post('/photo/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(title,num, url, id)
        PhotoOne.update({
            _id: id
        }, {
            title: title,
            num: num,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/photo'
                });
            }

        })
    });

});
// 结婚美图删除
router.get('/photo/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    PhotoOne.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/photo'
        });
    });

});
//********************************************************************************************************* */
//结婚美图列表显示------->婚礼布置
router.get('/photoTwo', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    PhotoTwo.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        PhotoTwo.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (photoTwos) {
            res.render('admin/photofiles/photoTwo-list', {
                userInfo: req.userInfo,
                photoTwos: photoTwos,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚美图添加页面
router.get('/photoTwoAdd', function (req, res, next) {
    res.render('admin/photofiles/photoTwo-add', {
        userInfo: req.userInfo,
    })
})
//结婚美图增加操作
router.post('/photoTwoAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        PhotoTwo.findOne({
            title: title,
            num: num,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new PhotoTwo({
                    title: title,
                    num: num,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/photoTwo'
                });
            }
        })
    });
})
//婚礼布置编辑修改页面
router.get('/photoTwo/update', function (req, res) {
    var id = req.query.id || "";
    PhotoTwo.findOne({
        _id: id
    }).then(function (photoTwo) {
        if (photoTwo) {
            res.render('admin/photofiles/photoTwo-edit', {
                userInfo: req.userInfo,
                photoTwo: photoTwo
            });
        }
    })
})
//婚礼布置编辑后保存
router.post('/photoTwo/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(title, num, url, id)
        PhotoTwo.update({
            _id: id
        }, {
            title: title,
            num: num,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/photoTwo'
                });
            }

        })
    });

});
// 结婚美图删除
router.get('/photoTwo/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    PhotoTwo.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/photoTwo'
        });
    });

});

//****************************************************************************************************** */
//结婚美图列表显示------->婚纱礼服
router.get('/photoThree', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    PhotoThree.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        PhotoThree.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (photoThrees) {
            res.render('admin/photofiles/photoThree-list', {
                userInfo: req.userInfo,
                photoThrees: photoThrees,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚美图添加页面
router.get('/photoThreeAdd', function (req, res, next) {
    res.render('admin/photofiles/photoThree-add', {
        userInfo: req.userInfo,
    })
})
//结婚美图增加操作
router.post('/photoThreeAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        PhotoThree.findOne({
            title: title,
            num: num,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new PhotoThree({
                    title: title,
                    num: num,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/photoThree'
                });
            }
        })
    });
})
//婚纱礼服编辑修改页面
router.get('/photoThree/update', function (req, res) {
    var id = req.query.id || "";
    PhotoThree.findOne({
        _id: id
    }).then(function (photoThree) {
        if (photoThree) {
            res.render('admin/photofiles/photoThree-edit', {
                userInfo: req.userInfo,
                photoThree: photoThree
            });
        }
    })
})
//婚纱礼服编辑后保存
router.post('/photoThree/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(title, num, url, id)
        PhotoThree.update({
            _id: id
        }, {
            title: title,
            num: num,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/photoThree'
                });
            }

        })
    });

});
// 结婚美图删除
router.get('/photoThree/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    PhotoThree.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/photoThree'
        });
    });

});
//************************************************************************************************************************* */
//结婚攻略一列表显示
router.get('/ideaOne', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    IdeaOne.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        IdeaOne.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (ideaOnes) {
            res.render('admin/ideafiles/ideaOne-list', {
                userInfo: req.userInfo,
                ideaOnes: ideaOnes,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚攻略一添加页面
router.get('/ideaOneAdd', function (req, res, next) {
    res.render('admin/ideafiles/ideaOne-add', {
        userInfo: req.userInfo,
    })
})
//结婚攻略一增加操作
router.post('/ideaOneAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/ideaOne"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var content = fields.content[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(url, title,num);
        //查询是否已经存在
        IdeaOne.findOne({
            title: title,
            url: url,
            num:num,
            content:content
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new IdeaOne({
                    title: title,
                    url: url,
                    num: num,
                    content:content
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/ideaOne'
                });
            }
        })
    });
})
//结婚攻略一编辑修改页面
router.get('/ideaOne/update', function (req, res) {
    var id = req.query.id || "";
    IdeaOne.findOne({
        _id: id
    }).then(function (ideaOne) {
        if (ideaOne) {
            res.render('admin/ideafiles/ideaOne-edit', {
                userInfo: req.userInfo,
                ideaOne: ideaOne
            });
        }
    })
})
//结婚攻略一编辑后保存
router.post('/ideaOne/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/ideaOne"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var content = fields.content[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        IdeaOne.update({
            _id: id
        }, {
            title: title,
            url: url,
            num: num,
            content: content
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/ideaOne'
                });
            }

        })
    });

});
// 结婚攻略一删除
router.get('/ideaOne/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    IdeaOne.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/ideaOne'
        });
    });

});
//************************************************************************************************************************* */
//************************************************************************************************************************* */
//结婚攻略二列表显示
router.get('/ideaTwo', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    IdeaTwo.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        IdeaTwo.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (ideaTwos) {
            res.render('admin/ideafiles/ideaTwo-list', {
                userInfo: req.userInfo,
                ideaTwos: ideaTwos,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚攻略二添加页面
router.get('/ideaTwoAdd', function (req, res, next) {
    res.render('admin/ideafiles/ideaTwo-add', {
        userInfo: req.userInfo,
    })
})
//结婚攻略二增加操作
router.post('/ideaTwoAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/ideaTwo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var content = fields.content[0];
        var num = fields.num[0];
        console.log(title, num);
        //查询是否已经存在
        IdeaTwo.findOne({
            title: title,
            num: num,
            content: content
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new IdeaTwo({
                    title: title,
                    num: num,
                    content: content
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/ideaTwo'
                });
            }
        })
    });
})
//结婚攻略二编辑修改页面
router.get('/ideaTwo/update', function (req, res) {
    var id = req.query.id || "";
    IdeaTwo.findOne({
        _id: id
    }).then(function (ideaTwo) {
        if (ideaTwo) {
            res.render('admin/ideafiles/ideaTwo-edit', {
                userInfo: req.userInfo,
                ideaTwo: ideaTwo
            });
        }
    })
})
//结婚攻略二编辑后保存
router.post('/ideaTwo/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/ideaTwo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var content = fields.content[0];
        var num = fields.num[0];
        IdeaTwo.update({
            _id: id
        }, {
            title: title,
            num: num,
            content: content
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/ideaTwo'
                });
            }

        })
    });

});
// 结婚攻略二删除
router.get('/ideaTwo/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    IdeaTwo.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/ideaTwo'
        });
    });

});
//********************************************************************************************************** */
//结婚美图列表显示------->婚礼跟拍
router.get('/photoFour', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    PhotoFour.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        PhotoFour.find().sort({
            _id: -1
        }).limit(limit).skip(skip).then(function (photoFours) {
            res.render('admin/photofiles/photoFour-list', {
                userInfo: req.userInfo,
                photoFours: photoFours,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//结婚美图添加页面
router.get('/photoFourAdd', function (req, res, next) {
    res.render('admin/photofiles/photoFour-add', {
        userInfo: req.userInfo,
    })
})
//结婚美图增加操作
router.post('/photoFourAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(url, title);
        //查询是否已经存在
        PhotoFour.findOne({
            title: title,
            num: num,
            url: url
        }, function (err, rs) {
            if (rs) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片已经存在'
                });
                return;
            } else {
                return new PhotoFour({
                    title: title,
                    num: num,
                    url: url
                }).save();
            }
        }).then(function (err, data) {
            if (!err) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '图片添加创建成功',
                    url: '/admin/photoFour'
                });
            }
        })
    });
})
//婚礼跟拍编辑修改页面
router.get('/photoFour/update', function (req, res) {
    var id = req.query.id || "";
    PhotoFour.findOne({
        _id: id
    }).then(function (photoFour) {
        if (photoFour) {
            res.render('admin/photofiles/photoFour-edit', {
                userInfo: req.userInfo,
                photoFour: photoFour
            });
        }
    })
})
//婚礼跟拍编辑后保存
router.post('/photoFour/update', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = "uploads/photo"; //上传图片保存的目录
    form.parse(req, function (err, fields, files) {
        var id = fields._id[0];
        var title = fields.title[0];
        var num = fields.num[0];
        var url = files.url[0].path;
        console.log(title, num, url, id)
        PhotoFour.update({
            _id: id
        }, {
            title: title,
            num: num,
            url: url
        }, function (err, data) {
            if (err) {
                throw err;
            } else {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/photoFour'
                });
            }

        })
    });

});
// 结婚美图删除
router.get('/photoFour/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    PhotoFour.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/photoFour'
        });
    });

});
//***************************************动态留言板*************************************************************** */
//用户动态列表显示
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
            res.render('admin/showPicfiles/showPic-list', {
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
// 动态删除
router.get('/showPic/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    ShowPic.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/showPic'
        });
    });

});

//用户动态评论列表显示
router.get('/showPicComment', function (req, res, next) {
    var page = Number(req.query.page || 1);
    var limit = 1;
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
            res.render('admin/showPicfiles/showPic-comment', {
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

// 动态删除
router.get('/showPicComment/delete', function (req, res) {
    //获取要删除的分类的id
    var id = req.query.id || '';
    ShowPic.update({
        _id:id
    },{comments:""}).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/showPicComment'
        });
    });
});
module.exports = router;