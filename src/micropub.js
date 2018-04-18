function micropub (event, context, cb) {
  console.log(event)
  console.log(context)
  cb(null, {
    statusCode: 200,
    body: 'hello world'
  })
}

exports.handler = micropub
