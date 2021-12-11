import {Card} from 'react-bootstrap';
import React from 'react';

export default function TutorialCard({editor}) {
    // const [progress, setProgress] = useTutorialProgressState();

    const progress = null;

    if(!progress) {
        return null;
    }
    return (
        <Card>
            <Card.Header>
                {progress.tutorial?.title}
            </Card.Header>
            <Card.Body>

            </Card.Body>
        </Card>
    );
}