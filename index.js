"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = require("node-fetch");
var nodemailer = require("nodemailer");
var parser = require("node-html-parser");
var url = void 0;
var emails = void 0;
var sender_email = void 0;
var sender_password = void 0;
var query_selector = void 0;
var waiting_time_in_milliseconds = 1000;
var logging = true;
var hour_reminder = 13;
var started = false;
var prev_element = "";
var prev_time = void 0;

function loop() {

    getNewHtml();
    setTimeout(loop, waiting_time_in_milliseconds);
};
function getNewHtml() {
    fetch(url, {
        mode: 'no-cors'
    }).then(function (response) {
        return response.text();
    }).then(function (html) {
        var element = void 0;
        try {
            var root = parser.parse(html);
            element = root.querySelectorAll(query_selector).toString();
            if (logging) {
                console.log("Quered element");
                console.log(element);
            }
        } catch (e) {
            console.log(html);
            return;
        }
        if (started && element.localeCompare(prev_element) !== 0) {
            sendEmailToMany("Fast check your website!", element + " is not equal to " + prev_element);
        }
        if (started && prev_time.getHours() < hour_reminder && new Date().getHours() >= hour_reminder) {
            sendEmailToMany("Hi it is daily raport!", "Your pinger is still online");
        }
        prev_time = new Date();
        prev_element = element;
        started = true;
    });
};
function sendEmail(email_title, email_text, receiver) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender_email,
            pass: sender_password
        }
    });
    var mailOptions = {
        from: sender_email,
        to: receiver,
        subject: email_title,
        text: email_text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
function sendEmailToMany(email_title, email_text) {
    for (var i = 0; i < emails.length; i++) {
        sendEmail(email_title, email_text, emails[i]);
    }
};
/**
 *
 */

var WebObserver = function () {
    /**
     * This class enables observing website element and informing about changes
     * @param {string} _url url of observed website
     * @param {[string]} _emails e-mails, on which will be send email informing about changes on website
     * @param {string} _sender_email e-mail of a sender (HAS TO BE GMAIL)
     * @param {string} _sender_password password of sender
     * @param {string} _query_selector html query selector of observed element on website
     */
    function WebObserver(_url, _emails, _sender_email, _sender_password, _query_selector) {
        _classCallCheck(this, WebObserver);

        url = _url;
        emails = _emails;
        sender_email = _sender_email;
        sender_password = _sender_password;

        query_selector = _query_selector;
    }
    /**
     * Set array of emails on which will be send email informing about changes on website
     * @param {[string]} _emails
     */


    _createClass(WebObserver, [{
        key: "setEmails",
        value: function setEmails(_emails) {
            emails = _emails;
        }
        /**
         * Set url of observed website
         * @param {string} _url
         */

    }, {
        key: "setUrl",
        value: function setUrl(_url) {
            url = _url;
        }
        /**
         * Set sender email
         * @param {string} email
         */

    }, {
        key: "setSender",
        value: function setSender(email) {
            sender_email = email;
        }
        /**
         * Set sender password
         * @param {string} _password
         */

    }, {
        key: "setPassword",
        value: function setPassword(_password) {
            sender_password = _password;
        }
        /**
         * Set if you want to log as many information about your pinger as possible
         * @param {boolean} _logging
         */

    }, {
        key: "setLogging",
        value: function setLogging(_logging) {
            logging = _logging;
        }
        /**
         * Set interval between two checks for changes on website
         * @param {int} _time
         */

    }, {
        key: "setTimeBetweenChecks",
        value: function setTimeBetweenChecks(_time) {
            waiting_time_in_milliseconds = _time;
        }
        /**
         * Set time when you will receive reminder that your observer is up (it will happend every day)
         * @param {int} _hour
         */

    }, {
        key: "setReminder",
        value: function setReminder(_hour) {
            hour_reminder = _hour;
        }
        /**
         * Start chacking for changes on website
         */

    }, {
        key: "start",
        value: function start() {
            if (started) {
                console.log("Already checking for changes");
                return;
            }
            if (url === undefined) {
                console.log("You need to specify url");
                return;
            }
            if (emails === undefined) {
                console.log("You need to specify emails where you want to send your information");
                return;
            }
            if (sender_email === undefined) {
                console.log("You need to specift sender email");
                return;
            }
            if (sender_password === undefined) {
                console.log("You need to specify password of sender");
                return;
            }
            if (logging) {
                sendEmailToMany("Start listening", "Just started to listening on your address");
                console.log("Start listening");
            }
            loop();
        }
    }]);

    return WebObserver;
}();

module.exports = WebObserver;