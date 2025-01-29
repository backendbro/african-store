const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  
})

//shelf virtuals\
CategorySchema.virtual('food', {
  ref:'Food',
  localField:'_id',
  foreignField:'category',
  justOne:false
})

//mongoose cascade delete middleware
CategorySchema.pre('remove', async function (next) {
  console.log(`Foods associated with Category with ID: ${this._id} is being deleted`)
  await this.model('Food').deleteMany({ category: this._id})
  next()
})


exports.Category = mongoose.model('Category', CategorySchema)

