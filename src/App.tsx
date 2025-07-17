import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Sphere, Ring, Box } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import './App.css'

// glTF 파일 미리 로드
useGLTF.preload('/smart_glasses_with_mi_0716092656_texture.glb')

const SCENARIOS = [
  { key: 'obstacle', label: '장애물/거리 인식' },
  { key: 'ocr', label: 'OCR(텍스트 읽기)' },
  { key: 'env', label: '환경 설명' },
  { key: 'edge', label: '문서 선택/모서리 감지' },
  { key: 'system', label: '시스템 제어' },
  { key: 'onboarding', label: '온보딩/튜토리얼' },
]

// 실제 하드웨어 구조 기반 센서 배치
const PARTS = {
  // 경첩 근처 - 라이다/카메라 센서 집중
  leftHinge: [-0.18, 0.04, 0.08],   // 왼쪽 경첩(라이다/카메라)
  rightHinge: [0.18, 0.04, 0.08],   // 오른쪽 경첩(라이다/카메라)
  
  // 다리 부분 - 스피커/마이크
  leftTemple: [-0.26, 0.02, -0.04], // 왼쪽 다리(스피커/마이크)
  rightTemple: [0.26, 0.02, -0.04], // 오른쪽 다리(스피커/마이크)
  
  // 다리 끝부분 - 햅틱 센서 (방향 알림)
  leftHaptic: [-0.32, 0.01, -0.08], // 왼쪽 다리 끝(햅틱 센서)
  rightHaptic: [0.32, 0.01, -0.08], // 오른쪽 다리 끝(햅틱 센서)
  
  // 터치패드 - 다리 중간
  leftPad: [-0.28, 0.02, -0.06],    // 터치패드(왼쪽 다리 중간)
  rightPad: [0.28, 0.02, -0.06],    // 터치패드(오른쪽 다리 중간)
}

// 파동 애니메이션
function AnimatedWave({ position, color = '#2563eb', scale = 2, speed = 1 }: { position: [number, number, number], color?: string, scale?: number, speed?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (ref.current) {
      const s = 1 + 0.3 * Math.sin(t * 2)
      ref.current.scale.set(s * scale, s * scale, s * scale)
      const mat = Array.isArray(ref.current.material) ? ref.current.material[0] : ref.current.material
      if (mat) {
        (mat as THREE.Material & { opacity?: number }).opacity = 0.35 + 0.25 * Math.abs(Math.sin(t * 2))
      }
    }
  })
  return (
    <Ring
      ref={ref}
      args={[0.012, 0.018, 32]}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial color={color} transparent opacity={0.5} />
    </Ring>
  )
}

// LED 점멸
function BlinkingLED({ position, color = '#ef4444', size = 0.028, speed = 2 }: { position: [number, number, number], color?: string, size?: number, speed?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (ref.current) {
      const mat = Array.isArray(ref.current.material) ? ref.current.material[0] : ref.current.material
      if (mat && mat instanceof THREE.MeshStandardMaterial) {
        mat.emissive = new THREE.Color(color)
        mat.emissiveIntensity = 0.7 + 0.3 * Math.abs(Math.sin(t))
      }
    }
  })
  return (
    <Sphere ref={ref} args={[size, 32, 32]} position={position}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </Sphere>
  )
}

// 진동 애니메이션
function VibratingBox({ position, color = '#facc15', size = [0.024, 0.09, 0.024], speed = 10 }: { position: [number, number, number], color?: string, size?: [number, number, number], speed?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (ref.current) {
      ref.current.position.x = position[0] + 0.004 * Math.sin(t)
      ref.current.position.y = position[1] + 0.002 * Math.sin(t * 1.5)
    }
  })
  return (
    <Box ref={ref} args={size} position={position}>
      <meshStandardMaterial color={color} />
    </Box>
  )
}

function LumiGlasses({ scenario }: { scenario: string }) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/smart_glasses_with_mi_0716092656_texture.glb')

  // 시나리오별 움직임 애니메이션
  useFrame(({ clock }) => {
    if (!group.current) return
    
    const t = clock.getElapsedTime()
    
    switch (scenario) {
      case 'obstacle':
        // 좌우 스캔 움직임
        group.current.rotation.y = Math.sin(t * 0.8) * 0.3
        group.current.rotation.x = Math.sin(t * 0.5) * 0.1
        break
        
      case 'ocr':
        // 텍스트 읽기 - 아래위 스캔
        group.current.rotation.x = Math.sin(t * 0.6) * 0.15
        group.current.position.y = Math.sin(t * 0.4) * 0.02
        break
        
      case 'env':
        // 환경 설명 - 360도 천천히 회전
        group.current.rotation.y = t * 0.2
        group.current.rotation.x = Math.sin(t * 0.3) * 0.1
        break
        
      case 'edge':
        // 모서리 감지 - 정밀한 문서 구분 및 선택
        group.current.rotation.y = Math.sin(t * 0.4) * 0.2  // 천천히 좌우 스캔
        group.current.rotation.x = Math.sin(t * 0.3) * 0.08  // 미세한 상하 조정
        group.current.position.x = Math.sin(t * 0.6) * 0.015  // 문서 간 이동
        group.current.position.z = Math.sin(t * 0.8) * 0.005  // 초점 조정
        break
        
      case 'system':
        // 시스템 제어 - 호흡 효과
        const breathing = Math.sin(t * 1.2) * 0.05
        group.current.position.y = breathing
        group.current.rotation.x = breathing * 0.3
        break
        
      case 'onboarding':
        // 온보딩 - 활발한 움직임
        group.current.rotation.y = Math.sin(t * 0.7) * 0.2
        group.current.rotation.x = Math.sin(t * 0.9) * 0.1
        group.current.position.y = Math.sin(t * 1.1) * 0.03
        break
        
      default:
        // 기본 상태 - 미세한 움직임
        group.current.rotation.y = Math.sin(t * 0.3) * 0.05
        break
    }
  })

  return (
    <group ref={group}>
      {/* 전체 모델 스케일 조정 */}
      <primitive object={scene} scale={0.2} />
      {/* 장애물/거리 인식: 라이다(경첩) + 햅틱(다리 끝) + 음성 안내(스피커) */}
      {scenario === 'obstacle' && (
        <>
          {/* 라이다: 경첩 파동/LED */}
          <BlinkingLED position={PARTS.leftHinge as [number, number, number]} color="#38bdf8" size={0.012} speed={2.5} />
          <BlinkingLED position={PARTS.rightHinge as [number, number, number]} color="#38bdf8" size={0.012} speed={2.5} />
          <AnimatedWave position={PARTS.leftHinge as [number, number, number]} color="#38bdf8" scale={1.5} speed={1.2} />
          <AnimatedWave position={PARTS.rightHinge as [number, number, number]} color="#38bdf8" scale={1.5} speed={1.2} />
          {/* 햅틱: 다리 끝 방향 알림 */}
          <VibratingBox position={PARTS.leftHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={12} />
          <VibratingBox position={PARTS.rightHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={12} />
          {/* 스피커: 음성 안내 */}
          <AnimatedWave position={PARTS.leftTemple as [number, number, number]} color="#34d399" scale={0.8} speed={1.5} />
          <AnimatedWave position={PARTS.rightTemple as [number, number, number]} color="#34d399" scale={0.8} speed={1.5} />
          {/* 텍스트/음성 안내 */}
          <Text position={[0, 0.09, 0.04] as [number, number, number]} fontSize={0.018} color="#38bdf8" anchorX="center" anchorY="middle" outlineColor="#fff" outlineWidth={0.002}>
            장애물 감지: 오른쪽 1m 앞 장애물
          </Text>
        </>
      )}
      {/* OCR(텍스트 읽기): 카메라(경첩) + 터치패드(다리 중간) + 음성 안내(스피커) */}
      {scenario === 'ocr' && (
        <>
          {/* 카메라: 경첩 LED/파동 */}
          <BlinkingLED position={PARTS.leftHinge as [number, number, number]} color="#6366f1" size={0.012} speed={2.5} />
          <BlinkingLED position={PARTS.rightHinge as [number, number, number]} color="#6366f1" size={0.012} speed={2.5} />
          <AnimatedWave position={PARTS.leftHinge as [number, number, number]} color="#6366f1" scale={1.2} speed={1.2} />
          <AnimatedWave position={PARTS.rightHinge as [number, number, number]} color="#6366f1" scale={1.2} speed={1.2} />
          {/* 터치패드: 다리 중간에 진동/파동 */}
          <VibratingBox position={PARTS.leftPad as [number, number, number]} color="#f472b6" size={[0.020, 0.010, 0.010]} speed={8} />
          <VibratingBox position={PARTS.rightPad as [number, number, number]} color="#f472b6" size={[0.020, 0.010, 0.010]} speed={8} />
          <AnimatedWave position={PARTS.leftPad as [number, number, number]} color="#f472b6" scale={1.1} speed={2} />
          <AnimatedWave position={PARTS.rightPad as [number, number, number]} color="#f472b6" scale={1.1} speed={2} />
          {/* 스피커: 음성 안내 */}
          <AnimatedWave position={PARTS.leftTemple as [number, number, number]} color="#34d399" scale={0.8} speed={1.8} />
          <AnimatedWave position={PARTS.rightTemple as [number, number, number]} color="#34d399" scale={0.8} speed={1.8} />
          {/* 텍스트/음성 안내 */}
          <Text position={[0, 0.09, 0.07] as [number, number, number]} fontSize={0.018} color="#6366f1" anchorX="center" anchorY="middle" outlineColor="#fff" outlineWidth={0.002}>
            OCR: 텍스트 읽기 모드 (터치패드 더블탭)
          </Text>
        </>
      )}
      {/* 환경 설명: 라이다/카메라(경첩) + 햅틱(다리 끝) + 음성 안내(스피커) */}
      {scenario === 'env' && (
        <>
          {/* 라이다/카메라: 경첩 센서 */}
          <BlinkingLED position={PARTS.leftHinge as [number, number, number]} color="#10b981" size={0.012} speed={2.5} />
          <BlinkingLED position={PARTS.rightHinge as [number, number, number]} color="#10b981" size={0.012} speed={2.5} />
          <AnimatedWave position={PARTS.leftHinge as [number, number, number]} color="#10b981" scale={1.2} speed={1.2} />
          <AnimatedWave position={PARTS.rightHinge as [number, number, number]} color="#10b981" scale={1.2} speed={1.2} />
          {/* 햅틱: 다리 끝 방향 알림 */}
          <VibratingBox position={PARTS.leftHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={10} />
          <VibratingBox position={PARTS.rightHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={10} />
          {/* 스피커: 음성 안내 */}
          <AnimatedWave position={PARTS.leftTemple as [number, number, number]} color="#34d399" scale={0.8} speed={1.6} />
          <AnimatedWave position={PARTS.rightTemple as [number, number, number]} color="#34d399" scale={0.8} speed={1.6} />
          <Text position={[0, 0.09, 0.07] as [number, number, number]} fontSize={0.018} color="#10b981" anchorX="center" anchorY="middle" outlineColor="#fff" outlineWidth={0.002}>
            환경 설명: 왼쪽 2m 문, 정면 3m 사람 2명
          </Text>
        </>
      )}
            {/* 문서 선택/모서리 감지: 라이다(경첩) + 햅틱(다리 끝) + 정밀 감지 */}
      {scenario === 'edge' && (
        <>
          {/* 라이다: 경첩 센서 정밀 감지 */}
          <BlinkingLED position={PARTS.leftHinge as [number, number, number]} color="#8b5cf6" size={0.012} speed={3} />
          <BlinkingLED position={PARTS.rightHinge as [number, number, number]} color="#8b5cf6" size={0.012} speed={3} />
          <AnimatedWave position={PARTS.leftHinge as [number, number, number]} color="#8b5cf6" scale={1.2} speed={1.5} />
          <AnimatedWave position={PARTS.rightHinge as [number, number, number]} color="#8b5cf6" scale={1.2} speed={1.5} />
          {/* 햅틱: 다리 끝 선택 피드백 */}
          <VibratingBox position={PARTS.leftHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={8} />
          <VibratingBox position={PARTS.rightHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={8} />
          {/* 스피커: 선택 확인 안내 */}
          <AnimatedWave position={PARTS.leftTemple as [number, number, number]} color="#34d399" scale={0.6} speed={2} />
          <AnimatedWave position={PARTS.rightTemple as [number, number, number]} color="#34d399" scale={0.6} speed={2} />
          <Text position={[0, 0.09, 0.07] as [number, number, number]} fontSize={0.018} color="#8b5cf6" anchorX="center" anchorY="middle" outlineColor="#fff" outlineWidth={0.002}>
            문서 선택: 여러 문서 중 목표 문서 감지
          </Text>
        </>
      )}
      {/* 시스템 제어: 마이크/스피커(다리) + 음성 명령 */}
      {scenario === 'system' && (
        <>
          {/* 마이크/스피커: 다리 부분 */}
          <BlinkingLED position={PARTS.leftTemple as [number, number, number]} color="#2563eb" size={0.012} speed={2.5} />
          <BlinkingLED position={PARTS.rightTemple as [number, number, number]} color="#2563eb" size={0.012} speed={2.5} />
          <AnimatedWave position={PARTS.leftTemple as [number, number, number]} color="#2563eb" scale={1.1} speed={1.5} />
          <AnimatedWave position={PARTS.rightTemple as [number, number, number]} color="#2563eb" scale={1.1} speed={1.5} />
          {/* 음성 명령 대기 상태 표시 */}
          <AnimatedWave position={PARTS.leftTemple as [number, number, number]} color="#34d399" scale={0.7} speed={1.2} />
          <AnimatedWave position={PARTS.rightTemple as [number, number, number]} color="#34d399" scale={0.7} speed={1.2} />
          {/* 햅틱: 명령 확인 피드백 */}
          <VibratingBox position={PARTS.leftHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={6} />
          <VibratingBox position={PARTS.rightHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={6} />
          <Text position={[0, 0.09, 0.04] as [number, number, number]} fontSize={0.018} color="#2563eb" anchorX="center" anchorY="middle" outlineColor="#fff" outlineWidth={0.002}>
            시스템 제어: "루미, 전원 꺼줘" 등 음성 명령
          </Text>
        </>
      )}
      {/* 온보딩/튜토리얼: 모든 센서 순차 안내 */}
      {scenario === 'onboarding' && (
        <>
          {/* 경첩 센서들: 라이다/카메라 */}
          <BlinkingLED position={PARTS.leftHinge as [number, number, number]} color="#38bdf8" size={0.012} speed={2.5} />
          <BlinkingLED position={PARTS.rightHinge as [number, number, number]} color="#38bdf8" size={0.012} speed={2.5} />
          <AnimatedWave position={PARTS.leftHinge as [number, number, number]} color="#38bdf8" scale={1.2} speed={1.2} />
          <AnimatedWave position={PARTS.rightHinge as [number, number, number]} color="#38bdf8" scale={1.2} speed={1.2} />
          {/* 다리 부분: 마이크/스피커 */}
          <BlinkingLED position={PARTS.leftTemple as [number, number, number]} color="#2563eb" size={0.012} speed={2.5} />
          <BlinkingLED position={PARTS.rightTemple as [number, number, number]} color="#2563eb" size={0.012} speed={2.5} />
          <AnimatedWave position={PARTS.leftTemple as [number, number, number]} color="#2563eb" scale={1.1} speed={1.5} />
          <AnimatedWave position={PARTS.rightTemple as [number, number, number]} color="#2563eb" scale={1.1} speed={1.5} />
          {/* 터치패드: 다리 중간 */}
          <BlinkingLED position={PARTS.leftPad as [number, number, number]} color="#f472b6" size={0.010} speed={2} />
          <BlinkingLED position={PARTS.rightPad as [number, number, number]} color="#f472b6" size={0.010} speed={2} />
          <AnimatedWave position={PARTS.leftPad as [number, number, number]} color="#f472b6" scale={0.9} speed={1.8} />
          <AnimatedWave position={PARTS.rightPad as [number, number, number]} color="#f472b6" scale={0.9} speed={1.8} />
          {/* 햅틱 센서: 다리 끝 */}
          <VibratingBox position={PARTS.leftHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={8} />
          <VibratingBox position={PARTS.rightHaptic as [number, number, number]} color="#facc15" size={[0.008, 0.008, 0.008]} speed={8} />
          <Text position={[0, 0.13, 0.04] as [number, number, number]} fontSize={0.018} color="#38bdf8" anchorX="center" anchorY="middle" outlineColor="#fff" outlineWidth={0.002}>
            온보딩: 각 센서별 위치/기능 안내
          </Text>
        </>
      )}
    </group>
  )
}

function App() {
  const [scenario, setScenario] = useState<string>('obstacle')

  return (
    <div className="app-container">
      <h1>루미(LUMI) 스마트글래스 3D UI/UX 데모</h1>
      <div className="scenario-buttons">
        {SCENARIOS.map(s => (
          <button key={s.key} onClick={() => setScenario(s.key)}>{s.label}</button>
        ))}
      </div>
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 0.05, 0.30], fov: 34 }} shadows>
          <ambientLight intensity={1.1} />
          <directionalLight position={[0.5, 1, 1]} intensity={0.7} />
          <LumiGlasses scenario={scenario} />
          <OrbitControls enablePan={false} enableRotate={true} enableZoom={true} minDistance={0.18} maxDistance={0.5} target={[0,0.03,0.01]} />
        </Canvas>
      </div>
      <div className="desc">
        <p>상단 버튼을 눌러 각 시나리오별로 루미의 반응을 확인하세요.</p>
        <ul>
          <li>장애물/거리 인식: 라이다(경첩) + 햅틱(다리 끝) + 음성 안내(스피커)</li>
          <li>OCR: 카메라(경첩) + 터치패드(다리 중간) + 음성 안내(스피커)</li>
          <li>환경 설명: 라이다/카메라(경첩) + 햅틱(다리 끝) + 음성 안내(스피커)</li>
          <li>문서 선택: 라이다(경첩) + 햅틱(다리 끝) + 정밀 감지</li>
          <li>시스템 제어: 마이크/스피커(다리) + 햅틱(다리 끝) + 음성 명령</li>
          <li>온보딩: 모든 센서 순차 안내 (경첩→다리→터치패드→햅틱)</li>
        </ul>
      </div>
    </div>
  )
}

export default App
