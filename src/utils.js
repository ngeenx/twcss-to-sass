'use strict';

module.exports = {
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

    /**
     * Add missing suffix
     * 
     * @param {string} string
     * @param {string} suffix
     * 
     * @return string
     */
    addMissingSuffix: function (string, suffix) {
        if (string && string.length) {
            if (!string.endsWith(suffix)) {
                return `${string}${suffix}`;
            }
        }

        return string;
    }
};