import React from 'react';
import {Container} from 'react-bootstrap';

export default function TopMenu({children}) {
    return (
        <Container>
            {children}
        </Container>
    );
}