import { Response, Request } from "express"
import { User } from "../model/User"


export const Register = async (req: Request, res: Response) => {
    const user = await User.create(req.body) 
    console.log(user)
    responseToken(user, 201, res)
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