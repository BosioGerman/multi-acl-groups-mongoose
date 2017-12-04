'use strict'

const multiacl = require('multi-acl-groups')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

function MongoBackend (opt) {
  opt = opt || {
    prefix: 'acl_'
  }
  let prefix = typeof opt.prefix !== 'undefined' ? opt.prefix : ''
  let groupAcl = require('../model/groupAcl')(prefix)
  let userAcl = require('../model/userAcl')(prefix)
  let userGroup = require('../model/userGroup')(prefix)

  return {
    models: {
      groupAcl,
      userAcl,
      userGroup
    },

    getGroupAcls: async (group) => {
      let acls = await groupAcl.find({
        group
      }).lean().exec()
      return acls
    },

    addGroupAcl: async (group, acl) => {
      let added = await groupAcl.create({
        group: group,
        endpoint: acl.endpoint,
        resource: acl.resource,
        methods: acl.methods,
        action: acl.action
      })
      return added.toObject()
    },

    delGroupAcl: async (aclId) => {
      let deleted = await groupAcl.findByIdAndRemove(aclId)
      return deleted
    },

    addUserToGroup: async (user, group) => {
      let added = await userGroup.create({
        user,
        group
      })
      return added.toObject()
    },

    delUserFromGroup: async (user, group) => {
      let deleted = await userGroup.findOneAndRemove({
        $and: [
          {
            user: user
          },
          {
            group: group
          }
        ]
      })
      return deleted
    },

    addUserAcl: async (user, acl) => {
      let added = await userAcl.create({
        user: user,
        endpoint: acl.endpoint,
        resource: acl.resource,
        methods: acl.methods,
        action: acl.action
      })
      return added.toObject()
    },

    delUserAcl: async (aclId) => {
      let deleted = await userAcl.findByIdAndRemove(aclId)
      return deleted
    },

    checkAcl: async (user, endpoint, resource, method) => {
      let groupAcls = await userGroup.aggregate([
        {
          $match: {
            user
          }
        },
        {
          $lookup: {
            from: prefix + 'groupAcl',
            localField: 'group',
            foreignField: 'group',
            as: 'acls'
          }
        },
        {
          $unwind: {
            path: '$acls',
            includeArrayIndex: 'arrayIndex', // optional
            preserveNullAndEmptyArrays: false // optional
          }
        },
        {
          $replaceRoot: {
            newRoot: '$acls'
          }
        }
      ]).exec()

      let userAcls = await userAcl.find({
        user
      }).lean().exec()

      let allowed = multiacl.CheckAcl(groupAcls, userAcls, endpoint, resource, method)
      return allowed
    }
  }
}

module.exports = MongoBackend
