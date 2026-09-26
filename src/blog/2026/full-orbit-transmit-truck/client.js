import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/** @typedef {any} JsonDefinition */

const matcapVertexShader = `
attribute vec4 tangent;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vTangent;
varying vec4 vViewPosition;

void main () {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
  vNormal = normalMatrix * normal;
  vTangent = vec4(normalMatrix * tangent.xyz, tangent.w);
  vViewPosition = viewPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`

const matcapFragmentShader = `
precision highp float;

uniform sampler2D matcapMap;
uniform sampler2D normalMap;
uniform sampler2D aoMap;
uniform sampler2D rampMap;
uniform int flipY;
uniform float opacity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec4 vTangent;
varying vec4 vViewPosition;

vec3 srgbToLinear (vec3 value) {
  return mix(
    pow(value * 0.9478672986 + vec3(0.0521327014), vec3(2.4)),
    value * 0.0773993808,
    lessThanEqual(value, vec3(0.04045))
  );
}

vec3 linearToSrgb (vec3 value) {
  value = max(value, vec3(0.0));
  return mix(
    pow(value, vec3(0.41666)) * 1.055 - vec3(0.055),
    value * 12.92,
    lessThanEqual(value, vec3(0.0031308))
  );
}

vec3 tangentSpaceNormal (vec4 tangent, vec3 normal, vec3 textureNormal) {
  vec3 tangentDirection = vec3(0.0, 1.0, 0.0);
  float tangentLength = length(tangent.xyz);

  if (tangentLength != 0.0) tangentDirection = tangent.xyz / tangentLength;

  vec3 bitangent = tangent.w * normalize(cross(normal, tangentDirection));
  return normalize(
    textureNormal.x * tangentDirection +
    textureNormal.y * bitangent +
    textureNormal.z * normal
  );
}

vec2 matcapUv (vec3 normal, vec3 eyeDirection) {
  vec3 matcapX = vec3(-eyeDirection.z, 0.0, eyeDirection.x);
  vec3 matcapY = cross(matcapX, eyeDirection);
  return vec2(
    -dot(normal.xz, matcapX.xz),
    dot(normal, matcapY)
  ) * 0.5 + 0.5;
}

void main () {
  vec3 normal = normalize(gl_FrontFacing ? vNormal : -vNormal);
  vec4 tangent = gl_FrontFacing ? vTangent : -vTangent;

  #ifdef USE_NORMALMAP
    vec3 textureNormal = texture2D(normalMap, vUv).rgb * 2.0 - 1.0;
    textureNormal.y = flipY == 1 ? -textureNormal.y : textureNormal.y;
    normal = tangentSpaceNormal(tangent, normal, textureNormal);
  #endif

  vec3 eyeDirection = normalize(-vViewPosition.xyz);
  vec4 matcapTexel = texture2D(matcapMap, matcapUv(normal, eyeDirection));
  vec3 color = srgbToLinear(matcapTexel.rgb);
  vec3 aoTexel = texture2D(aoMap, vUv).rgb;

  #ifdef USE_RAMP
    vec3 ramp = srgbToLinear(texture2D(rampMap, vec2(aoTexel.r, 0.5)).rgb);
    color = mix(ramp, color, aoTexel);
  #else
    color *= aoTexel;
  #endif

  gl_FragColor = vec4(linearToSrgb(color), opacity * matcapTexel.a);
}
`

const constrainedContainer = /** @type {HTMLElement | null} */ (document.querySelector('#container'))
const fullOrbitContainer = /** @type {HTMLElement | null} */ (document.querySelector('#container-full'))
const articleHeader = /** @type {HTMLElement | null} */ (document.querySelector('.article-header'))
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const testCanvas = document.createElement('canvas')
const webglContext = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
const assetRoot = new URL('./assets/', import.meta.url)

const texturePaths = [
  'textures/head_AO.jpg',
  'textures/rear_AO.jpg',
  'textures/ao_ramp.png',
  'textures/white.png',
  'textures/matcaps/metal_yellow.png',
  'textures/matcaps/metal_grey.png',
  'textures/matcaps/metal_black.png',
  'textures/matcaps/metal_purple.png',
  'textures/matcaps/metal_white.png',
  'textures/matcaps/bottom_light_cover.png',
  'textures/matcaps/headlight_cover.png',
  'textures/matcaps/glass.png',
  'textures/matcaps/headlight.png',
  'textures/matcaps/front_wheel_tire.png',
  'textures/matcaps/front_wheel_rim.png',
  'textures/matcaps/rear_wheel_tire.png',
  'textures/matcaps/rear_wheel_rim.png',
  'textures/matcaps/orange_light.png',
  'textures/matcaps/red_light.png',
  'textures/matcaps/front_glossy_metal_black.png',
  'textures/matcaps/rear_glossy_metal_black.png',
  'textures/matcaps/lamp.png',
  'textures/front_wheel/front_wheel_tire_AO.jpg',
  'textures/front_wheel/front_wheel_rim_AO.jpg',
  'textures/front_wheel/front_wheel_tire_Normal.jpg',
  'textures/front_wheel/front_wheel_rim_Normal.jpg',
  'textures/rear_wheel/rear_wheel_tire_AO.jpg',
  'textures/rear_wheel/rear_wheel_rim_AO.jpg',
  'textures/rear_wheel/rear_wheel_tire_Normal.jpg',
  'textures/rear_wheel/rear_wheel_rim_Normal.jpg'
]

/** @param {string} path */
const assetUrl = (path) => new URL(path, assetRoot).href

/**
 * @param {THREE.Object3D} object
 * @param {string} name
 */
function isDescendantOf (object, name) {
  let parent = object.parent
  while (parent) {
    if (parent.name === name) return true
    parent = parent.parent
  }
  return false
}

/**
 * @param {JsonDefinition} definition
 * @param {ArrayBuffer} binary
 */
function createGeometry (definition, binary) {
  const geometry = new THREE.BufferGeometry()

  for (const [attributeName, range] of Object.entries(definition.offsets)) {
    const bytes = binary.slice(range[0], range[1] + 1)

    if (attributeName === 'index') {
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(bytes), 1))
      continue
    }

    const itemSize = attributeName === 'uv' || attributeName === 'uv2'
      ? 2
      : attributeName === 'tangent'
        ? 4
        : 3

    geometry.setAttribute(attributeName, new THREE.BufferAttribute(new Float32Array(bytes), itemSize))
  }

  const uv = geometry.getAttribute('uv')
  if (uv && !geometry.getAttribute('uv2')) geometry.setAttribute('uv2', uv)
  geometry.computeBoundingSphere()
  return geometry
}

/**
 * @param {THREE.Object3D} object
 * @param {JsonDefinition} definition
 */
function applyTransform (object, definition) {
  if (definition.matrix) {
    const matrix = new THREE.Matrix4().fromArray(definition.matrix)
    matrix.decompose(object.position, object.quaternion, object.scale)
  } else {
    if (definition.position) object.position.fromArray(definition.position)
    if (definition.rotation) object.rotation.fromArray(definition.rotation)
    if (definition.scale) object.scale.fromArray(definition.scale)
  }

  if (definition.castShadow !== undefined) object.castShadow = definition.castShadow
  if (definition.receiveShadow !== undefined) object.receiveShadow = definition.receiveShadow
  if (definition.visible !== undefined) object.visible = definition.visible
  if (definition.userData) object.userData = definition.userData
}

/**
 * @param {JsonDefinition} definition
 * @param {JsonDefinition} sceneTextures
 * @param {Map<string, THREE.Texture>} textures
 * @returns {THREE.Material}
 */
function createMaterial (definition, sceneTextures, textures) {
  const color = definition.color ?? 0xffffff
  const transparent = definition.transparent === true
  const opacity = definition.opacity ?? 1

  if (definition.name === 'grid') {
    return new THREE.MeshBasicMaterial({
      color,
      map: sceneTextures.grid,
      transparent,
      opacity
    })
  }

  if (definition.name === 'shadow') {
    return new THREE.MeshBasicMaterial({
      color,
      map: sceneTextures.shadow,
      transparent: true,
      depthWrite: false,
      opacity
    })
  }

  if (definition.name === 'cache' || definition.name === 'cache2') {
    return new THREE.MeshBasicMaterial({ color, transparent, opacity })
  }

  const matcap = textures.get(`textures/matcaps/${definition.name}.png`)
  if (!matcap) return new THREE.MeshBasicMaterial({ color, transparent, opacity })

  const material = new THREE.ShaderMaterial({
    vertexShader: matcapVertexShader,
    fragmentShader: matcapFragmentShader,
    uniforms: {
      matcapMap: { value: matcap },
      normalMap: { value: textures.get('textures/normal.png') },
      aoMap: { value: textures.get('textures/white.png') },
      rampMap: { value: textures.get('textures/ao_ramp.png') },
      flipY: { value: 0 },
      opacity: { value: opacity }
    },
    transparent,
    depthWrite: !transparent,
    side: definition.name === 'glass' ? THREE.DoubleSide : THREE.FrontSide
  })
  material.name = definition.name
  material.userData['isTruckMatcap'] = true
  material.userData['baseName'] = definition.name
  return material
}

/**
 * @param {THREE.Mesh} mesh
 * @param {THREE.Material} material
 * @param {Map<string, THREE.Texture>} textures
 */
function configureMaterial (mesh, material, textures) {
  if (!(material instanceof THREE.ShaderMaterial) || !material.userData['isTruckMatcap']) return

  /** @param {string} name @param {string} path */
  const setUniformTexture = (name, path) => {
    const uniform = material.uniforms[name]
    if (uniform) uniform.value = textures.get(path) ?? textures.get('textures/white.png')
  }
  /** @param {string} name @param {number} value */
  const setUniformValue = (name, value) => {
    const uniform = material.uniforms[name]
    if (uniform) uniform.value = value
  }

  if (isDescendantOf(mesh, 'head')) setUniformTexture('aoMap', 'textures/head_AO.jpg')
  if (isDescendantOf(mesh, 'rear')) setUniformTexture('aoMap', 'textures/rear_AO.jpg')

  if (isDescendantOf(mesh, 'headlights')) setUniformTexture('aoMap', 'textures/white.png')
  if (mesh.name === 'rear_lamps') setUniformTexture('aoMap', 'textures/white.png')
  if (mesh.name === 'head_main') material.defines['USE_RAMP'] = true

  if (isDescendantOf(mesh, 'wheels')) {
    const wheelSide = isDescendantOf(mesh, 'front_wheels') ? 'front' : 'rear'
    const materialName = material.userData['baseName']
    setUniformTexture('aoMap', `textures/${wheelSide}_wheel/${materialName}_AO.jpg`)
    setUniformTexture('normalMap', `textures/${wheelSide}_wheel/${materialName}_Normal.jpg`)
    material.defines['USE_NORMALMAP'] = true

    if (mesh.name === 'front_rim_center') {
      setUniformTexture('matcapMap', 'textures/matcaps/front_glossy_metal_black.png')
    }
    if (mesh.name === 'rear_rim_center') {
      setUniformTexture('matcapMap', 'textures/matcaps/rear_glossy_metal_black.png')
    }
  }

  if (mesh.name === 'headlights_covers') {
    material.transparent = true
    setUniformValue('opacity', 0.85)
    material.depthWrite = false
  }

  if (mesh.name === 'rear_lights_inner' || mesh.name === 'rear_lights_outer') {
    material.transparent = true
    material.depthWrite = false
  }

  material.needsUpdate = true
}

/**
 * @param {JsonDefinition} definition
 * @param {Map<string, THREE.BufferGeometry>} geometries
 * @param {Map<string, THREE.Material>} materials
 * @param {Map<string, THREE.Texture>} textures
 * @returns {THREE.Object3D}
 */
function createObject (definition, geometries, materials, textures) {
  let object

  switch (definition.type) {
    case 'Scene':
      object = new THREE.Scene()
      break
    case 'Mesh': {
      const material = materials.get(definition.material)?.clone() ?? new THREE.MeshBasicMaterial()
      object = new THREE.Mesh(geometries.get(definition.geometry), material)
      break
    }
    case 'DirectionalLight':
      object = new THREE.DirectionalLight(definition.color, definition.intensity)
      object.visible = false
      break
    case 'PerspectiveCamera':
      object = new THREE.PerspectiveCamera(definition.fov, definition.aspect, definition.near, definition.far)
      break
    default:
      object = new THREE.Group()
  }

  object.uuid = definition.uuid
  if (definition.name) object.name = definition.name
  applyTransform(object, definition)

  for (const child of definition.children || []) object.add(createObject(child, geometries, materials, textures))

  return object
}

async function loadTextures () {
  const loader = new THREE.TextureLoader()
  /** @type {Array<[string, THREE.Texture]>} */
  const entries = await Promise.all(texturePaths.map(async (path) => {
    const texture = await loader.loadAsync(assetUrl(`transmit/${path}`))
    // The custom shader owns sRGB conversion explicitly, matching Panic's r79 shader.
    // Uploading these as sRGB textures would make WebGL decode them before the shader samples them.
    texture.colorSpace = THREE.NoColorSpace
    texture.needsUpdate = true
    return /** @type {[string, THREE.Texture]} */ ([path, texture])
  }))

  return new Map(entries)
}

/** @returns {Promise<THREE.Scene>} */
async function loadScene () {
  const [sceneResponse, binaryResponse, textures, grid, shadow] = await Promise.all([
    fetch(assetUrl('scenes/transmit.json')),
    fetch(assetUrl('scenes/data/transmit.bin')),
    loadTextures(),
    new THREE.TextureLoader().loadAsync(assetUrl('transmit/maps/grid_diffuse.jpg')),
    new THREE.TextureLoader().loadAsync(assetUrl('transmit/maps/shadow.png'))
  ])

  if (!sceneResponse.ok || !binaryResponse.ok) throw new Error('Unable to load the Transmit scene assets')

  const sceneData = await sceneResponse.json()
  const binary = await binaryResponse.arrayBuffer()
  const sceneTextures = {
    grid,
    shadow
  }

  grid.colorSpace = THREE.SRGBColorSpace
  grid.wrapS = THREE.RepeatWrapping
  grid.wrapT = THREE.RepeatWrapping
  grid.offset.set(0.08, 0)
  grid.repeat.set(20, 20)
  grid.needsUpdate = true

  /** @type {Array<[string, THREE.BufferGeometry]>} */
  const geometryEntries = sceneData.geometries.map(
    /** @param {JsonDefinition} geometry */
    (geometry) => [geometry.uuid, createGeometry(geometry, binary)]
  )
  const geometries = new Map(geometryEntries)
  /** @type {Array<[string, THREE.Material]>} */
  const materialEntries = sceneData.materials.map(
    /** @param {JsonDefinition} material */
    (material) => [material.uuid, createMaterial(material, sceneTextures, textures)]
  )
  const materials = new Map(materialEntries)

  const scene = /** @type {THREE.Scene} */ (createObject(sceneData.object, geometries, materials, textures))
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) configureMaterial(object, object.material, textures)
  })
  return scene
}

/**
 * @param {THREE.Scene} scene
 * @param {HTMLElement} viewer
 * @param {{fullOrbit?: boolean}} [options]
 */
function setupRenderer (scene, viewer, options = {}) {
  const fullOrbit = options.fullOrbit === true
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  viewer.append(renderer.domElement)

  const camera = new THREE.PerspectiveCamera(15, 1, 1, 1000)
  camera.position.set(18, 18, 18)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.enableZoom = fullOrbit
  controls.enablePan = fullOrbit
  controls.enableDamping = true
  controls.dampingFactor = fullOrbit ? 0.08 : 0.1
  controls.autoRotate = !fullOrbit
  controls.autoRotateSpeed = 0.12
  controls.enableRotate = true
  controls.rotateSpeed = fullOrbit ? 0.4 : 0.12
  controls.zoomSpeed = fullOrbit ? 1.1 : 1
  controls.panSpeed = fullOrbit ? 1.1 : 1

  const updateCameraAngle = () => {
    const scrollRange = 400
    const scrollFactor = THREE.MathUtils.clamp(window.scrollY / scrollRange, 0, 1)
    const angle = THREE.MathUtils.lerp(1.19, Math.PI / 2, scrollFactor)
    controls.minPolarAngle = angle
    controls.maxPolarAngle = angle
    controls.update()
  }

  if (fullOrbit) {
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI
    controls.minAzimuthAngle = -Infinity
    controls.maxAzimuthAngle = Infinity
  }

  const resize = () => {
    const width = viewer.offsetWidth
    const height = viewer.offsetHeight
    if (!width || !height) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  let frame = 0
  let running = true
  const render = () => {
    if (!running) return
    controls.update()
    renderer.render(scene, camera)
    frame = window.requestAnimationFrame(render)
  }

  if (!fullOrbit) window.addEventListener('scroll', updateCameraAngle, { passive: true })
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden
    if (running) {
      window.cancelAnimationFrame(frame)
      render()
    }
  })

  resize()
  if (!fullOrbit) updateCameraAngle()
  render()

  return { renderer, resize }
}

async function start () {
  if (!constrainedContainer || !fullOrbitContainer || !webglContext || reducedMotion) return

  const scene = await loadScene()
  setupRenderer(scene, constrainedContainer)
  setupRenderer(scene.clone(true), fullOrbitContainer, { fullOrbit: true })

  const fallbacks = /** @type {NodeListOf<HTMLImageElement>} */ (document.querySelectorAll('.truck-static-fallback'))
  for (const fallback of fallbacks) fallback.hidden = true
  if (articleHeader) articleHeader.dataset['loaded'] = 'yes'
}

start().catch((error) => {
  console.error('Unable to render the Transmit truck', error)
})
