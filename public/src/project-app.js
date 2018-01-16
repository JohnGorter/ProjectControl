import './project-icons.js'
import './ico-toolbar.js'
import './ico-upgrade.js'
import './ico-pushmessages.js'

import '../node_modules/@polymer/polymer/polymer.js'
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import '../node_modules/@polymer/iron-icons/iron-icons.js'
import '../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js'
import '../node_modules/@iconica/iconicaelements/ico-app.js'  
import '../node_modules/@iconica/iconicaelements/ico-document.js'  
import '../node_modules/@iconica/iconicaelements/ico-query.js'  

import './project-login.js'
import './project-styles.js'
import './project-overview.js'
import './project-filterdialog.js'
import '../node_modules/@polymer/iron-pages/iron-pages.js'

import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import { PropertyEffects } from  '/node_modules/@polymer/polymer/lib/mixins/property-effects.js'

const htmlTemplate = `
    <style include="project-styles">
    #projectUpgradeInfo { padding:10px;}
    #projectUpgradeInfo > span { padding-left:10px;position:relative;top:2px;}
    #logoutDiv { padding:10px;}
    #logoutDiv > span { padding-left:10px;position:relative;top:2px;}
    </style>
    <ico-toolbar>
             <paper-icon-button icon="lock-outline" on-tap="_logoutInfo" hidden$="{{!authenticated}}"></paper-icon-button>
             <paper-icon-button icon="info-outline" on-tap="_renewInfo" hidden$="{{!upgradeavailable}}"></paper-icon-button>
             <paper-icon-button icon="filter-list" on-tap="_toggleFilter" hidden$="{{!authenticated}}"></paper-icon-button>
    </ico-toolbar>
    <ico-upgrade id="upgrade" upgradeavailable="{{upgradeavailable}}"></ico-upgrade>
   
    <div id="toolbarplacer"></div>
    <ico-pushmessages id="push" appguid="{{app}}"" subscription="{{sub}}"></ico-pushmessages>
    <div hidden id="logoutDiv" on-click="_logout">
        <iron-icon icon="info-outline"></iron-icon><span>Druk op deze melding om uit te loggen.</span>
    </div>
    <div hidden id="projectUpgradeInfo" on-click="_renew">
        <iron-icon icon="info-outline"></iron-icon><span>Er is een nieuwe versie beschikbaar van de applicatie. Klik op deze melding om te updaten.</span>
    </div>
    <project-filterdialog id="filters" hidden state="{{filters}}"></project-filterdialog>
    <template is="dom-if" if="{{!authenticated}}">
        <project-login id="login" authenticated="{{authenticated}}" user="{{user}}"></project-login>
    </template>
    <template is="dom-if" if="{{authenticated}}">
        <template id="mylist" is="dom-repeat" items="{{projects}}" filter="_filter" observe="status">
            <div class$="{{_getClass(item.status)}}">
                <project-overview project="{{item}}" on-status-updated="_log" ></project-overview>
            </div>
        </template>
    </template>
    <ico-app
        name="app"
        api-key="AIzaSyD-SZGNaAtAjt2oMbdNT2WrD0d4WXzKl7o"
        auth-domain="my-proj-c0a27.firebaseapp.com"
        database-url="https://my-proj-c0a27.firebaseio.com"
        project-id="my-proj-c0a27"
    ></ico-app>
    <ico-document path="projects" docid="{{projectid}}" data="{{project}}"></ico-document>
    <ico-document path="subscriptions" docid="{{app}}" data="{{sub}}"></ico-document>
    <ico-query app-name="app" path="projects" source="firebasert" data="{{projects}}"></ico-query>

    
    
`;

export class ProjectApp extends PropertyEffects(Element) {
  static get observers() { return ['_renderList(filters.*)', '_login(authenticated)'];}
  static get template() { return htmlTemplate; }
  static get properties(){
      return {
          filters: { type:Object, value:{NotStarted:true, InProgress:true, Done:true}},
          filter: { type:Boolean, value:false},
          authenticated: { type:Boolean, value:false},
          projects: { type:Array, value:[]}
      }
  }
  _log(e){
    //   if (e.detail._id)
    //       this.docid = e.detail._id;
    //   this.set('doc', e.detail);
    this.projectid = e.detail._id;

    this.set('project', e.detail); 
    this.notifyPath("project.status");
    

    // if (e.detail) //  && e.detail._id)
    //  // firebase.firestore().collection('projects').doc(e.detail._id).set(e.detail);
    //   // Write the new post's data simultaneously in the posts list and the user's post list.
    //     var updates = {};
    //     updates['/projects/' + e.detail._id] = e.detail;
    //     firebase.database().ref().update(updates);
  }

  _login(a){
      if (a){
            console.log('authenticated');
            this.$.push.subscribe();
      }
  }
  _logoutInfo(){
    this.$.logoutDiv.hidden = !this.$.logoutDiv.hidden;
  }
  _logout(){
    this.shadowRoot.querySelector("#login")._logout();
    this.$.logoutDiv.hidden = true;
  }

  _toggleFilter(){
      this.$.filters.hidden = !this.$.filters.hidden;
  }

  _renderList(){
      let list = this.shadowRoot.querySelector("#mylist");
      if (list) list.render();
  }
  _renewInfo(){
    this.$.projectUpgradeInfo.hidden = false;
  }
  _renew(){
      this.$.upgrade.upgrade(); 
  }

  _sort(e, e2){
     // console.log("sorting", e.status, e2.status, e.status > e2.status);
     return e.status < e2.status;
  }
  _filter(e){
      return  (e.status == "Done" && this.filters.Done ||
            e.status == "Not Started" && this.filters.NotStarted ||
            e.status == "In Progress" && this.filters.InProgress);
  }
  _getClass(e){
      return e == "Done" ? "done": e == "In Progress" ? "progress" : "";
  }
  _version(){ return `Versie: ${localStorage["version"]}`}
  _toJSON(v){ return JSON.stringify(v)}

}

customElements.define('project-app', ProjectApp);