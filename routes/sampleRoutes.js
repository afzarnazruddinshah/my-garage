const express = require("express");
const router = express.Router();

router.get('/getGenericGreeting', (req, res) => {
  res.send('Hello World!')
});

router.post('/getCustomGreeting/:username', (req, res)=> {
    const username = req.params.username;
    res.json({
        data: {
            greeting: `Hello ${username}! Hope you are doing great!`
        },
        status: {
            statusCode: 200,
            statusMsg: `Data is available`,
            statusFlag: 'SUCCESS'
        }
    })
});

module.exports = router;