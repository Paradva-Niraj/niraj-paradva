import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const FrameLimiter = ({ active = true, fps = 30 }) => {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();

    if (!active || fps <= 0) {
      return undefined;
    }

    const frameDuration = 1000 / fps;
    let animationFrameId;
    let previousTime = performance.now();

    const renderFrame = (currentTime) => {
      const elapsed = currentTime - previousTime;

      if (elapsed >= frameDuration) {
        previousTime = currentTime - (elapsed % frameDuration);
        invalidate();
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => cancelAnimationFrame(animationFrameId);
  }, [active, fps, invalidate]);

  return null;
};

export default FrameLimiter;
