exports.collect = function(username,collectData,collectType,model1,callback){
    var collectionId = collectData.collectionId
    var status1 = !(Boolean(Number(collectData.status)));
    var data={
        type: collectType,
        collectionId: collectionId
    }
    if(status1==0){
        console.log("取消")
        model1.findOne({
            username: username
        }).then((user) => {
            user.goods.splice(data.collectionId,1);
            callback({msg:"取消收藏",code:200})
            return user.save()
        })
    }
    if(status1==1) {
        console.log('收藏');
        model1.findOne({
            username: username
        }).then((user) => {
            const index = user.goods.findIndex((item=>item.collectionId == data.collectionId))
            console.log(index)
            if(index!=-1){
                callback({msg:"不能重复收藏",code:200})
                return;
            }else{
                user.goods.push(data);
                callback({msg:"已添加收藏",code:200})
                return user.save()
            }
            // user.goods.findIndex((item)=>{
            //     if (item.collectionId == collectionId){
            //         callback({msg:"不能重复收藏",code:200})
            //         return;
            //     }else{
            //         user.goods.push(data);
            //         callback({msg:"已添加收藏",code:200})
            //         return user.save()
            //     }
            // })
           
        })
    }  
    // model2.update({_id:collectionId},{status:status1},(err,data)=>{
    //     if(err){
    //         console.log(err)
    //     }else{
    //         callback({msg:"成功",code:200})
    //     }
    // })
}