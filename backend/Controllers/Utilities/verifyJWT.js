import JWT from 'jsonwebtoken'

export default async function verifyJWT(req,res,next){
    try{

        const token=req.cookies.token;
        //if token not in the cookies
        if(!token){
            res.status(400).json({message:"Token not available"});
        }else{
            try{
                const JWT_SECRET=process.env.JWT_SECRET;
                const payload=JWT.verify(token,JWT_SECRET);
                //mounting the payload(containing of user's info to the request object)
                req.user=payload;
                next();

            }catch(err){
                res.status(400).json({message:"Invalid JWT Token"})
            }
        }

    }catch(err){
        console.log(`Error while Verifying JWT Token ${err}`);
        res.status(500).json({message:"Internal Server Error"});
    }
}