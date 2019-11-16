// 七牛云配置
const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'vUlqEHXALL0H-_EW6AD5e-BcwSbFJ8gRQliZvTHl'
const secretKey = '3DMFiww5ZE0oiyR06NUmDDJW-FbDbnKhuNwdDdic'
const bucket = 'z_img'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: bucket,
  expires: Math.round(Date.now() / 1000)
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

// 删除空间中文件
const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z2
const bucketManager = new qiniu.rs.BucketManager(mac, config)


module.exports = {
  uploadToken,
  qiniuDelete(key) {
    return new Promise((resolve, reject) => {
      bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
        if (err) {
          reject(err)
        } else {
          const response = {
            respBody,
            statusCode: respInfo.statusCode
          }
          resolve(response)
        }
      })
    })
  }
}