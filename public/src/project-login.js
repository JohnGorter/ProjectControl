import '../node_modules/@polymer/polymer/polymer.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import '../node_modules/@polymer/iron-icon/iron-icon.js'

const htmlTemplate = `
<style> 
    #container { width:100vw;height:70vh;display:flex;align-items:center;justify-content:center;flex-flow:column}
    .card{background:#FFF;width:350px;height:175px;display:flex;align-items:center;justify-content:center;flex-flow:column;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);}
    .title { margin-bottom:20px;color:var(--primary-text-color, red);font-size:24px;font-family:'roboto'}
    .login{box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);}
    paper-button { background-color:white;}
    #container[hidden] { display:none;}
</style> 
    <div id="container">
     <div class="card">
        <div class="title">Please sign in</div>
        <paper-button class="login" on-tap="_login">
            <iron-icon icon="appicons:google"></iron-icon>&nbsp;
            Sign in with google
        </paper-button>
        </div>
    </div>
`;

export class ProjectApp extends Element {
    static get template() { return htmlTemplate; }
    static get properties() {
        return {
            login: { type: Boolean, value: false, reflectToAttribute: true },
            user: { type: Object, value: {}, notify: true },
            token: { type: Object, value: {}, notify: true },
            authenticated: { type: Boolean, computed: '_isAuthenticated(user)', notify: true },
        }
    }


    connectedCallback() {
        firebase.auth().getRedirectResult().then(authData => {
            this.user = authData;
            this.token = authData && authData.credential.accessToken;
        }).catch(error => {
            this.user = {};
            this.token = {};
        });
    }
    _isAuthenticated() {
        return !(Object.keys(this.user).length === 0 && this.user.constructor === Object);
    }

    _logout() {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            this.token = {};
            this.user = {};
        }).catch((error) => {
            // An error happened.
        });
    }
    _login() {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');

        firebase.auth().signInWithRedirect(provider);

        // firebase.auth().signInWithRedirect(provider).then((result) => {
        //     // This gives you a Google Access Token. You can use it to access the Google API.
        //     this.token = result.credential.accessToken;
        //     // The signed-in user info.
        //     this.user = result.user;
        //     debugger;
        //     // ...
        //   }).catch((error) => {
        //     this.token = {}; 
        //     this.user = {};
        //   });
    }
}

customElements.define('project-login', ProjectApp);