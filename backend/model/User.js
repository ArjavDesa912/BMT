const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const Task =  require('../routers/Task')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
        },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("the email is in valid")
            }
    }},
    password:{
        type:String,
        required:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("the password should not contains the phrase password")
            }
        }
    },
    age:{
        type:Number,
        required:false,
        validator(value){
            if (value<0){
                throw new Error("the age must not be below 0 ")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

    },{
        timestamps:true
    })

    userSchema.methods.toJSON = function(){
        const user = this
        const userObject = user.toObject()

        delete userObject.password
        delete userObject.tokens

        return userObject
    }

    // userSchema.virtual('tasks',{
    //     ref:"task",
    //     localField:"_id",
    //     foreignField:'author'
    // })



    userSchema.methods.generateAuthToken = async function(){
        const  user = this
        const token = jwt.sign({_id:user._id.toString()},'helloworld')
        user.tokens = user.tokens.concat({token})
        await user.save()
        return token
    }
    userSchema.statics.findByCredentials=async(email,password)=>{
        const user = await User.findOne({email})
        
        if(!user){
            throw new Error('You entered wrong credentials')
        }
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            throw new Error('unable to login')
        }
        return user
    }

    userSchema.pre('remove', async function(next){
            const user = this
            await Task.deleteMany({author:req.body._id})
            next()
    })

    userSchema.pre('save', async function (next) {
        const user = this
        if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password,8)
            console.log("done")
        }
        next()
    })
    
    const User = mongoose.model('users',userSchema)

 module.exports = User