//jshint esversion:6
require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB")

const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})



userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});


const User=new mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save()
    res.render("secrets");
})

app.post("/login",async function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    try{
        const currentUser=await User.findOne({email:username}) 
        if(currentUser.password==password){
            res.render("secrets")
        }
    }catch(err){
        res.render("home");
        console.log(err);
    }
    
    
    
})



app.listen(3000,function(){
    console.log("Server running on port 3000");
})