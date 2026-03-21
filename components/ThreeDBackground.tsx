'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, PerspectiveCamera, Sphere, Stars, Torus } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedShapes() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const targetX = state.pointer.x * 0.12
    const targetY = state.pointer.y * 0.12

    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.035
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.035
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      state.pointer.x * 0.08,
      0.03
    )
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.2}>
        <Sphere args={[1.35, 64, 64]} position={[-2.6, 1.2, -5]}>
          <MeshDistortMaterial
            color="#84c7bc"
            distort={0.24}
            speed={1.4}
            roughness={0.35}
            metalness={0.28}
            clearcoat={0.9}
            clearcoatRoughness={0.12}
            transparent
            opacity={0.85}
          />
        </Sphere>
      </Float>

      <Float speed={1.1} rotationIntensity={0.8} floatIntensity={1}>
        <Torus args={[1.15, 0.24, 40, 120]} position={[2.7, 0.2, -4.2]} rotation={[0.8, 0.4, 0.3]}>
          <meshPhysicalMaterial
            color="#dfab84"
            roughness={0.16}
            metalness={0.44}
            clearcoat={1}
            clearcoatRoughness={0.18}
            transmission={0.25}
            transparent
            opacity={0.74}
          />
        </Torus>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.4}>
        <Sphere args={[0.7, 48, 48]} position={[0.2, -2.2, -3.2]}>
          <MeshDistortMaterial
            color="#a9bed6"
            distort={0.18}
            speed={1.6}
            roughness={0.3}
            metalness={0.18}
            transparent
            opacity={0.65}
          />
        </Sphere>
      </Float>
    </group>
  )
}

export default function ThreeDBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.8,
      }}
    >
      <Canvas dpr={[1, 1.6]} eventSource={document.body} eventPrefix="client">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={42} />
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 4, 4]} intensity={1.2} color="#fff6ec" />
        <pointLight position={[-4, -1, 3]} intensity={0.8} color="#84c7bc" />
        <pointLight position={[0, -4, 1]} intensity={0.6} color="#dfab84" />
        <AnimatedShapes />
        <Stars radius={70} depth={40} count={1200} factor={2.4} saturation={0.2} fade speed={0.15} />
      </Canvas>
    </div>
  )
}
