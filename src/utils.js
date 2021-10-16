'use strict';

// const fs = require('fs');

exports.utils = {
    /**
     * Clean new lines and duplicated whitespaces in string
     * 
     * @param {string} string 
     * @param {boolean} preventEmpty 
     * 
     * @returns string 
     */
    cleanText: function (string, preventEmpty = false) {
        if (string && string.length) {
            let _string = string.replace(/(\r\n|\n|\r|\s+)/gm, ' ')
                .replace('  ', ' ')
                .trim(' ');

            return preventEmpty && (/^\s+$/gm).test(string) ? null : _string;
        }

        return null;
    },
};