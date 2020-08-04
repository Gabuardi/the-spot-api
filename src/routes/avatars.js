import express from 'express';
import path from 'path';

const ROUTER = express.Router();

ROUTER.get('/:avatarName', (request, response) => {
    let avatar = request.params.avatarName;

    const file = path.resolve(`resources/avatars/${avatar}`);
    response.sendFile(file);
});

export default ROUTER;