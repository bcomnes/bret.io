const config = require('./log/config.json')
const gravatarUrl = require('gravatar-url')
const favicons = require('favicons')
const parseAuthor = require('parse-author')
const request = require('request')
const concatStream = require('concat-stream')
const pump = require('pump')
const mkdirp = require('mkdirp')
const path = require('path')
const BufferList = require('bl')
const fs = require('fs')
const fromString = require('from2-string')
const parallelLimit = require('run-parallel-limit')

const configuration = {
  path: '/', // Path for overriding default icons path. `string`
  appName: 'bret.io', // Your application's name. `string`
  appDescription: 'Bret Comnes\'s website', // Your application's description. `string`
  developerName: 'Bret Comnes', // Your (or your developer's) name. `string`
  developerURL: 'https://bret.io', // Your (or your developer's) URL. `string`
  dir: 'auto', // Primary text direction for name, short_name, and description
  lang: 'en-US', // Primary language for name and short_name
  background: '#232830', // Background colour for flattened icons. `string`
  theme_color: '#232830', // Theme color user for example in Android's task switcher. `string`
  display: 'standalone', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
  orientation: 'any', // Default orientation: "any", "natural", "portrait" or "landscape". `string`
  start_url: '/?homescreen=1', // Start URL when launching the application from a device. `string`
  version: '1.0', // Your application's version string. `string`
  logging: true, // Print logs to console? `boolean`
  icons: {
    // Platform Options:
    // - offset - offset in percentage
    // - background:
    //   * false - use default
    //   * true - force use default, e.g. set background for Android icons
    //   * color - set background for the specified icons
    //
    android: false, // Create Android homescreen icon. `boolean` or `{ offset, background }`
    appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background }`
    appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background }`
    coast: false, // Create Opera Coast icon. `boolean` or `{ offset, background }`
    favicons: true, // Create regular favicons. `boolean`
    firefox: false, // Create Firefox OS icons. `boolean` or `{ offset, background }`
    windows: true, // Create Windows 8 tile icons. `boolean` or `{ background }`
    yandex: false // Create Yandex browser icon. `boolean` or `{ background }`
  }
}

const author = parseAuthor(config.author)

const avatarUrl = gravatarUrl(author.email, {size: 500})

const concat = concatStream(gotPicture)

console.log('getting avatar')

pump(request(avatarUrl), concat, handleError)

function gotPicture (imageBuf) {
  console.log('got picture')
  favicons(imageBuf, configuration, handleIcons)
}

function handleError (err) {
  // handle your error appropriately here, e.g.:
  if (err) {
    console.error(err) // print the error to STDERR
    process.exit(1) // exit program with non-zero exit code
  }
}

function handleIcons (err, response) {
  if (err) return handleError(err)
  // handling icons
  // console.log(response.images) // Array of { name: string, contents: <buffer> }
  // console.log(response.files) // Array of { name: string, contents: <string> }
  // console.log(response.html)
  console.log('got icons, making dir and saving')
  mkdirp(path.join(__dirname, 'favicons'), handleFiles)

  function handleFiles (err) {
    if (err) return handleError(err)

    const bufferJobs = response.images.map(file => {
      return (cb) => {
        console.log('writing ' + file.name)
        const b = new BufferList(file.contents)
        const w = fs.createWriteStream(path.join(__dirname, 'favicons', file.name))
        pump(b, w, cb)
      }
    })

    const fileJobs = response.files.map(file => {
      return (cb) => {
        console.log('writing ' + file.name)
        const b = fromString(file.contents)
        const w = fs.createWriteStream(path.join(__dirname, 'favicons', file.name))
        pump(b, w, cb)
      }
    })

    const snippetJob = (cb) => {
      console.log('writing snippets.html')
      const b = fromString(response.html.join('\n'))
      const w = fs.createWriteStream(path.join(__dirname, 'favicons', 'snippets.html'))
      pump(b, w, cb)
    }

    const jobs = [].concat(bufferJobs).concat(fileJobs)
    jobs.push(snippetJob)

    parallelLimit(jobs, 5, (err, results) => {
      if (err) return handleError(err)
      console.log('all done')
    })
  }
}
