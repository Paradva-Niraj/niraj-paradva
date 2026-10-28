import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import styled from "styled-components";
import FrameLimiter from "./FrameLimiter";

const StyledCanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  pointer-events: none;
  contain: strict;
  background: radial-gradient(
    circle at 55% 45%,
    ${({ theme }) => theme.primary + "12"} 0%,
    transparent 55%
  );

  canvas {
    display: block;
  }
`;

const createStarField = (count, radius) => {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const distance = radius * Math.cbrt(Math.random());
    const offset = index * 3;

    positions[offset] = distance * Math.sin(phi) * Math.cos(theta);
    positions[offset + 1] = distance * Math.sin(phi) * Math.sin(theta);
    positions[offset + 2] = distance * Math.cos(phi);
  }

  return positions;
};

const Stars = ({ count }) => {
  const pointsRef = useRef();
  const positions = useMemo(() => createStarField(count, 1.4), [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.x -= delta / 14;
    pointsRef.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={pointsRef} frustumCulled>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.0045}
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

const StarsCanvas = () => {
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(
    () => document.visibilityState !== "hidden"
  );
  const [settings] = useState(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const saveData = navigator.connection?.saveData === true;
    const lowPowerDevice = navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency <= 4
      : false;

    return {
      count: isMobile || lowPowerDevice ? 300 : 600,
      dpr: isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25),
      fps: isMobile || lowPowerDevice ? 20 : 30,
      animate: !prefersReducedMotion && !saveData,
    };
  });

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState !== "hidden");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <StyledCanvasWrapper ref={wrapperRef} aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={settings.dpr}
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
      >
        <FrameLimiter
          active={settings.animate && isVisible && isPageVisible}
          fps={settings.fps}
        />
        <Stars count={settings.count} />
      </Canvas>
    </StyledCanvasWrapper>
  );
};

export default StarsCanvas;
