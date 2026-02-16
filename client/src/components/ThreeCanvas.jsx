import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Points, PointMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

function InkParticles({ count = 1000 }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 15;
            p[i * 3 + 1] = (Math.random() - 0.5) * 15;
            p[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return p;
    }, [count]);

    const pointsRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const { mouse } = state;
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.05 + mouse.x * 0.1;
            pointsRef.current.rotation.x = time * 0.02 + mouse.y * 0.1;
        }
    });

    return (
        <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#f4d06f"
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.3}
            />
        </Points>
    );
}

function FloatingQuill() {
    const quillRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (quillRef.current) {
            quillRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
            quillRef.current.rotation.y += 0.005;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <group ref={quillRef} position={[2, 1, -2]}>
                <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0.2]}>
                    <cylinderGeometry args={[0.01, 0.03, 1, 8]} />
                    <meshStandardMaterial color="#7a5c37" roughness={0.3} metalness={0.8} />
                </mesh>
                <mesh position={[0.05, 0.1, 0]} rotation={[0, 0, -0.1]}>
                    <boxGeometry args={[0.1, 0.8, 0.01]} />
                    <meshStandardMaterial color="#f4d06f" transparent opacity={0.6} emissive="#f4d06f" emissiveIntensity={0.2} />
                </mesh>
            </group>
        </Float>
    );
}

function FloatingVerse({ text, position, delay = 0 }) {
    const textRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime() + delay;
        if (textRef.current) {
            textRef.current.position.y = position[1] + Math.sin(t * 0.3) * 0.2;
            // Safer way to handle opacity
            if (textRef.current.material) {
                textRef.current.material.opacity = (Math.sin(t * 0.5) + 1) / 2 * 0.3;
            }
        }
    });

    return (
        <Text
            ref={textRef}
            position={position}
            fontSize={0.4}
            color="#f4d06f"
            maxWidth={2}
            textAlign="center"
            transparent
            opacity={0}
        >
            {text}
        </Text>
    );
}

function Fireflies({ count = 100 }) {
    const mesh = useRef();
    const { mouse } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 10;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -8 + Math.random() * 16;
            const yFactor = -8 + Math.random() * 16;
            const zFactor = -8 + Math.random() * 16;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const s = Math.cos(t);
            // Particles attract slightly to mouse
            const x = xFactor + Math.cos((t / 10) * factor) + (mouse.x * 2);
            const y = yFactor + Math.sin((t / 10) * factor) + (mouse.y * 2);
            const z = zFactor + Math.cos((t / 10) * factor);

            dummy.position.set(x, y, z);
            dummy.scale.set(s, s, s);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#f4d06f" emissive="#f4d06f" emissiveIntensity={3} transparent opacity={0.8} />
        </instancedMesh>
    );
}

function GlowingInkPot() {
    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={[-3, -2, -3]} rotation={[0, 0.5, 0]}>
                {/* Pot Base */}
                <mesh position={[0, -0.4, 0]}>
                    <cylinderGeometry args={[0.3, 0.4, 0.5, 12]} />
                    <meshStandardMaterial color="#0c0805" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Ink Glow */}
                <mesh position={[0, -0.1, 0]}>
                    <cylinderGeometry args={[0.25, 0.25, 0.1, 12]} />
                    <meshStandardMaterial color="#5e0b0b" emissive="#5e0b0b" emissiveIntensity={2} transparent opacity={0.6} />
                </mesh>
            </group>
        </Float>
    );
}

function Scene() {
    const { mouse, camera } = useThree();
    const lightRef = useRef();
    const scrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            scrollY.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        if (lightRef.current) {
            lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, mouse.x * 8, 0.05);
            lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, mouse.y * 8, 0.05);
        }

        // Parallax scroll effect
        camera.position.y = -scrollY.current * 0.005;
        camera.lookAt(0, -scrollY.current * 0.005, 0);

        // Subtle breathing camera
        const t = state.clock.getElapsedTime();
        camera.position.x += Math.sin(t * 0.5) * 0.001;
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <ambientLight intensity={1} />
            <pointLight ref={lightRef} position={[2, 2, 2]} intensity={10} color="#f4d06f" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />


            <InkParticles count={2000} />
            <Fireflies count={100} />
            <FloatingQuill />
            <GlowingInkPot />


            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <group position={[-5, -2, -8]} rotation={[0.2, 0.8, 0]}>
                    <mesh>
                        <planeGeometry args={[15, 20]} />
                        <meshStandardMaterial color="#1a120b" transparent opacity={0.2} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </Float>
        </>
    );
}

export default function ThreeCanvas() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none',
            background: 'transparent',
            touchAction: 'none'
        }}>
            <Canvas dpr={[1, 2]}>
                <Scene />
            </Canvas>
        </div>
    );
}
