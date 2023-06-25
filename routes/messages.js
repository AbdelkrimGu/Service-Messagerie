const router = require("express").Router();
const Message = require("../models/Message");
const axios = require('axios');

const JwtVerifier = require("../functions/JwtVerifier");



//add

router.post("/" ,async (req , res) => {


    try {
        const user = await JwtVerifier.any(req.headers.authorization.split(' ')[1]);
        const newMessage = new Message({
            conversationId: req.body.conversationId,
            sender: user.id,
            text : req.body.text
        });
    
        try{
            const savedMessage = await newMessage.save();
            res.status(200).json(savedMessage)
        }
        catch(err){
            res.status(500).json(err)
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
    
});

//get




router.get("/:conversationId" ,async (req , res) => {

    try {
        const user = await JwtVerifier.any(req.headers.authorization.split(' ')[1]);
        try{
            const messages = await Message.find({
                conversationId: req.params.conversationId, 
            }).sort({ createdAt: 'asc' });;
            res.status(200).json(messages);
        }
        catch(err){
            res.status(500).json(err)
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }

});


module.exports = router;