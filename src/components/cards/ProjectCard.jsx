import React from "react";
import styled from "styled-components";

const Card = styled.div`
  width: 400px;
  height: auto;
  background-color: ${({ theme }) => theme.card};
  border-radius: 14px;
  box-shadow: 0 0 18px 6px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: 0.4s ease-in-out;
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 0 35px rgba(0, 0, 0, 0.55);
  }
`;

const ImageFrame = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $multiple }) => ($multiple ? "10px" : "0")};
  padding: ${({ $multiple }) => ($multiple ? "10px" : "0")};
  background-color: ${({ theme }) => theme.primary + "10"};
  border-bottom: 2px solid ${({ theme }) => theme.primary + "40"};
  box-sizing: border-box;
  overflow: hidden;
`;

const Image = styled.img`
  width: ${({ $multiple }) => ($multiple ? "calc(50% - 5px)" : "100%")};
  height: 100%;
  object-fit: ${({ $multiple }) => ($multiple ? "contain" : "cover")};
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Title = styled.h3`
  font-size: 22px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
`;

const Date = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary + "AA"};
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.4;
  -webkit-line-clamp: 4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  font-size: 12px;
  background-color: ${({ theme }) => theme.primary + "22"};
  color: ${({ theme }) => theme.primary};
  padding: 4px 8px;
  border-radius: 10px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: right;
  margin-top: 10px;
`;

const Button = styled.a`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme.primary + "22"};
  }
`;

const Members = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.card};
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
`;

const ProjectCard = ({ project }) => {
  const projectImages = project.images?.length
    ? project.images
    : [project.image];
  const hasMultipleImages = projectImages.length > 1;

  return (
    <Card>
      <ImageFrame $multiple={hasMultipleImages}>
        {projectImages.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={
              hasMultipleImages
                ? `${project.title} screenshot ${index + 1}`
                : project.title
            }
            $multiple={hasMultipleImages}
            loading="lazy"
          />
        ))}
      </ImageFrame>
      <Content>
        <Title>{project.title}</Title>
        <Date>{project.date}</Date>
        <Description>{project.description}</Description>
        <Tags>
          {project.tags?.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Tags>
        {project.member?.length > 0 && (
          <Members>
            {project.member.map((member, index) => (
              <Avatar key={index} src={member.img} alt="Team member" />
            ))}
          </Members>
        )}
        <Buttons>
          <Button href={project.github} target="_blank">
            GitHub
          </Button>
          {/* {project.webapp && (
            <Button href={project.webapp} target="_blank">
              Live Demo
            </Button>
          )} */}
        </Buttons>
      </Content>
    </Card>
  );
};

export default ProjectCard;
