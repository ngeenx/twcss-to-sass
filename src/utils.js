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
    },

    /**
     * Fix formatter SASS @apply tailwind broken colon (":") syntax
     * 
     * Exp: @apply bg-white hover: shadow-2xl ...
     *                           ^^^
     * @param {string} content
     * 
     * @return string
     */
    fixFomatterApplyIssue: function (content) {
        if (content && content.length) {
            var lines = content.split('\n'),
                pattern = /@apply( [a-zA-Z0-9-_\/: ]+)? [a-zA-Z0-9-_\/:]+(: )([a-zA-Z0-9-_\/: ]+)?;/gm;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                if (line.match(pattern)) {
                    lines[i] = line.replace(': ', ':');
                }
            }

            return lines.join('\n');
        }

        return content;
    }
};