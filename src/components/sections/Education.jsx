import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import styled from "styled-components";
import { education } from "../../data/constants";
import EducationCard from "../cards/EducationCard";

const EarthCanvas = lazy(() => import("../canvas/Earth"));

const Container = styled.div`
  display: flex;
  padding-top:3.5vw;
  flex-direction: column;
  justify-contnet: center;
  position: rlative;
  z-index: 1;
  margin-top:10vh;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;
const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const EarthStage = styled.div`
  position: relative;
  width: min(100%, 680px);
  height: 280px;
  margin: 18px auto 0;
  contain: layout paint size;

  @media (max-width: 768px) {
    width: min(100%, 380px);
    height: 220px;
  }
`;

const EarthFallback = styled.div`
  position: absolute;
  width: 170px;
  height: 170px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #536dfe55, transparent 28%),
    radial-gradient(circle at 60% 65%, #854ce655, transparent 35%),
    radial-gradient(circle, #111a3a 0%, #090917 68%);
  box-shadow: 0 0 40px ${({ theme }) => theme.primary + "28"};

  @media (max-width: 768px) {
    width: 135px;
    height: 135px;
  }
`;

const Education = () => {
  const earthStageRef = useRef(null);
  const [shouldLoadEarth, setShouldLoadEarth] = useState(false);
  const [isEarthNearViewport, setIsEarthNearViewport] = useState(false);
  const [isEarthLoaded, setIsEarthLoaded] = useState(false);
  const handleEarthLoaded = useCallback(() => setIsEarthLoaded(true), []);

  useEffect(() => {
    const element = earthStageRef.current;
    if (!element) return undefined;

    const saveData = navigator.connection?.saveData === true;
    if (saveData) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsEarthNearViewport(entry.isIntersecting);

        if (entry.isIntersecting) {
          setShouldLoadEarth(true);
        }
      },
      { rootMargin: "250px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Container id="Education">
      <Wrapper>
        <Title>Education</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          My academic journey has strengthened my software engineering,
          problem-solving, and full-stack development foundation.
        </Desc>

        <VerticalTimeline>
          {education.map((education, index) => (
            <EducationCard key={`education-${index}`} education={education} />
          ))}
        </VerticalTimeline>
        <EarthStage ref={earthStageRef}>
          {!isEarthLoaded && <EarthFallback aria-hidden="true" />}
          {shouldLoadEarth && (
            <Suspense fallback={null}>
              <EarthCanvas
                active={isEarthNearViewport}
                onLoaded={handleEarthLoaded}
              />
            </Suspense>
          )}
        </EarthStage>
      </Wrapper>
    </Container>
  );
};

export default Education;
