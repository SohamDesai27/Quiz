var self = {};

self.response500 = function (res, message) {
    res.status(500).json({
        success: false,
        message: message
    })
};

module.exports = self;
