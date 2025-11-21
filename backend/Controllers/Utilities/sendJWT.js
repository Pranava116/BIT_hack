import JWT from 'jsonwebtoken'

export default function sendJWT(req,res){
    try {

        const JWT_SECRET = process.env.JWT_SECRET

        const email=req.body.email;
        const username=req.body.username;
        //Creating Payload for JWT
        const payload={email:email,username:username}

        //Creating JWT
        const token=JWT.sign(payload,JWT_SECRET,{expiresIn:'1h'})

        res.status(200).cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge:24*60*60*1000,
            sameSite:'lax'
        }).json({message:"JWT sent successfully"})

    }catch (error) {
    console.log(`Error while sending JWT: ${error.message}`);
    res.status(500).json({message:"Internal Server Error"})
}

}