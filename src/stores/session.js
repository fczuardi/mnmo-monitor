import {Store} from 'flummox';
import URLs from '../../config/entrypoints.json';
import {parseLoginResponse} from '../../config/responseParsers';
class SessionStore extends Store {
    constructor(flux) {
        super();
        const sessionActions = flux.getActions('session');
        this.register(sessionActions.signIn, this.signIn);
        this.register(sessionActions.signOut, this.signOut);
        this.state = {
            token: null
        };
    }
    signIn(form){
        console.log('get a session token', form);
        let store = this;
        
        /* global fetch */
        /* comes from the polyfill https://github.com/github/fetch */
        fetch(URLs.baseUrl + URLs.session.login, {
          method: 'post',
          body: new FormData(form)
        })
        .then(function(response) {
            response.json().then(function(json) {
                let sessionData = parseLoginResponse(json);
                console.log(sessionData);
                store.setState(sessionData);
            }).catch(function(ex) {
                console.log('parsing failed', ex);
            });
            //HACK to make response.json work on firefox
            response.text().catch(function(){});
        });
    }
    signOut(){
        this.setState({
            token:null
        });
    }
}

export default SessionStore;
