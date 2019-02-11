/**
 * Module for subscribing members to Mailchimp list
 */
const Mailchimp = require("mailchimp-api-v3");
const router = require("express").Router();

// get all mailchimp-related variables
const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } = require("../config/keys");

// initialize mailchimp
const mailchimp = new Mailchimp(MAILCHIMP_API_KEY);

/**
 *  POST: Put 1 new member into the Mailchimp mailing list
 */
router.post("/api/subscribe/:email_address", (req, res) => {
  let { email_address } = req.params;

  try {
    mailchimp
      .post(
        {
          path: `/lists/${MAILCHIMP_LIST_ID}`
        },
        {
          members: [
            {
              email_address,
              status: "subscribed"
            }
          ]
        }
      )
      .then(results => {
        return res.status(200).json({
          success: true,
          msg: `Successfully added ${email_address} to the mailing list`,
          results
        });
      })
      .catch(err => {
        return res.status(400).json({
          success: false,
          err
        });
      });
  } catch (err) {
    return res.status(400).json({
      success: false,
      err
    });
  }
});

/**
 *  POST: Put multiple emails into the Mailchimp mailing list in one batch action
 */
router.post("/api/subscribe/batch", (req, res) => {
  let { emails } = req.body;
  let calls = [];

  try {
    if (emails && emails.length) {
      emails.forEach(email_address => {
        calls.push({
          method: "post",
          path: `/lists/${MAILCHIMP_LIST_ID}`,
          body: {
            email_address,
            status: "subscribed"
          }
        });
      });

      mailchimp.batch(
        calls,
        () => {
          return res.status(200).json({
            success: true,
            msg:
              "Successfully appended emails from the list to the Mailchimp list"
          });
        },
        {
          wait: true,
          interval: 2000,
          unpack: true
        }
      );
    } else {
      throw new Error("Emails list is empty");
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      err
    });
  }
});

module.exports = router;
