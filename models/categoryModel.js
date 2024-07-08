// name,  image  
const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    
    image : {
        public_id : {
          type : String,
          require : true
        }
    },
    role:{
        type : String,
        default : "user",
        require : true,
    }
})

const categoryModel = mongoose.model("user1",categorySchema);
module.exports = categoryModel;