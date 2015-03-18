// Generate the doc file with the project planning schedule table
import {readFileSync} from 'fs';
import {
    DOM,
    createElement, 
    renderToStaticMarkup
} from 'react';
import marked from 'marked';
import {html} from 'js-beautify';

import {Page} from 'mnmo-components';

var pageOptions = {
    title: 'Cronograma',
    stylesheets: [
        //bootstrap css from CDN
        "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css"
    ]
};

//source file for the schedule table
var mdFile = readFileSync('./src/docs/roadmap.md', {encoding: 'utf8'});
//ignore everything below the first horizontal rule
var mdTable = mdFile.substring(0, mdFile.indexOf('-----\n'));
//add bootstrap table classNames to have a better looking table
var htmlTable = marked(mdTable).replace('<table>', '<table  class="table table-striped">');

console.log( html(
    renderToStaticMarkup(
        createElement(Page, pageOptions, 
            DOM.div({
                id:'main',
                dangerouslySetInnerHTML: {__html: htmlTable}
            })
        )
    )
) );