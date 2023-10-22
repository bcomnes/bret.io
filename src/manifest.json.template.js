export default ({
  siteName
}) => {
  return JSON.stringify({
    manifest_version: 2,
    name: siteName,
    icons: [
      {
        src: '/apple-touch-icon-1024x1024.png',
        sizes: '1024x1024'
      }
    ],
    display: 'fullscreen'
  }, null, ' ')
}
