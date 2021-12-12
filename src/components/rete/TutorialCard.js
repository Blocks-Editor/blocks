import {Button, ButtonGroup, Card} from 'react-bootstrap';
import React from 'react';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useFamiliarityState, {FAMILIAR, LEARNING} from '../../hooks/persistent/useFamiliarityState';
import styled from 'styled-components';
import {FaRegQuestionCircle} from 'react-icons/fa';
import {helloWorldTutorial} from '../../tutorials/definitions/helloWorldTutorial';
import getTutorialStep from '../../tutorials/utils/getTutorialStep';
import useTutorialVariables from '../../hooks/useTutorialVariables';

const StyledCard = styled(Card)`
    opacity: .9;
`;

function HelperCard({icon, title, tooltip, children, ...others}) {
    // useReactTooltip();

    return (
        <StyledCard {...others}>
            {(icon || title) && (
                <Card.Header>
                    <h5
                        className="mb-0 d-flex align-items-center text-muted">{/*data-tip={tooltip} data-place="right"*/}
                        {icon || <FaRegQuestionCircle/>}
                        {title && <span className="ms-3 text-primary">{title}</span>}
                    </h5>
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

    const variables = useTutorialVariables(progress);

    console.log(1);//////

    const step = getTutorialStep(progress, variables);

    // console.log(variables, step);////

    return (
        <HelperCard
            tooltip={`${tutorial.title} (${tutorial.info})`}
            title={step.title || tutorial.title}>
            {step.info}
            {step.render?.(progress, variables)}
            {!step.render && !step.info && tutorial.info}
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
