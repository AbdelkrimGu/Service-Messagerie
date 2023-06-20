const router = require("express").Router();
const Conversation = require("../models/Conversation");
const axios = require('axios');
const JwtVerifier = require("../functions/JwtVerifier");







// new conversation


router.post("/" ,async (req , res) => {

    try {
        const user = await JwtVerifier.any(req.headers.authorization.split(' ')[1]);
        console.log(user);
        const receiverId = req.body.receiverId;
        const conversations = await Conversation.find({
            members: { $in: [[user.id , receiverId]]}, 
        });
        if(conversations.length != 0){
            console.log("i have a conversation with u");
            console.log(conversations);
            console.log("format :"+conversations[0]);
            res.json(conversations[0]);
            return res.status(200).json({"message" : "already exist"});
        } 
        const newConversation = new Conversation({
            members: [user.id , req.body.receiverId],
        });
    
        try{
            const savedConversation = await newConversation.save();
            console.log("format2 :"+savedConversation);
            res.status(200).json(savedConversation)
        }
        catch(err){
            res.status(500).json(err)
        }

        
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
});


router.get("/" ,async (req , res) => {

    try {
        const user = await JwtVerifier.any(req.headers.authorization.split(' ')[1]);
        const conversations = await Conversation.find({
            members: { $in: [user.id]}, 
        });

        var userid = user.id;
        
        var convs = [];

        await Promise.all(conversations.map(async (conversation) => {
            console.log(conversation.members.find(function(member){
                return member != userid;
            }));
            var conv = conversation.toObject();
            conv.myid = conv.members.find(function(member){
                return member == userid;
            });
            conv.otherid = conv.members.find(function(member){
                return member != userid;
            });
            let other = await getName(conv.otherid);

            conv.name = other.nom + " " + other.prenom;
            conv.imageUrl = other.imageUrl;
            //conv.name = "data.name";
            convs.push(conv);
        }));   
        res.status(200).json(convs);        
        
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }

});


async function getName(id){
    let data = [id];
    const url = "https://userservice-production-dd99.up.railway.app/api/v1/open/students";
    let response = await axios.post(url, data);
    return response.data;
}

//get conv of user

module.exports = router;