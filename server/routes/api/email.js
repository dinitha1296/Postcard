const router = require("express").Router();

const Email = require("../../models/email");
const Attc = require("../../models/attachment");
const User = require("../../models/user");

router.post('/email', (req, res) => {
    
    const email = new Email(
        ...{
            to: "someone@example.com",
            by: "me@example.com",
            cc: ["another@example.com", "another1@example.com"],
            body: "This is a sample email",
            attc: [],
            datatime: new Date()
        }
    );
        
    email.save((err, doc) => {
        if (err) {
            res.status(400).json({
                error: "Unable to save email"
            });
        } else {
            updateInbox(doc.insertedId, res);
        }
    });
});

module.exports = router;

function updateInbox(insertedEmailId, res) {
    User.updateOne({username: "me"}, {
        $push: {
            inbox: {
                $each: insertedEmailId,
                $position: 0
            }
        }
    }, (err, doc) => {
        if (err) {
            res.send(500).json({
                error: "Failed to update inbox"
            });
            res.send(200).json({
                message: "Email saved and updated to the inbox successfully"
            });
        }
    });
}