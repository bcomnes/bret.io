module.handler = function micropub (event, context, cb) {
  console.dir(event)
  console.dir(context)
  cb(null, {
    statusCode: 200,
    body: 'hello world'
  })
}
