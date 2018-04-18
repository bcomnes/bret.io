function micropub (event, context, cb) {
  console.log(event)
  console.log(context)
  console.log(process)
  cb(null, {
    statusCode: 200,
    body: 'hello world'
  })
}

exports.handler = micropub
