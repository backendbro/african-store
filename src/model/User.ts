const {model, Schema} = require('mongoose');
import { NextFunction } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    profilePicture:string 
    createdAt:Date
    role:string 
    isActive:boolean
    isModified: (path: string) => boolean;
  }


  const UserSchema  = new Schema (
  {
    username: {
      type: String,
      required: true,
      unique: true, 
      trim: true,   
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      select: false, 
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: 'https://example.com/default-profile.png',
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'worker'], 
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);


//hash password before stoing in databse
UserSchema.pre('save', async function(this:UserDocument, next: NextFunction) {
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


//sign in jwt and return the token
UserSchema.methods.getSignedInJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET || "", {
        expiresIn:"7d" 
    })
}

//check if passwords match
UserSchema.methods.matchPassword = async function (enteredPassword: string){
    return await bcrypt.compare(enteredPassword, this.password)
}

export const User = model('User', UserSchema);

