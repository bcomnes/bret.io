export default ({
  siteName
}) => {
  return JSON.stringify({
    manifest_version: 2,
    name: siteName,
    icons: [
      {
        src: '/apple-touch-icon-180x180.png',
        sizes: '180x180'
      }
    ],
    display: 'fullscreen'
  }, null, ' ')
}
