const express = require('express')
const validator = require('validator')
const app =express()
require('./db/mongoose')


const User = require('./model/User')



app.use(express.json())
const userRouter = require('./routers/User')
app.use(userRouter)


const jwt = require('jsonwebtoken')


const newFunction = async () =>{
    const token = jwt.sign({_id:'abc123' }, 'BMT',{expiresIn:'1 day'})
    console.log(token)
    const data = jwt.verify(token, 'BMT')
    console.log(data)
}
newFunction()




const port = process.env.PORT||3005
app.listen(port,()=>{
    console.log("the app is running on port:-"+port)
})