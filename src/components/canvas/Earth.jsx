import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import FrameLimiter from "./FrameLimiter";

const Earth = ({ onLoaded }) => {
  const earth = useLoader(GLTFLoader, "/planet/scene.gltf");

  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  return (
    <primitive
      object={earth.scene}
      scale={2.55}
      position-y={0}
      rotation-y={0}
    />
  );
};

const OrbitControls = () => {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useMemo(
    () => new OrbitControlsImpl(camera, gl.domElement),
    [camera, gl]
  );

  useEffect(() => {
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.65;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

    return () => controls.dispose();
  }, [controls]);

  useFrame((_, delta) => controls.update(delta));

  return null;
};

const EarthCanvas = ({ active = true, onLoaded }) => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isMobile = window.innerWidth < 768;

  return (
    <Canvas
      frameloop="demand"
      dpr={isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25)}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        stencil: false,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4.8, 3.5, 7.5],
      }}
    >
      <FrameLimiter
        active={active && !prefersReducedMotion}
        fps={isMobile ? 20 : 30}
      />
      <Suspense fallback={null}>
        <OrbitControls />
        <Earth onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
