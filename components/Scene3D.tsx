'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

function ChromeVinyl() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      // Медленно вращаться вокруг своей оси
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow rotation={[Math.PI / 2.5, 0, 0]}>
        {/* Гладкий металлический диск (футуристичная виниловая пластинка) */}
        <cylinderGeometry args={[2.5, 2.5, 0.05, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={1} 
          roughness={0.1} 
        />
      </mesh>
    </Float>
  )
}

export default function Scene3D() {
  return (
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
        <ambientLight intensity={0.5} />
        
        {/* Яркий бирюзовый (cyan) SpotLight, который красиво бликует на металле */}
        <spotLight 
          position={[4, 5, 5]} 
          intensity={6} 
          color="#00CECB" 
          penumbra={0.5} 
          distance={20}
        />
        <spotLight 
          position={[-5, -2, 5]} 
          intensity={3} 
          color="#00E5FF" 
          penumbra={0.8} 
          distance={20}
        />
        
        <ChromeVinyl />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
