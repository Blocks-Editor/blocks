import {Button, ButtonGroup, Card} from 'react-bootstrap';
import React from 'react';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useFamiliarityState, {FAMILIAR, LEARNING} from '../../hooks/persistent/useFamiliarityState';
import styled, {createGlobalStyle} from 'styled-components';
import {FaRegQuestionCircle} from 'react-icons/fa';
import {helloWorldTutorial} from '../../tutorials/definitions/helloWorldTutorial';
import getTutorialStep from '../../tutorials/utils/getTutorialStep';
import useTutorialVariables from '../../hooks/useTutorialVariables';
import useReactTooltip from '../../hooks/useReactTooltip';
import useListener from '../../hooks/utils/useListener';

const StyledCard = styled(Card)`
    opacity: .9;
    box-shadow: 0 2px 12px #0005;
    border: none;
`;

const GlobalStyle = createGlobalStyle`
    ${props => props.tutorialCss}
    ${props => props.stepCss}
`;

function HelperCard({title, icon, iconTooltip, children, ...others}) {
    useReactTooltip();

    return (
        <StyledCard {...others}>
            {(icon || title) && (
                <Card.Header className="bg-primary py-3">
                    <h4 className="mb-0 d-flex align-items-center text-white">
                        {title && <span className="me-3 flex-grow-1">{title}</span>}
                        <span data-tip={iconTooltip} data-place="top" data-delay-show={0}>{icon ||
                        <FaRegQuestionCircle/>}</span>
                    </h4>
                </Card.Header>
            )}
            <Card.Body>
                {children}
            </Card.Body>
        </StyledCard>
    );
}

function TutorialProgressCard({progress, onComplete}) {
    const variables = useTutorialVariables(progress);

    const {tutorial, editor} = progress;

    // Allow tutorials to intercept node creation
    useListener(editor, 'prenodecreate', (node) => {
        if(!editor.silent) {
            if(progress.step?.setupNode) {
                progress.step?.setupNode(node, progress, variables);
            }
        }
    });

    // console.log(variables, step);////

    const step = getTutorialStep(progress, variables);

    if(!step) {
        setTimeout(onComplete);

        return null; // Completion message?
    }

    const rendered = step.render?.(progress, variables);

    return (
        <HelperCard
            title={step.title || tutorial.title}
            iconTooltip={`${tutorial.title} (${tutorial.info})`}>
            {step.info}
            {rendered}
            {(tutorial.style || step.style) && (
                <GlobalStyle tutorialCss={tutorial.style} stepCss={step.style}/>
            )}
        </HelperCard>
    );
}

export default function TutorialCard() {
    const [progress, setProgress] = useTutorialProgressState();
    const [familiarity, setFamiliarity] = useFamiliarityState();

    // Temp: browser debug
    window.resetTutorial = () => {
        setProgress(null);
        setFamiliarity(null);
    };

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
        return <TutorialProgressCard progress={progress} onComplete={() => setProgress(null)}/>;
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
