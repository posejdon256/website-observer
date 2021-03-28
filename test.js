const WebObserver = require('./index.js');

const observer = new WebObserver("http://www.wp.pl", undefined, undefined, undefined, "div.sc-1tw0du9-2");
observer.setEmails(["ania@myEmail.com", "adam@myEmail.kiss"]);
observer.setSender("sender@gmail.com");
observer.setPassword("MySuperSecretPassword");


observer.start();