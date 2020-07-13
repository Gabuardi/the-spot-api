import express from 'express';

const APP = express();
const PORT = 3000;

APP.listen(PORT, () => console.log(`- || APP RUNNING ||--> http://localhost:${PORT}`));


APP.get('/', (req, res) => res.send('GET request'));
