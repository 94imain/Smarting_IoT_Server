// MongoDB
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// doorbell schema, model
var doorbellSchema = new Schema({
  ispressed: Boolean,
  date: { type: Date, default: Date.now }
});
doorbellSchema.set('toJSON', { getters: true, virtuals: false });

var Doorbell = mongoose.model('Doorbell', doorbellSchema); // Creating(Compiling) Model


// temperature schema, model
var temperatureSchema = new Schema({
  current_temperature: Number,
  time: { type: Date, default: Date.now }
});
temperatureSchema.set('toJSON', { getters: true, virtuals: false});

var Temperature = mongoose.model('Temperature', temperatureSchema); // Creating(Compiling) Model


// trash can schema, Model
var trashSchema = new Schema({
  current_height: Number,
  percentage: Number,
  time: {type: Date, default: Date.now}
});
trashSchema.set('toJSON', { getter: true, virtuals: false});

var Trash = mongoose.model('Trash', trashSchema); // Creating(Compiling) model


exports.doorbellSchema = doorbellSchema;
exports.Doorbell = Doorbell;
exports.temperatureSchema = temperatureSchema;
exports.Temperature = Temperature;
exports.trashSchema = trashSchema;
exports.Trash = Trash;
