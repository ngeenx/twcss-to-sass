'use strict';

const fs = require('fs');

exports.utils = {
    cleanText: function (string, preventEmpty = false) {
        if (string && string.length) {
            let _string = string.replace(/(\r\n|\n|\r|\s+)/gm, ' ')
                .replace('  ', ' ')
                .trim(' ');

            return preventEmpty && (/^\s+$/gm).test(string) ? null : _string;
        }

        return null;
    },
    saveAs: function (destination, content) {
        fs.writeFileSync(destination, content, function (err) {
            if (err) throw err;
        });
    }
};