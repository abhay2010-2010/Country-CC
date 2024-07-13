const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        if (!header) {
            return res.status(401).send("Token is not provided");
        }

        const token = header.split(" ")[1];
        if (!token) {
            return res.status(401).send("Token is not provided");
        }

        // Verify the token asynchronously
        jwt.verify(token, "abhay", (err, data) => {
            if (err) {
                return res.status(401).send({ error: err.message });
            }
            if (data) {
                req.user = data; // Store user data in req for later use
                console.log(data);
                next();
            }
        });
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
};

module.exports = { auth };
