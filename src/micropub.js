function micropub (event, context, callback) {
  console.dir(event)
  console.dir(context)
  cb(null, {
    statusCode: 200,
    body: 'hello world'
  })
}

exports.handler = micropub
