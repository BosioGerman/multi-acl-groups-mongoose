// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserGroupSchema = new Schema({
  user: { type: String },
  group: { type: String }
}, {
  minimize: false
})

UserGroupSchema.index(
  {
    user: 1,
    group: 1
  },
  {
    unique: true
  })

UserGroupSchema.index({user: 1})
UserGroupSchema.index({group: 1})

module.exports = function (prefix) {
  return mongoose.model(prefix + 'userGroup', UserGroupSchema)
}
