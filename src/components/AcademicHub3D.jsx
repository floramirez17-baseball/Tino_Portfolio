import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Map each project key to a short label (two lines max for nameplate)
const DOORS = [
  { key: 'Real Estate Finance',                    line1: 'Real Estate',       line2: 'Finance',          side: 'left',  z: -0.9 },
  { key: 'AI Bubble Research',                     line1: 'AI Bubble',         line2: 'Research',         side: 'right', z: -0.9 },
  { key: "Should AVM's Replace Human Appraisers?", line1: "AVMs vs.",          line2: 'Appraisers',       side: 'left',  z: -3.8 },
  { key: 'Stock Analysis App',                     line1: 'Stock Analysis',    line2: 'App',              side: 'right', z: -3.8 },
]

// Hallway dimensions
const HW = 3.2   // width
const HH = 2.75  // height
const HL = 10    // length (z: 0 → -HL)
const WALL_X = HW / 2

// Door geometry
const DOOR_W = 0.96
const DOOR_H = 2.12
const DOOR_FRAME_T = 0.06  // frame thickness

function nameplateTexture(line1, line2) {
  const w = 256
  const h = 96
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const ctx = cv.getContext('2d')

  ctx.fillStyle = '#f5f3ee'
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = '#b0a890'
  ctx.lineWidth = 2
  ctx.strokeRect(1, 1, w - 2, h - 2)

  ctx.fillStyle = '#0c1f3a'
  ctx.font = 'bold 22px "Times New Roman", serif'
  ctx.textAlign = 'center'
  ctx.fillText(line1, w / 2, 36)

  ctx.font = '20px "Times New Roman", serif'
  ctx.fillStyle = '#2a2a2a'
  ctx.fillText(line2, w / 2, 64)

  return new THREE.CanvasTexture(cv)
}

function buildHallway(scene) {
  const wallMat  = new THREE.MeshStandardMaterial({ color: 0xf2f0eb, roughness: 0.82, metalness: 0.02 })
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xd8d4cc, roughness: 0.38, metalness: 0.08 })
  const ceilMat  = new THREE.MeshStandardMaterial({ color: 0xfafaf8, roughness: 0.9,  metalness: 0.0  })
  const skirtMat = new THREE.MeshStandardMaterial({ color: 0xe0ddd6, roughness: 0.7,  metalness: 0.04 })

  // Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(HW, 0.04, HL + 2), floorMat)
  floor.position.set(0, -0.02, -HL / 2 + 1)
  floor.receiveShadow = true
  scene.add(floor)

  // Ceiling
  const ceil = new THREE.Mesh(new THREE.BoxGeometry(HW, 0.06, HL + 2), ceilMat)
  ceil.position.set(0, HH + 0.03, -HL / 2 + 1)
  scene.add(ceil)

  // Left wall
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.06, HH, HL + 2), wallMat)
  leftWall.position.set(-WALL_X - 0.03, HH / 2, -HL / 2 + 1)
  leftWall.receiveShadow = true
  scene.add(leftWall)

  // Right wall
  const rightWall = leftWall.clone()
  rightWall.position.x = WALL_X + 0.03
  scene.add(rightWall)

  // End wall
  const endWall = new THREE.Mesh(new THREE.BoxGeometry(HW + 0.12, HH, 0.08), wallMat)
  endWall.position.set(0, HH / 2, -HL)
  scene.add(endWall)

  // Baseboard (left & right)
  const skirtGeo = new THREE.BoxGeometry(0.055, 0.14, HL + 2)
  ;[-WALL_X + 0.026, WALL_X - 0.026].forEach((sx) => {
    const s = new THREE.Mesh(skirtGeo, skirtMat)
    s.position.set(sx, 0.07, -HL / 2 + 1)
    scene.add(s)
  })

  // Crown molding (left & right)
  const crownGeo = new THREE.BoxGeometry(0.055, 0.09, HL + 2)
  ;[-WALL_X + 0.026, WALL_X - 0.026].forEach((sx) => {
    const c = new THREE.Mesh(crownGeo, skirtMat)
    c.position.set(sx, HH - 0.045, -HL / 2 + 1)
    scene.add(c)
  })

  // Ceiling light panels (4 evenly spaced down the hall)
  const lightPanelMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff8f0,
    emissiveIntensity: 1.6,
    roughness: 1,
    metalness: 0,
  })
  const panelGeo = new THREE.BoxGeometry(1.4, 0.01, 0.36)
  const panelZs = [-0.8, -2.1, -3.8, -5.4]
  panelZs.forEach((pz) => {
    const panel = new THREE.Mesh(panelGeo, lightPanelMat)
    panel.position.set(0, HH - 0.005, pz)
    scene.add(panel)

    // Point light below each panel
    const pl = new THREE.PointLight(0xfff4e8, 1.4, 4.5)
    pl.position.set(0, HH - 0.1, pz)
    scene.add(pl)
  })

  // Floor tile grid lines (subtle)
  const tileLineMat = new THREE.MeshStandardMaterial({ color: 0xc4bfb6, roughness: 0.6, metalness: 0.0 })
  for (let tz = 0; tz > -HL; tz -= 0.9) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(HW, 0.005, 0.018), tileLineMat)
    line.position.set(0, 0.022, tz)
    scene.add(line)
  }
  for (let tx = -HW / 2; tx <= HW / 2; tx += 0.9) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.005, HL + 2), tileLineMat)
    line.position.set(tx, 0.022, -HL / 2 + 1)
    scene.add(line)
  }
}

function buildDoors(scene) {
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2a2824, roughness: 0.52, metalness: 0.38 })
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xc8dce8,
    transparent: true,
    opacity: 0.38,
    roughness: 0.06,
    metalness: 0.12,
  })
  const glassHoverMat = new THREE.MeshStandardMaterial({
    color: 0xd8ecf8,
    emissive: 0x6ab8e8,
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: 0.52,
    roughness: 0.06,
    metalness: 0.12,
  })

  const doorMeshes = []

  DOORS.forEach((door) => {
    const group = new THREE.Group()
    group.userData.doorKey = door.key

    const sx = door.side === 'left' ? -WALL_X : WALL_X
    const rotY = door.side === 'left' ? Math.PI / 2 : -Math.PI / 2

    // Frame sides
    const frameH = DOOR_H + DOOR_FRAME_T * 2
    ;[-DOOR_W / 2, DOOR_W / 2].forEach((dx) => {
      const fs = new THREE.Mesh(new THREE.BoxGeometry(DOOR_FRAME_T, frameH, DOOR_FRAME_T), frameMat)
      fs.position.set(dx, frameH / 2, 0)
      group.add(fs)
    })
    // Frame top
    const ft = new THREE.Mesh(new THREE.BoxGeometry(DOOR_W + DOOR_FRAME_T * 2, DOOR_FRAME_T, DOOR_FRAME_T), frameMat)
    ft.position.set(0, frameH - DOOR_FRAME_T / 2, 0)
    group.add(ft)
    // Frame bottom threshold
    const fb = new THREE.Mesh(new THREE.BoxGeometry(DOOR_W + DOOR_FRAME_T * 2, DOOR_FRAME_T * 0.5, DOOR_FRAME_T), frameMat)
    fb.position.set(0, DOOR_FRAME_T * 0.25, 0)
    group.add(fb)

    // Glass pane
    const glass = new THREE.Mesh(new THREE.BoxGeometry(DOOR_W - 0.04, DOOR_H - 0.04, 0.018), glassMat)
    glass.position.set(0, DOOR_H / 2, 0)
    glass.userData.doorKey = door.key
    glass.userData.glassMat = glassMat
    glass.userData.glassHoverMat = glassHoverMat
    group.add(glass)

    // Door handle
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4c08a, roughness: 0.22, metalness: 0.72 })
    const hx = door.side === 'left' ? DOOR_W / 2 - 0.1 : -(DOOR_W / 2 - 0.1)
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.12, 0.022), handleMat)
    handle.position.set(hx, DOOR_H * 0.52, 0.012)
    group.add(handle)

    // Nameplate (below handle)
    const tex = nameplateTexture(door.line1, door.line2)
    const plateMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.08 })
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.135, 0.012), plateMat)
    plate.position.set(0, DOOR_H * 0.38, 0.012)
    group.add(plate)

    // Wall inset (slight depth behind door frame)
    const inset = new THREE.Mesh(
      new THREE.BoxGeometry(DOOR_W + DOOR_FRAME_T * 2 + 0.02, DOOR_H + DOOR_FRAME_T * 2 + 0.02, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xe8e5df, roughness: 0.9, metalness: 0.0 })
    )
    inset.position.set(0, (DOOR_H + DOOR_FRAME_T * 2) / 2, -0.04)
    group.add(inset)

    group.rotation.y = rotY
    group.position.set(sx, 0, door.z)
    scene.add(group)

    doorMeshes.push({ group, glass, key: door.key, glassMat, glassHoverMat })
  })

  return doorMeshes
}

export default function AcademicHub3D({ onSelect, hoveredKey }) {
  const mountRef = useRef(null)
  const hoverKeyRef = useRef(hoveredKey)

  useEffect(() => {
    hoverKeyRef.current = hoveredKey
  }, [hoveredKey])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0eee9)
    scene.fog = new THREE.FogExp2(0xf0eee9, 0.045)

    const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 30)
    camera.position.set(0, 1.55, 4.2)
    camera.lookAt(0, 1.55, -8)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    // Ambient
    const ambient = new THREE.AmbientLight(0xfff8f0, 1.8)
    scene.add(ambient)

    // Directional fill from above
    const dir = new THREE.DirectionalLight(0xfff4e8, 0.6)
    dir.position.set(0, 6, 2)
    scene.add(dir)

    buildHallway(scene)
    const doorMeshes = buildDoors(scene)

    // Raycasting
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hovered = null

    function onPointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      const glassMeshes = doorMeshes.map((d) => d.glass)
      const hits = raycaster.intersectObjects(glassMeshes, false)
      const hit = hits[0]?.object.userData.doorKey ?? null
      hovered = hit
      renderer.domElement.style.cursor = hit ? 'pointer' : 'default'
    }

    function onClick(e) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(doorMeshes.map((d) => d.glass), false)
      if (hits[0]) onSelect(hits[0].object.userData.doorKey)
    }

    function resize() {
      const rect = mount.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
    }

    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('click', onClick)
    window.addEventListener('resize', resize)
    resize()

    let frameId = 0
    function animate() {
      const effectiveHover = hovered || hoverKeyRef.current

      doorMeshes.forEach(({ glass, key, glassMat, glassHoverMat, group }) => {
        const isHot = effectiveHover === key
        glass.material = isHot ? glassHoverMat : glassMat

        // Subtle door float
        const targetZ = isHot ? 0.04 : 0
        group.children.forEach((child) => {
          if (child === glass) {
            child.position.z += (targetZ - child.position.z) * 0.1
          }
        })
      })

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} aria-hidden="true" />
}
