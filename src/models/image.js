const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const path = require('path');
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");


const ImageSchema = new Schema(
    {
    titulo: {type:String},
    descripcion: {type:String},
    filename: {type:String,required:true},
    views: {type: Number,default:0},
    likes: {type: Number,default:0},
    timestamp: {type:Date, default:Date.now},
    },
  {
    versionKey: false,
    timestamps: true,
  }
);

ImageSchema.plugin(mongooseLeanVirtuals);

ImageSchema.virtual("uniqueId").get(function () {
  return this.filename.replace(path.extname(this.filename), "");
});

module.exports = mongoose.model('Image',ImageSchema);