import {Button, ButtonGroup, Card} from 'react-bootstrap';
import React from 'react';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useFamiliarityState, {FAMILIAR, LEARNING} from '../../hooks/persistent/useFamiliarityState';
import styled from 'styled-components';
import {FaRegQuestionCircle} from 'react-icons/fa';
import {helloWorldTutorial} from '../../tutorials/definitions/helloWorldTutorial';

const StyledCard = styled(Card)`
    opacity: .9;
`;

function HelperCard({icon, title, children, ...others}) {
    return (
        <StyledCard {...others}>
            {(icon || title) && (
                <Card.Header>
                    <h4 className="mb-0 d-flex align-items-center text-primary">
                        <FaRegQuestionCircle/>
                        {title && <span className="ms-3">{title}</span>}
                    </h4>
                </Card.Header>
            )}
            <Card.Body>
                {children}
            </Card.Body>
        </StyledCard>
    );
}

function TutorialProgressCard({progress}) {
    const {tutorial} = progress;

    return (
        <HelperCard
            title={tutorial.title}>

        </HelperCard>
    );
}

export default function TutorialCard() {
    const [progress, setProgress] = useTutorialProgressState();
    const [familiarity, setFamiliarity] = useFamiliarityState();

    const onAccept = () => {
        setProgress({
            tutorial: helloWorldTutorial,
        });
        setFamiliarity(LEARNING);
    };
    const onDecline = () => {
        setFamiliarity(FAMILIAR);
    };

    if(progress) {
        return <TutorialProgressCard progress={progress}/>;
    }
    if(!familiarity) {
        return (
            <HelperCard
                title="New to Blocks?">
                <ButtonGroup className="d-flex">
                    <Button variant="success" onMouseDown={onAccept}>Start Tutorial</Button>
                    <Button variant="" className="text-muted" onMouseDown={onDecline}>Skip</Button>
                </ButtonGroup>
            </HelperCard>
        );
    }
    return null;
}
