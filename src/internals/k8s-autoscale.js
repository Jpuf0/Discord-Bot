const OS = require('os')

module.exports = new Promise(async (resolve, reject) => {
  if (!process.env.K8S_AUTOSCALE) {
    return resolve({
      total: process.env.YUI_SHARDS_TOTAL ? parseInt(process.env.YUI_SHARDS_TOTAL) : 1,
      mine: process.env.YUI_SHARDS_MINE ? parseInt(process.env.YUI_SHARDS_MINE) : 0
    })
  }
  const hs = OS.hostname().match(/[\w]+-([\d]+)/)[1]

  return resolve({ total: parseInt(process.env.YUI_SHARDS_TOTAL), mine: parseInt(hs) })
})
