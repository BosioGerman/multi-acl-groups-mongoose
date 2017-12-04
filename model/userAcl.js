// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserAclSchema = new Schema({
  user: { type: String },
  endpoint: { type: String },
  resource: { type: String },
  methods: { type: Schema.Types.Mixed },
  action: { type: String, enum: ['allow', 'deny'] },
  comment: { type: String, default: null }
}, {
  minimize: false
})

module.exports = function (prefix) {
  return mongoose.model(prefix + 'userAcl', UserAclSchema)
}
