import mongoose from 'mongoose'

const FoodSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:[true, 'Please add a course title']
    },
    description:{
        type:String,
        required:[true, 'Please add a description']
    },
    basePrice:{
        type:Number, 
        required: true
    },
    stockQuantity:{
        type:Number, 
        required: true
    },
    discount:{
        type:Number
    },
    discountType:{
        type:String 
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref: 'Category',
        required:true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    }
})

export const Food = mongoose.model('Food', FoodSchema)