const fs = require('fs');
var md = require('markdown-it')();
// var result = md.renderInline('__markdown-it__ rulezz!');

function outlineParser(file) {
    let lines = file.split(/\n\r?/);

    if (!lines.length)
        return 0;

    // handle starter
    if (lines[0].trim() === '---') {
        let i = 1;
        let starter = "";
        for (; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line == '---')
                break;
            starter += line;
        }
        lines = lines.slice(i + 1);
        // yaml?
        console.log('starter\n================');
        console.log(starter);
    }

    console.log('items\n================');
    // handle content
    let blocks = [];
    for (line of lines) {
        // line.replace(/^(\s*)(-|\+|\d+\.)\s*(.*)/, function (_, indent, itemType, itemContent) {
        //     console.log(indent.length, itemType, itemContent);
        // });
        let block = {
            indent: 0,
            type: "",
            text: "",
            classes: new Set(),
            id: "",
        };

        line.replace(/^(\s*)(.*)/, function (_, indent, content) {
            // console.log(indent.length, content);
            block.indent = indent.length;
            if (content.length === 0) {
                return;
            }

            console.log(content)

            if (content.startsWith('-')) {
                block.type = 'unorder';
                block.classes.add('unorder');
                content = content.slice(2);
            } else if (content.startsWith('+')) {
                block.type = 'unorder';
                block.classes.add('unorder').add('active');
                content = content.slice(2);
            } else {
                let pos = content.match(/^\d+\./);
                if (pos) {
                    block.type = 'order';
                    block.classes.add('order');
                    content = content.slice(pos[0].length+1);
                } else {
                    block.type = 'text';
                    block.classes.add('text');
                }
            }

            if (content.startsWith('[]')) {
                block.type = 'todo';
                block.classes.add('todo');
                content = content.slice(2);
            } else if (content.startsWith('[-]')) {
                block.type = 'todo';
                block.classes.add('todo').add('checked');
                content = content.slice(3);
            }

            console.log(block.indent, block.type, block.text);

            content.replace(/^\s*(?:\[(.+?)\])?(.*)/, function (_, attrs, text) {
                attrs && attrs.replace(/(?:\.|#)\w+/g, function (attr) {
                    switch (attr.charCodeAt(0)) {
                        case 35: // '#'
                            block.id = attr.slice(1);
                            break;
                        case 46: // '.'
                            block.classes.add(attr.slice(1));
                            break;
                    }
                });
                block.text = text;
            });
        });
        blocks.push(block);
    }

    // console.log(blocks);

    let stream = (function (blocks) {
        let i = 0;
    
        function next() {
            while (i < blocks.length && isBlank(blocks[i]))
                ++i;
            if (i < blocks.length) {
                return blocks[i++];
            }
        }

        function peak() {
            let old_i = i;
            block = next();
            i = old_i;
            return block;
        }

        return { next, peak };
    })(blocks);

    function isBlank(block) {
        return ! (block.classes.length || block.text.trim().length || block.id);
    }

    function block2html(block) {
        block.classes.add(block.type);
        let classes = [...block.classes].reduce((acc, cur) => acc + ' ' + cur, '').slice(1);
        let text = block.text.trim().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
        text = md.render(text);
        return `<div class="${classes}" id="${block.id}"><span>${text}</span></div>`;
    }

    function convert2html() {
        let html = '';
        while (true) {
            let block = stream.next();
            if (block) {
                // console.log(block.indent, block.text);
                let next_block = stream.peak();
                if (next_block) {
                    if (next_block.indent > block.indent) {
                        block.classes.add('collapsible border-blue-500');
                        html += block2html(block);
                        html += '<div class="content">' + convert2html() + '</div>';
                        let next_next_block = stream.peak();
                        if (next_next_block && next_next_block.indent < block.indent)
                            return html;
                    } else {
                        html += block2html(block);
                        if (next_block.indent < block.indent) {
                            return html;
                        }
                    }
                } else {
                    html += block2html(block);
                    return html;
                }
            } else {
                return html;
            }
        }
    }

    return convert2html();
}


let outlineFile = fs.readFileSync('./outline.md', { encoding: 'utf8' });
let html = outlineParser(outlineFile);
let outlineHtml = fs.readFileSync('./outline.html', { encoding: 'utf8' });
fs.writeFileSync('./output.html', outlineHtml.replace('%%', html));
