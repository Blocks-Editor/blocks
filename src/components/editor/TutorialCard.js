import {Button, ButtonGroup, Card} from 'react-bootstrap';
import React, {useCallback} from 'react';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useFamiliarityState, {FAMILIAR, LEARNING} from '../../hooks/persistent/useFamiliarityState';
import styled, {createGlobalStyle, css} from 'styled-components';
import {helloWorldTutorial} from '../../tutorials/definitions/helloWorldTutorial';
import getTutorialStep from '../../tutorials/utils/getTutorialStep';
import useTutorialVariables from '../../hooks/useTutorialVariables';
import useReactTooltip from '../../hooks/useReactTooltip';
import useListener from '../../hooks/utils/useListener';
import {FiSmile, FiX} from 'react-icons/fi';
import {LearningIcon} from '../common/Icon';
import {TUTORIAL_STEP_STORE} from '../../observables/tutorialStepStore';
import {onLeftClick} from '../../utils/eventHelpers';
import {isMobile} from 'react-device-detect';

const StyledLearningIcon = styled(LearningIcon)`
    width: 24px;
    fill: #FFF;
`;

const StyledCard = styled(Card)`
    opacity: .9;
    box-shadow: 0 2px 12px #0005;
    border: none;
    max-width: 30rem;
    font-size: ${isMobile ? 16 : 18}px;
    font-weight: 500;

    h4 {
        ${isMobile && css`font-size: 20px`};
    }
`;

const StyledCardHeader = styled(Card.Header)`
    //background: #8649E1
`;

const GlobalStyle = createGlobalStyle`
    ${props => props.tutorialCss}
    ${props => props.stepCss}
`;

function HelperCard({title, icon, iconTooltip, hideCloseButton, children, ...others}) {
    const [, setProgress] = useTutorialProgressState();

    useReactTooltip();

    return (
        <StyledCard {...others}>
            {(icon || title) && (
                <StyledCardHeader className="helper-card-header bg-info py-3">
                    <h4 className="mb-0 d-flex align-items-center justify-content-start text-white">
                        <span className="me-3 mb-1" data-tip={iconTooltip} data-place="top" data-delay-show={0}>
                            {icon || <StyledLearningIcon/>}
                        </span>
                        {title && <span className="me-3 flex-grow-1">{title}</span>}
                        {!hideCloseButton && (
                            <span className="float-end">
                            <FiX className="clickable text-white" {...onLeftClick(() => setProgress(null))}/>
                        </span>
                        )}
                    </h4>
                </StyledCardHeader>
            )}
            <Card.Body className="helper-card-body">
                {children}
            </Card.Body>
        </StyledCard>
    );
}

function TutorialProgressCard({progress, onComplete}) {
    const variables = useTutorialVariables(progress);

    const {tutorial, editor} = progress;

    const step = getTutorialStep(progress, variables);

    TUTORIAL_STEP_STORE.set(step);

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
                    <Button variant="success" {...onLeftClick(() => onComplete())}>Close</Button>
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
            <HelperCard title="New to Blocks?" hideCloseButton={true}>
                <ButtonGroup className="d-flex">
                    <Button variant="success" {...onLeftClick(onAccept)}>Start Tutorial</Button>
                    <Button variant="" className="text-muted" {...onLeftClick(onDecline)}>Skip</Button>
                </ButtonGroup>
            </HelperCard>
        );
    }
    return null;
}
