import { Response, Request, NextFunction } from "express"
import { User } from "../model/User"


export const Register = async (req: Request, res: Response) => {
    const user = await User.create(req.body) 
    console.log(user)
    responseToken(user, 201, res)
}

export const Login =  async (req:Request, res:Response, next:NextFunction) => {
    const { usernameOrEmail, password } = req.body
    if(!usernameOrEmail || !password){
        return next (`Please fill in the empty field(s)`)
    }

    let user; 
        if (usernameOrEmail.includes("@")) {
            user = await User.findOne({email: usernameOrEmail}).select('+password')
        } else {
            user =  await User.findOne({username: usernameOrEmail}).select('+password')
        }

    
   

    
    if(!user){
        return next(`No account found with this email`)
    }

    console.log(user)
    const iMatch = await user.matchPassword(password)
    if(!iMatch){
        return next(`Wrong password. Check and try again`)
    }

    responseToken(user, 200, res)
}


const responseToken = (user: typeof User, statusCode: number, res: Response) => {
    
    //create token   
    const token = user.getSignedInJwtToken()
    

    //jwt options
    const options = {
        expires: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production'
    }


    //send the response
    res.status(statusCode)
    .cookie('token', token, options)
    .json({ success:true, token})

}