import {Card} from 'react-bootstrap';
import React from 'react';

export default function TutorialCard({progress}) {

    const {tutorial} = progress;

    return (
        <Card>
            <Card.Header>
                {tutorial.title}
            </Card.Header>
            <Card.Body>

            </Card.Body>
        </Card>
    );
}