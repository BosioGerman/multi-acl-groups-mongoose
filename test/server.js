const Acl = require('./../lib/multi-acl-groups-mongoose')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost:32768/tera_auth_dev')
async function main () {
  let acl = Acl({
    uri: 'mongodb://localhost:32768/tera_auth_dev',
    prefix: 'acl_'
  })
  /*
  await acl.addUserAcl('root', {
    id: 'usr-root-acl',
    endpoint: '*',
    resource: '*',
    methods: '*',
    action: 'allow',
    comment: 'Allow all to root'
  })
  */
  /*
  await acl.addGroupAcl('root-gpo', {
    id: 'gpo-root-acl',
    endpoint: '*',
    resource: '*',
    methods: '*',
    action: 'allow',
    comment: 'Allow all to root group'
  })
  */
  // wait acl.addUserToGroup('root', 'root-gpo')

  let allowed = await acl.checkAcl('root', 'api.server.com', '/users', 'GET')
  console.log(allowed)
}

main().then(
  console.log('done')
)
