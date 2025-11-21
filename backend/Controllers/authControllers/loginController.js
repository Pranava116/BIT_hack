import bcrypt from 'bcrypt'
import User from '../../Database/user.js'

export default async function login(req,res,next){
    try {
        //Data for Login
        const email=req.body.email;
        const password=req.body.password;

        const user=await User.findOne({email})
        //No User Found
        if(!user){
            res.status(400).json({message:"User with this email does not exist"})
        }else{

            //Comparing Passwords
            const isPasswordValid=await bcrypt.compare(password,user.password)
            if(!isPasswordValid){
                res.status(400).json({message:"Invalid Credentials"})
            }else{
                res.status(200).json({message:"User Logged In Successfully"})

                res.body.email=user.email
                res.body.username=user.username

                //For sending JWT
                next()
            }
        }


    } catch (error) {
        //Failsafe for unexpected errors
        console.log(`Error while logging in:${error.message}`);
        res.status(500).json({message:"Internal Server Error"})
    }
}