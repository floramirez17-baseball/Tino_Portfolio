import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const TARGETS = {
  academic: { x: -2.35, height: 5.8, color: 0x29384d, glass: 0x3f6f8f, accent: 0xffcf72 },
  personal: { x: 2.35, height: 5.15, color: 0x31364f, glass: 0x4e718c, accent: 0x9ed8ff },
}

function makeBuilding(target, config) {
  const group = new THREE.Group()
  group.name = target
  group.userData.target = target
  group.position.x = config.x

  const height = config.height

  // Core dimensions
  const bW = 1.52
  const bD = 1.18
  const baseH = 1.08
  const baseExtrude = 0.14

  // ── Materials ──────────────────────────────────────────────────────
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x9a9888, roughness: 0.84, metalness: 0.03 })
  const stoneCapMat = new THREE.MeshStandardMaterial({ color: 0xb6b3a6, roughness: 0.72, metalness: 0.05 })
  const pilasterMat = new THREE.MeshStandardMaterial({ color: 0xaeab9e, roughness: 0.78, metalness: 0.04 })
  const stepMat = new THREE.MeshStandardMaterial({ color: 0x8e8c82, roughness: 0.88, metalness: 0.03 })

  const towerMat = new THREE.MeshStandardMaterial({ color: config.color, roughness: 0.46, metalness: 0.24 })
  const towerShadeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color).multiplyScalar(0.66),
    roughness: 0.58,
    metalness: 0.18,
  })
  const finMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color).lerp(new THREE.Color(0xd0e8ff), 0.13),
    roughness: 0.42,
    metalness: 0.3,
  })

  const glassMat = new THREE.MeshStandardMaterial({
    color: config.glass,
    emissive: config.accent,
    emissiveIntensity: 0.42,
    roughness: 0.16,
    metalness: 0.54,
  })
  const spandrelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.color).lerp(new THREE.Color(0x06101e), 0.42),
    roughness: 0.52,
    metalness: 0.38,
  })
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x0a1520,
    emissive: config.accent,
    emissiveIntensity: 0.22,
    roughness: 0.18,
    metalness: 0.6,
  })
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x8898a8, roughness: 0.3, metalness: 0.72 })

  // ── Podium ─────────────────────────────────────────────────────────
  const podW = bW + baseExtrude * 2
  const podD = bD + baseExtrude * 2

  const podium = new THREE.Mesh(new THREE.BoxGeometry(podW, baseH, podD), stoneMat)
  podium.position.y = baseH / 2
  podium.castShadow = true
  podium.receiveShadow = true
  group.add(podium)

  // Podium cornice
  const podCap = new THREE.Mesh(new THREE.BoxGeometry(podW + 0.08, 0.1, podD + 0.08), stoneCapMat)
  podCap.position.y = baseH + 0.05
  group.add(podCap)

  // Podium front pilasters (5 vertical columns across front face)
  const pilGeo = new THREE.BoxGeometry(0.076, baseH, 0.068)
  for (let i = 0; i < 5; i++) {
    const pil = new THREE.Mesh(pilGeo, pilasterMat)
    pil.position.set(-podW / 2 + 0.12 + i * (podW - 0.24) / 4, baseH / 2, podD / 2 + 0.034)
    pil.castShadow = true
    group.add(pil)
  }

  // Side pilasters (corners)
  for (const sx of [-1, 1]) {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(0.068, baseH, 0.076), pilasterMat)
    pil.position.set(sx * (podW / 2 + 0.034), baseH / 2, 0)
    group.add(pil)
  }

  // ── Tower body ─────────────────────────────────────────────────────
  const towerH = height - baseH

  const tower = new THREE.Mesh(new THREE.BoxGeometry(bW, towerH, bD), towerMat)
  tower.position.y = baseH + towerH / 2
  tower.castShadow = true
  tower.receiveShadow = true
  group.add(tower)

  // Side wing
  const wingW = 0.26
  const wing = new THREE.Mesh(new THREE.BoxGeometry(wingW, towerH * 0.9, bD + 0.08), towerShadeMat)
  wing.position.set(bW / 2 + wingW / 2, baseH + towerH * 0.45, -0.05)
  wing.castShadow = true
  wing.receiveShadow = true
  group.add(wing)

  // ── Facade vertical fins ───────────────────────────────────────────
  const finProtrude = 0.054
  const finGeo = new THREE.BoxGeometry(0.038, towerH, finProtrude)
  for (let i = 0; i < 6; i++) {
    const fin = new THREE.Mesh(finGeo, finMat)
    fin.position.set(-bW / 2 + 0.1 + i * (bW - 0.2) / 5, baseH + towerH / 2, bD / 2 + finProtrude / 2)
    fin.castShadow = true
    group.add(fin)
  }

  // ── Windows with spandrel panels (lower tower) ─────────────────────
  const winRows = target === 'academic' ? 15 : 13
  const winCols = 5
  const winW = 0.1
  const winH = 0.1
  const spndH = 0.068
  const spacingY = (towerH * 0.6) / winRows
  const spacingX = (bW - 0.18) / (winCols - 1)
  const paneGeo = new THREE.BoxGeometry(winW, winH, 0.025)
  const spandGeo = new THREE.BoxGeometry(bW * 0.88, spndH, 0.017)

  for (let row = 0; row < winRows; row++) {
    const y = baseH + 0.26 + row * spacingY
    const spandrel = new THREE.Mesh(spandGeo, spandrelMat)
    spandrel.position.set(0, y - spacingY * 0.4, bD / 2 + 0.013)
    group.add(spandrel)
    for (let col = 0; col < winCols; col++) {
      const pane = new THREE.Mesh(paneGeo, glassMat)
      pane.position.set(-bW / 2 + 0.09 + col * spacingX, y, bD / 2 + 0.015)
      group.add(pane)
    }
  }

  // ── Setback ────────────────────────────────────────────────────────
  const setbackY = baseH + towerH * 0.63
  const sbW = bW * 0.76
  const sbD = bD * 0.8
  const sbH = height - setbackY - 0.22

  // Setback ledge
  const ledge = new THREE.Mesh(new THREE.BoxGeometry(bW + 0.1, 0.13, bD + 0.1), stoneCapMat)
  ledge.position.y = setbackY + 0.065
  ledge.castShadow = true
  group.add(ledge)

  const upperTower = new THREE.Mesh(new THREE.BoxGeometry(sbW, sbH, sbD), towerMat)
  upperTower.position.y = setbackY + 0.13 + sbH / 2
  upperTower.castShadow = true
  group.add(upperTower)

  // Upper fins
  const upperFinGeo = new THREE.BoxGeometry(0.038, sbH, finProtrude)
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(upperFinGeo, finMat)
    fin.position.set(-sbW / 2 + 0.08 + i * (sbW - 0.16) / 3, setbackY + 0.13 + sbH / 2, sbD / 2 + finProtrude / 2)
    fin.castShadow = true
    group.add(fin)
  }

  // Upper windows
  const upperWinRows = Math.max(1, Math.floor(sbH / spacingY) - 1)
  const uPaneGeo = new THREE.BoxGeometry(winW, winH, 0.025)
  const uSpandGeo = new THREE.BoxGeometry(sbW * 0.86, spndH, 0.017)
  for (let row = 0; row < upperWinRows; row++) {
    const y = setbackY + 0.32 + row * spacingY
    const spandrel = new THREE.Mesh(uSpandGeo, spandrelMat)
    spandrel.position.set(0, y - spacingY * 0.4, sbD / 2 + 0.013)
    group.add(spandrel)
    for (let col = 0; col < 4; col++) {
      const pane = new THREE.Mesh(uPaneGeo, glassMat)
      pane.position.set(-sbW / 2 + 0.08 + col * (sbW - 0.16) / 3, y, sbD / 2 + 0.015)
      group.add(pane)
    }
  }

  // ── Crown: parapet + penthouse ─────────────────────────────────────
  const parapetH = 0.2
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(sbW + 0.07, parapetH, sbD + 0.07), stoneMat)
  parapet.position.y = height + parapetH / 2
  parapet.castShadow = true
  group.add(parapet)

  const pCap = new THREE.Mesh(new THREE.BoxGeometry(sbW + 0.15, 0.055, sbD + 0.15), stoneCapMat)
  pCap.position.y = height + parapetH + 0.0275
  group.add(pCap)

  const pentH = 0.42
  const pent = new THREE.Mesh(new THREE.BoxGeometry(sbW * 0.58, pentH, sbD * 0.68), towerMat)
  pent.position.y = height + parapetH + 0.055 + pentH / 2
  pent.castShadow = true
  group.add(pent)

  const pentCap = new THREE.Mesh(new THREE.BoxGeometry(sbW * 0.58 + 0.07, 0.055, sbD * 0.68 + 0.07), stoneCapMat)
  pentCap.position.y = height + parapetH + 0.055 + pentH + 0.0275
  group.add(pentCap)

  // Antenna
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.017, 0.9, 8), metalMat)
  antenna.position.set(0.11, height + parapetH + 0.055 + pentH + 0.055 + 0.45, 0)
  group.add(antenna)

  const antBase = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.034, 10), metalMat)
  antBase.position.set(0.11, height + parapetH + 0.055 + pentH + 0.055, 0)
  group.add(antBase)

  // ── Lobby / entrance ──────────────────────────────────────────────
  const lobbyW = bW * 0.62
  const lobbyH = baseH * 0.8

  // Lobby glass curtain wall
  const lobbyGlassMat = new THREE.MeshStandardMaterial({
    color: config.glass,
    emissive: config.accent,
    emissiveIntensity: 0.28,
    roughness: 0.1,
    metalness: 0.5,
  })
  const lobbyGlass = new THREE.Mesh(new THREE.BoxGeometry(lobbyW, lobbyH, 0.048), lobbyGlassMat)
  lobbyGlass.position.set(0, lobbyH / 2 + 0.05, podD / 2 + 0.015)
  group.add(lobbyGlass)

  // Lobby frame border strips
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xb0ab9e, roughness: 0.7, metalness: 0.08 })
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(lobbyW + 0.1, 0.058, 0.058), frameMat)
  frameTop.position.set(0, lobbyH + 0.07, podD / 2 + 0.018)
  group.add(frameTop)
  for (const fx of [-(lobbyW / 2 + 0.03), lobbyW / 2 + 0.03]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.058, lobbyH + 0.07, 0.058), frameMat)
    side.position.set(fx, (lobbyH + 0.07) / 2, podD / 2 + 0.018)
    group.add(side)
  }

  // Doors (double)
  const doorH = lobbyH * 0.74
  const doorGeo = new THREE.BoxGeometry(0.2, doorH, 0.044)
  for (const dx of [-0.12, 0.12]) {
    const door = new THREE.Mesh(doorGeo, doorMat)
    door.position.set(dx, doorH / 2 + 0.04, podD / 2 + 0.04)
    group.add(door)
  }

  // Canopy over entrance
  const canopyD = 0.56
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(lobbyW + 0.22, 0.054, canopyD), stoneCapMat)
  canopy.position.set(0, lobbyH * 0.8, podD / 2 + canopyD / 2 + 0.04)
  canopy.castShadow = true
  group.add(canopy)

  // Canopy support columns
  for (const cx of [-(lobbyW / 2 + 0.07), lobbyW / 2 + 0.07]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.04, lobbyH * 0.8, 0.04), stoneMat)
    col.position.set(cx, lobbyH * 0.4, podD / 2 + canopyD + 0.04)
    col.castShadow = true
    group.add(col)
  }

  // Steps
  const steps = new THREE.Mesh(new THREE.BoxGeometry(podW + 0.16, 0.062, 0.72), stepMat)
  steps.position.set(0, 0.031, podD / 2 + 0.44)
  steps.receiveShadow = true
  group.add(steps)

  const riser = new THREE.Mesh(new THREE.BoxGeometry(podW + 0.06, 0.12, 0.3), stepMat)
  riser.position.set(0, 0.06, podD / 2 + 0.18)
  riser.receiveShadow = true
  group.add(riser)

  // ── Upper-floor highlight (animation target) ───────────────────────
  const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(sbW * 0.76, 0.34, 0.032), glassMat)
  upperFloor.name = `${target}-upper-floor`
  upperFloor.position.set(0, height - 0.95, sbD / 2 + 0.02)
  group.add(upperFloor)

  return group
}

export default function ProjectsHub3D({ entering, onEnter, hovering }) {
  const mountRef = useRef(null)
  const stateRef = useRef(null)
  const onEnterRef = useRef(onEnter)
  const hoveringRef = useRef(hovering)

  useEffect(() => {
    onEnterRef.current = onEnter
  }, [onEnter])

  useEffect(() => {
    hoveringRef.current = hovering
  }, [hovering])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x17233a, 8, 18)

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60)
    camera.position.set(0, 3.4, 9.2)
    camera.lookAt(0, 2.4, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight(0xffd7a0, 0x16263f, 1.15)
    scene.add(hemi)

    const sun = new THREE.DirectionalLight(0xffc071, 3.2)
    sun.position.set(5.5, 7.5, 5.2)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.left = -8
    sun.shadow.camera.right = 8
    sun.shadow.camera.top = 8
    sun.shadow.camera.bottom = -8
    scene.add(sun)

    const coolFill = new THREE.DirectionalLight(0x7fb7ff, 0.65)
    coolFill.position.set(-5, 3, 4)
    scene.add(coolFill)

    const groundMat = new THREE.MeshStandardMaterial({ color: 0x202834, roughness: 0.86, metalness: 0.04 })
    const ground = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.08, 6.4), groundMat)
    ground.position.set(0, -0.04, 0.9)
    ground.receiveShadow = true
    scene.add(ground)

    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x6a7078, roughness: 0.72, metalness: 0.08 })
    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.07, 1.12), sidewalkMat)
    sidewalk.position.set(0, 0.02, 1.95)
    sidewalk.receiveShadow = true
    scene.add(sidewalk)

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x101722, roughness: 0.9, metalness: 0.02 })
    const road = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.05, 1.8), roadMat)
    road.position.set(0, -0.01, 3.05)
    road.receiveShadow = true
    scene.add(road)

    const buildings = Object.entries(TARGETS).map(([target, config]) => makeBuilding(target, config))
    buildings.forEach((building) => scene.add(building))

    const distantMat = new THREE.MeshStandardMaterial({ color: 0x121c2e, roughness: 0.78, metalness: 0.08 })
    for (let i = 0; i < 9; i += 1) {
      const h = 1.4 + (i % 4) * 0.55
      const distant = new THREE.Mesh(new THREE.BoxGeometry(0.65 + (i % 2) * 0.22, h, 0.75), distantMat)
      distant.position.set(-4.2 + i * 1.05, h / 2 - 0.02, -1.65 - (i % 3) * 0.35)
      distant.receiveShadow = true
      scene.add(distant)
    }

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hovered = null
    let pointerX = 0
    let pointerY = 0
    let activeEnter = null

    function resize() {
      const rect = mount.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
    }

    function setPointer(event) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      pointerX = pointer.x
      pointerY = pointer.y
    }

    function findTarget(object) {
      let current = object
      while (current) {
        if (current.userData?.target) return current.userData.target
        current = current.parent
      }
      return null
    }

    function getTargetFromEvent(event) {
      setPointer(event)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(buildings, true)
      return hits[0] ? findTarget(hits[0].object) : null
    }

    function handlePointerMove(event) {
      const target = getTargetFromEvent(event)
      hovered = target
      renderer.domElement.style.cursor = target ? 'pointer' : 'default'
    }

    function handleClick(event) {
      const target = getTargetFromEvent(event)
      if (target) onEnterRef.current(target)
    }

    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('click', handleClick)
    window.addEventListener('resize', resize)
    resize()

    let frameId = 0
    const clock = new THREE.Clock()
    function animate() {
      const elapsed = clock.getElapsedTime()
      const desiredX = pointerX * 0.18
      const desiredY = 3.35 + pointerY * 0.08

      if (activeEnter) {
        const targetConfig = TARGETS[activeEnter]
        camera.position.lerp(new THREE.Vector3(targetConfig.x * 0.72, 4.7, 4.4), 0.08)
        camera.lookAt(targetConfig.x * 0.78, targetConfig.height - 0.8, 0.5)
      } else {
        camera.position.x += (desiredX - camera.position.x) * 0.045
        camera.position.y += (desiredY - camera.position.y) * 0.045
        camera.lookAt(pointerX * 0.16, 2.55 + pointerY * 0.06, 0)
      }

      const effectiveHover = hovered || hoveringRef.current

      buildings.forEach((building) => {
        const target = building.userData.target
        const baseY = effectiveHover === target ? 0.1 : 0
        const baseScale = effectiveHover === target ? 1.035 : 1
        building.position.y += (baseY - building.position.y) * 0.08
        building.scale.x += (baseScale - building.scale.x) * 0.08
        building.scale.y += (baseScale - building.scale.y) * 0.08
        building.scale.z += (baseScale - building.scale.z) * 0.08
        building.rotation.y = (target === 'academic' ? 0.05 : -0.05) + Math.sin(elapsed * 0.32 + building.position.x) * 0.01

        const upperFloor = building.getObjectByName(`${target}-upper-floor`)
        if (upperFloor?.material) {
          upperFloor.material.emissiveIntensity = effectiveHover === target || activeEnter === target ? 0.95 : 0.42
        }
      })

      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    stateRef.current = {
      setEntering(target) {
        activeEnter = target
      },
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener('click', handleClick)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  useEffect(() => {
    stateRef.current?.setEntering(entering)
  }, [entering])

  return <div ref={mountRef} className="projects-hub-3d" aria-hidden="true" />
}
