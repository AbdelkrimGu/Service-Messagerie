const express = require("express");
const mongoose = require("mongoose");
const app = express();
port = 8040;

const conversationRouter = require("./routes/conversations");
const messageRouter = require("./routes/messages");

mongoose.connect('mongodb+srv://abdelkrim:abdelkrim31052001@saned.rgalgfx.mongodb.net/messaging?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json())

app.use("/api/conversations" , conversationRouter);
app.use("/api/messages" , messageRouter);




app.listen(port, () => console.log("Server listening on port "+ port + "!"))