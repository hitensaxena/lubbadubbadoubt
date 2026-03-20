'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, Torus, MeshDistortMaterial, Environment, Stars, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedShapes() {
  const groupRef = useRef<THREE.Group>(null)

  // Gentle floating motion based on mouse position (parallax)
  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle mouse parallax
      const targetX = (state.pointer.x * 0.2)
      const targetY = (state.pointer.y * 0.2)
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Primary Distorted Sphere */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]} position={[-3, 1, -5]}>
          <MeshDistortMaterial
            color="#a78bfa" // Primary pastel purple
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>
      </Float>

      {/* Secondary Torus */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Torus args={[1.2, 0.4, 32, 100]} position={[3.5, 0.5, -4]} rotation={[Math.PI / 4, 0, 0]}>
          <meshPhysicalMaterial
            color="#22d3ee" // Secondary cyan
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.5} // adds glass-like transparency
            thickness={0.5}
          />
        </Torus>
      </Float>

      {/* Tertiary Distorted Sphere */}
      <Float speed={2.5} rotationIntensity={1} floatIntensity={2.5}>
        <Sphere args={[0.8, 32, 32]} position={[0, -2.5, -3]}>
          <MeshDistortMaterial
            color="#f9a8d4" // Tertiary pink
            attach="material"
            distort={0.5}
            speed={3}
            roughness={0.3}
            metalness={0.7}
            clearcoat={0.5}
          />
        </Sphere>
      </Float>
      
      {/* Small accent floating orbs */}
      <Float speed={3} rotationIntensity={2} floatIntensity={4}>
        <Sphere args={[0.3, 32, 32]} position={[2.5, -1.5, -2]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>
      <Float speed={2.2} rotationIntensity={2} floatIntensity={3.5}>
        <Sphere args={[0.2, 32, 32]} position={[-2, -2, -1]}>
          <meshStandardMaterial color="#ffffff" emissive="#22d3ee" emissiveIntensity={1} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>
    </group>
  )
}

export default function ThreeDBackground() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Prevent hydration mismatch by rendering canvas only on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      {/* Ensure canvas covers the background without interacting with clicks unless specified */}
      <Canvas dpr={[1, 2]} eventSource={document.body} eventPrefix="client">
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#8b5cf6" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ec4899" />
        
        <AnimatedShapes />
        {/* Adds depth with subtle stars */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
