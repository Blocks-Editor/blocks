import {Button, ButtonGroup, Card} from 'react-bootstrap';
import React, {useCallback} from 'react';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useFamiliarityState, {FAMILIAR, LEARNING} from '../../hooks/persistent/useFamiliarityState';
import styled, {createGlobalStyle} from 'styled-components';
import {FaRegQuestionCircle} from 'react-icons/fa';
import {helloWorldTutorial} from '../../tutorials/definitions/helloWorldTutorial';
import getTutorialStep from '../../tutorials/utils/getTutorialStep';
import useTutorialVariables from '../../hooks/useTutorialVariables';
import useReactTooltip from '../../hooks/useReactTooltip';
import useListener from '../../hooks/utils/useListener';
import {FiSmile} from 'react-icons/fi';

const StyledCard = styled(Card)`
    opacity: .9;
    box-shadow: 0 2px 12px #0005;
    border: none;
    max-width: 30rem;
    font-size: 18px;
    font-weight: 500;
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
                        <span data-tip={iconTooltip} data-place="top" data-delay-show={0}>
                            {icon || <FaRegQuestionCircle/>}
                        </span>
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

    const step = getTutorialStep(progress, variables);

    // Allow tutorials to intercept node creation
    useListener(editor, 'prenodecreate', (node) => {
        if(!editor.silent && step) {
            if(step.setupNode) {
                step.setupNode(node, progress, variables);
            }
        }
    });

    if(!step) {
        // Tutorial completed
        return (
            <HelperCard
                title="Congratulations!"
                icon={<FiSmile/>}>
                You completed our "{tutorial.name}" tutorial.
                <hr/>
                <ButtonGroup className="d-flex">
                    <Button variant="success" onMouseDown={() => onComplete()}>Close</Button>
                </ButtonGroup>
            </HelperCard>
        );
    }

    // Custom JSX from tutorial step
    const rendered = step.render?.(progress, variables);

    // Tutorial in progress
    return (
        <HelperCard
            title={step.title || tutorial.name}
            iconTooltip={`${tutorial.name} (${tutorial.description})`}>
            {step.info}
            {rendered && step.info && <hr/>}
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

    const onAccept = useCallback(() => {
        setProgress({
            tutorial: helloWorldTutorial,
        });
        setFamiliarity(LEARNING);
    }, [setFamiliarity, setProgress]);

    const onDecline = useCallback(() => {
        setFamiliarity(FAMILIAR);
    }, [setFamiliarity]);

    const onComplete = useCallback(() => {
        setProgress(null);
    }, [setProgress]);

    if(progress) {
        return (
            <TutorialProgressCard progress={progress} onComplete={onComplete}/>
        );
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
