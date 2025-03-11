import shopify from "../shopify.js"

export const authenticateUser = async(req,res,next) => {
    try{
        let shop = req.query.shop
        let store = await shopify.config.sessionStorage.findSessionsByShop(shop)
        
        if(shop === store[0].shop){
            req.session = store[0]
            next()
        }else{
            res.status(401).json({message:"Unauthorized"})
        }
    }catch(err){
        console.log(err)
    }
}