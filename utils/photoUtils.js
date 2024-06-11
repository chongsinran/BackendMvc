// const AWS = require('aws-sdk');

// module.exports = {
//     // generate random string
//     async uploadImage(base64, userid) {
//         let space = new AWS.S3({
//             endpoint: `${process.env.doRegion}.digitaloceanspaces.com`,
//             useAccelerateEndpoint: false,
//             credentials: new AWS.Credentials(process.env.doAccessKeyId, process.env.doSecretAccessKey, null)
//         });
        
//         const BucketName = process.env.doImgBucket;
//         const imageData = base64
//         const folder = 'user-profile'
        
//         const base64Data = new Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64')
//         const type = imageData.split(';')[0].split('/')[1];
//         const randomKey = Date.now().toString(36).substring(0, 5) + Math.random().toString(36).substr(2).substring(0, 4)
        
//         const uploadParams = {
//             Bucket: BucketName,s
//             Body: base64Data,
//             ContentEncoding: 'base64',
//             ACL: 'public-read',
//             Key: `${folder}/${userid}${randomKey}.${type}`
//         }

//         const result = await space.upload(uploadParams).promise()
//         return result.Location.replace('https://vsing-image-db.nyc3.digitaloceanspaces.com', 'https://vsing-image-db.nyc3.cdn.digitaloceanspaces.com')
//     }
// }