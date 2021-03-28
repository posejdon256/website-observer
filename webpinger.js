
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const parser = require("node-html-parser");
let url;
let emails;
let sender_email;
let sender_password;
let query_selector;
let waiting_time_in_milliseconds = 1000;
let logging = true; 
let hour_reminder = 13;
let started = false;
let prev_element = "";
let prev_time;

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
        let element;
        try {
            var root = parser.parse(html);
            element = root.querySelectorAll(query_selector).toString();
            if(logging) {
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
class WebObserver{
    /**
     * This class enables observing website element and informing about changes
     * @param {string} _url url of observed website
     * @param {[string]} _emails e-mails, on which will be send email informing about changes on website
     * @param {string} _sender_email e-mail of a sender (HAS TO BE GMAIL)
     * @param {string} _sender_password password of sender
     * @param {string} _query_selector html query selector of observed element on website
     */
    constructor(_url, _emails, _sender_email, _sender_password, _query_selector) {

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
    setEmails(_emails) {
        emails = _emails;
    }
    /**
     * Set url of observed website
     * @param {string} _url 
     */
    setUrl(_url) {
        url = _url;
    }
    /**
     * Set sender email
     * @param {string} email 
     */
    setSender(email){
        sender_email = email;
    }
    /**
     * Set sender password
     * @param {string} _password 
     */
    setPassword(_password) {
        sender_password = _password;
    }
    /**
     * Set if you want to log as many information about your pinger as possible
     * @param {boolean} _logging 
     */
    setLogging(_logging) {
        logging = _logging;
    }
    /**
     * Set interval between two checks for changes on website
     * @param {int} _time
     */
    setTimeBetweenChecks(_time) {
        waiting_time_in_milliseconds = _time;
    }
    /**
     * Set time when you will receive reminder that your observer is up (it will happend every day)
     * @param {int} _hour 
     */
    setReminder(_hour) {
        hour_reminder = _hour;
    }
    /**
     * Start chacking for changes on website
     */
    start() {
        if(started) {
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
}
module.exports = WebObserver;