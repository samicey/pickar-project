const mongoose= require("mongoose");
require("./../config/");

const TaskSchema = new mongoose.Schema({
  from: mongoose.SchemaTypes.String,
  to: mongoose.SchemaTypes.String,
  
},{
  timestamps:true
});

const currency = mongoose.model('currency',TaskSchema, 'currency');


module.exports = {
  currency,
}