import {createElement} from 'react';
import FailedRender from '../components/failedrender';
import merge from 'lodash/object/merge';
export default function (name, template, props, actions){
    try{
        return template(props, actions);
    } catch(e){
        // console.log(e);
        let message = [
            '[' + name + ']', e.message,  e.filename, e.lineno
        ].join(' ');
        return createElement(FailedRender, merge({}, props, {
            message: message
        }));
    }
}
