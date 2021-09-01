'use strict';

const fs = require('fs');
const parse = require('himalaya');
const scssfmt = require('scssfmt');

const utils = require('./utils.js');

const html = fs.readFileSync('./data/mock3.html', {
    encoding: 'utf8'
});

const getAttributes = function (attributes, keys) {
    if (!Array.isArray(keys)) {
        keys = [keys];
    }

    if (Array.isArray(attributes) && attributes.length) {
        var _attributes = {};

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            let _attribute = attributes.filter((x) => x.key == key);

            _attributes[key] = _attribute.length ? utils.utils.cleanText(_attribute[0].value) : null;
        }

        return Object.entries(_attributes).filter((x) => {
            return x.includes(null);
        }).length == keys.length ? null : _attributes;
    }

    return null;
};

const parseHtmlJson = function (htmlJson) {
    if (htmlJson) {
        var _data = null;

        if (Array.isArray(htmlJson)) {
            _data = htmlJson.filter((x) => x.type == 'element');
        } else if (Array.isArray(htmlJson.children)) {
            _data = htmlJson.children;
        }

        return _data.map((node, i) => {
            if (Array.isArray(node.children)) {
                let children = parseHtmlJson(node);

                // find text nodes and merge
                node.text = children.filter((x) => x.type == 'text').map((x) => {
                    return utils.utils.cleanText(x.content, true);
                }).filter((x) => x !== null).join(' ');

                // last cleanup
                node.text = utils.utils.cleanText(node.text, true);

                // get elements
                node.children = children.length ? children.filter((x) => x.type == 'element') : null;
            }

            // get specific attributes
            node.attributes = getAttributes(node.attributes, ['class', 'style']);

            return node.attributes !== null || node.children !== null ? node : null;
        }).filter((node) => node !== null && node !== undefined);
    }

    return null;
};

const getSassTree = function (nodeTree, count = 0) {
    if (nodeTree) {
        var _data = null;

        if (Array.isArray(nodeTree)) {
            _data = nodeTree;
        } else if (Array.isArray(nodeTree.children)) {
            _data = nodeTree.children;
        }

        return _data.map((node) => {
            let block = '',
                blocks = '';

            if (node.attributes === null && node.children === null) {
                return '';
            }

            if (Array.isArray(node.children) && node.children.length) {
                ++count;

                blocks = getSassTree(node, count);
            }

            if (node.attributes) {
                block += node.attributes.class ? `@apply ${node.attributes.class};` : '';
                block += node.attributes.style ? `\n${node.attributes.style}\n` : '';
            }

            if (block.length || blocks.length) {
                let result = `/* ${node.tagName} -> ${node.text ? node.text : 'NOTEXT'} */`;

                result += `.any-${count}-${node.tagName}`;
                result += `{${block}/*#block_${node.children ? node.children.length : '-'}*/${blocks}}`;

                return result;
            }

            return null;
        }).join('');
    }

    return '';
};

exports.twsToSass = {
    toSass: function(html){
        var htmlJson = parse.parse(utils.utils.cleanText(html));

        htmlJson = getSassTree(parseHtmlJson(htmlJson));

        return scssfmt(htmlJson);
    }
};