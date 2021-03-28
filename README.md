# What this package is for

If you need to observe visual change on website, this plugin is for you.

# How to use

On the start create class instance like below:

```javascript
const WebObserver = require('website-observer');

const observer = new WebObserver("http://www.wp.pl", undefined, undefined, undefined, "div.mySuperClass");

```

First parameter is website which you want to observe. \\
Second parameter is list of emails which will be inform about changes on observed website. You can also add them later like below:
```javascript
observer.setEmails(["ania@myEmail.com", "adam@myEmail.kiss"]);
```
Third parameter is sender email. You need to prepare email which will be inform you about changes on your observed website. For now it has to be gmail! Ensure that you enables unsafe contacts in this gmail account. Next parameter is password. You can also add them as below.
```javascript
observer.setSender("sender@gmail.com");
observer.setPassword("MySuperSecretPassword");
```
Last parameter is query selector of item on website which you want to observe.\\
And on the end we can start our observation! Have fun!
```javascript
observer.start();
```
Other cool functions:
```javascript
observer.setLogging(false);
observer.setTimeBetweenChecks(10000);
observer.setReminder(11);
```
And please let me know if something not working for you! It is my first package.