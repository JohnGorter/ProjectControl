import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from '/node_modules/@polymer/polymer/polymer-element.js'

const htmlTemplate = ``;

export class UpgradeElement extends Element {
    static get template () { return htmlTemplate;}
    static get properties() {
        return {
            upgradeavailable: { type:Boolean, value:false, notify:true, readOnly:true }
        }
    }
    connectedCallback(){
        // window.onload does not fire on onePlus PWA...
        setTimeout(() => {
            if (navigator.onLine) this._checkVersion();
        }, 3000);
    }

    _upgradeApp(){
        window.location.reload(true);
    }

    _checkVersion(){
        firebase.database().ref("projectsettings").on('value', snapshot => {
            var localVersion = localStorage["version"];
            var remoteVersion = snapshot.val().version;
            if (remoteVersion && remoteVersion != localVersion){
                localStorage["version"] = remoteVersion;
                this._setUpgradeavailable(true);
            } else {
                this._setUpgradeavailable(false);
            }
        });
    }

    upgrade(){
        this._upgradeApp();
    }
}

customElements.define('ico-upgrade',UpgradeElement);