// constants to make it easy to test and avoid typos mistakes on the tests..

const self = module.exports = {};

self.FIRST_NAME = "John";
self.LAST_NAME = "Doe";
self.USER_EMAIL = "john@doe.com";
self.USER_WRONG_EMAIL = "jane@doe.com";
self.USER_CWID = "12345678";
self.NEW_USER_CWID = "97214538";
self.PASSWORD = "superPassword";
self.WRONG_PASSWORD = "superPAssword";
self.TEST_FILE_NAME = "testFile.txt";
self.TEST_FILE_CONTENTS = "@title@\nHello World\n@title@";
self.TEST_FILE_ID = "x099182s12";

self.USER = {
    email: self.USER_EMAIL,
    firstName: self.FIRST_NAME,
    lastName: self.LAST_NAME,
    cwid: self.USER_CWID,
    password: self.PASSWORD
};
