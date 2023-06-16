addOrder: async (parent,{ name, email, address},context) => {
         
  if (context.user) {
      var element={}
      var ptl={}
      var sum=0
      const calc= await User.findOne({ _id: context.user._id }).populate("shoplist").populate({
        path: 'shoplist',
        populate: 'item'
      });

      const results=calc.shoplist

      if (results.length<1) {
        return new ForbiddenError('NO PRODUCTS ADDED')
      }
      
      const order = await Order.create({name, email, address});

        for (let i = 0; i < results.length; i++) {
          var Total = (results[i].item.price)*(results[i].quantity);
          
          ptl=await Product.findOne({_id: results[i].item._id })
          var ptc = ptl.inStock
          var InStock=''
          var pcinstock = ptl.qty
          var pupdatestock = (pcinstock)-(results[i].quantity)

          if(ptc==="out of stock"){
            return new ForbiddenError('SERVER CAN NOT PROCESS PRODUCT OUT OF STOCK');
          }
          
          if(pupdatestock>0){
            InStock='in stock'
          }else if ((pupdatestock=0)||(pupdatestock='0')) {
            InStock='out of stock'
          } else {
            return new ForbiddenError('FORBIDDEN CHARACTER')
          }

          await Product.findOneAndUpdate(
            { _id: results[i].item._id},
            
              { $set: {qty: pupdatestock, inStock:InStock } },
              { new: true }
          );

          sum+=(results[i].item.price)*(results[i].quantity)
          element = await Order.findOneAndUpdate(
            { _id: order._id },
            {
              $addToSet: { goods: {quantity:results[i].quantity, item:results[i].item._id, total:Total }},
            },
            {
            new: true,
            }
          );              
        }

        if(element){
          const orderS = await Order.findOneAndUpdate(
            { _id: order._id },
            {
              $set: {
                 total:sum, status: "payment pending"
              }
            },
            {
            new: true,
            }
          );
          const userS = await User.findOneAndUpdate(
            { _id: context.user._id },
            
              // {
              //   $push: { myOrder: order._id},
              // },

              {
                $push: {
                  myOrder: {
                     $each: [ order._id],
                     $position: 0
                  }
                }
              },
            
            {
            new: true,
            }
          );
          

          if(userS){
            for (let i = 0; i < results.length; i++) {

              await User.findOneAndUpdate(
                { _id: context.user._id },
                {
                  $pull: { shoplist:{_id:results[i]._id}},
                },
                {
                new: true,
                }
              ); 
            }
            
            await User.findOneAndUpdate(
              { _id: context.user._id },
              {
                $set: {total:"0"},
              },
              {
              new: true,
              }
            )
      
            return orderS                            
          }
        }
  }
},