const {model, Schema} = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


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
      enum: ['user', 'admin', 'owner'], 
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
UserSchema.pre('save', async function(next) {
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
UserSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

exports.User = model('User', UserSchema);

