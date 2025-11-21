import bcrypt from 'bcrypt'
import User from '../../Database/user.js'

export default async function signup(req,res){

    try {
        //Data for Signup
        const email=req.body.email;
        const username=req.body.username;
        const password=req.body.password;
        
        const user=await User.findOne({email})

        if(user){
            res.status(400).json({message:"User with this email already exists"})
        }else{
            //Hashing password before saving to DB
            const hashedPassword=await bcrypt.hash(password,10)

            //making a new user
            const newUser=new User({
                username:username,
                email:email,
                password:hashedPassword
            })

            await newUser.save()
            res.status(201).json({message:"User Signed Up Successfully"})
        }

    } catch (error) {
        //Failsafe for unexpected errors
        console.log(`Error while signing up user: ${error.message}`);
        res.status(500).json({message:"Internal Server Error"})
    }
}