const request = require('request')

const TOKEN_ENDPOINT = 'https://tokens.indieauth.com/token'
const ME = 'https://bret.io'

function micropub (event, context, cb) {
  const bearer = event.headers.authorization

  if (!bearer) return cb(null, { statusCode: 401, body: 'Missing bearer token' })

  request({
    url: TOKEN_ENDPOINT,
    headers: {
      'Authorization': bearer
    }
  }, handleVerify)

  function handleVerify (err, resp, body) {
    if (err) {
      console.error(err)
      return cb(err, { statusCode: 500, body: 'Unknown error' })
    }

    console.log(resp)
    console.log(body)

    let info
    try {
      info = JSON.parse(body)
    } catch (e) {
      console.error(e)
      return cb(e, { statusCode: 500, body: 'Token endpoint error' })
    }

    if (resp.statusCode !== 200) return cb(null, { statusCode: 401, body: 'Not authorized' })

    if (info.me !== ME) return cb(null, {statusCode: 401, 'body': 'Not authorized'})

    return cb(null, { statusCode: 200, 'body': 'Authorized!' })
  }
}

exports.handler = micropub
