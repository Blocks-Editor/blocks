import {Button, ButtonGroup, Card} from 'react-bootstrap';
import React from 'react';
import useTutorialProgressState from '../../hooks/persistent/useTutorialProgressState';
import useFamiliarityState, {FAMILIAR, LEARNING} from '../../hooks/persistent/useFamiliarityState';
import styled from 'styled-components';
import {FaRegQuestionCircle} from 'react-icons/fa';
import {helloWorldTutorial} from '../../tutorials/definitions/helloWorldTutorial';
import getTutorialStep from '../../tutorials/utils/getTutorialStep';
import useTutorialVariables from '../../hooks/useTutorialVariables';
import useReactTooltip from '../../hooks/useReactTooltip';
import useListener from '../../hooks/utils/useListener';

const StyledCard = styled(Card)`
    opacity: .9;
    box-shadow: 0 2px 12px #0005;
`;

function HelperCard({icon, title, tooltip, children, ...others}) {
    useReactTooltip();

    return (
        <StyledCard {...others}>
            {(icon || title) && (
                <Card.Header>
                    <h5
                        className="mb-0 d-flex align-items-center text-muted">
                        {title && <span className="me-3 text-primary flex-grow-1">{title}</span>}
                        <span data-tip={tooltip} data-place="top" data-delay-show={0}>{icon ||
                        <FaRegQuestionCircle/>}</span>
                    </h5>
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

    const {tutorial} = progress;

    // const onNodeCreated = useMemo(() => {
    //     const listener = (node) => {
    //         if(!progress.editor.silent) {
    //             progress.step?.setupNode?.(node, progress, variables);
    //         }
    //     };
    //     progress.editor.on('nodecreated', listener);
    //     return listener;
    // }, [progress, variables]);
    //
    // useEffect(() => {
    //     return () => {
    //         // removeListener() polyfill
    //         progress.editor.off('nodecreated', onNodeCreated)
    //     };
    // }, [onNodeCreated, progress.editor]);

    // const onNodeCreated = useCallback((node) => {
    //     if(!progress.editor.silent) {
    //         progress.step?.setupNode?.(node, progress, variables);
    //     }
    // }, [progress, variables]);
    // useListener(progress.editor, 'nodecreated', onNodeCreated);

    useListener(progress.editor, 'nodecreated', (node) => {
        console.log(12345);////
        if(!progress.editor.silent) {
            progress.step?.setupNode?.(node, progress, variables);
        }
    });

    // console.log(variables, step);////

    const step = getTutorialStep(progress, variables);

    if(!step) {
        onComplete();

        return null; // Completion message?
    }

    const rendered = step.render?.(progress, variables);

    return (
        <HelperCard
            tooltip={`${tutorial.title} (${tutorial.info})`}
            title={step.title || tutorial.title}>
            {step.info}
            {rendered}
            {!step.info && !rendered && tutorial.info}
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
