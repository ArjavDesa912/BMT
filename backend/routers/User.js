const express=require('express')
const router = new express.Router()
const User = require('../model/User')
const auth = require('.././middleware/auth')







router.post('/users',async(req,res)=>{
    

    const user = new User(req.body)


    
    try{
        const token= await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
        res.send(e) 
    }
})


router.post('/users/login',auth,async(req,res)=>{

        try{
                const user = await User.findByCredentials(req.body.email,req.body.password)
                const token = await user.generateAuthToken()
                res.send({user,token})
        }catch(e){
                res.status(400).send()
                console.log(e)
        }
    

})

router.post('/users/logout', auth , async(req, res)=>{

    try{
        
        req.user.tokens = req.user.tokens.filter((token)=>{

                return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }

})

router.post('/users/logoutall', auth, async(req, res)=>{
    try{
            req.user.tokens = []
            await req.user.save()
            res.send()
    }
    catch(e){
           res.status(500).send()
    }
})

router.get('/users/me', auth ,async(req,res)=>{
  res.send(req.user)
})



router.patch('/users/me',auth ,async(req,res)=>{
    const Updates = Object.keys(req.body)
    const  allowed = ['name','email','password','age'] 
    const isValid = Updates.every((updates)=>allowed.includes(updates))
    if(!isValid){
        res.send({error:'invalid updates!'})
        
    }
    try{
        Updates.forEach((update)=> req.user[update] = req.body[update])

        await req.user.save()
       // const user = await User.findByIdAndUpdate(req.param.id,req.body,{new:true,runValidators:true})
         res.send(req.user)
    }catch(e){
        res.status(500).send(e)
        console.log(e)
    }
})


router.delete('/users/me', auth ,async(req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})



module.exports = router