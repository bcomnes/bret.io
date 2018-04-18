function micropub (event, context, cb) {
  console.log(event)
  console.log(context)
  console.log(process)
  console.log(process.env)
  cb(null, {
    statusCode: 200,
    body: 'hello world'
  })
}

exports.handler = micropub
