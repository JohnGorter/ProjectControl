import '../node_modules/@polymer/polymer/polymer.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import '../node_modules/@polymer/iron-icon/iron-icon.js'

const htmlTemplate = `
    <style>
        .infocontainer { height:100%;width:100%;will-change:transform; position:relative;display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease-in-out; filter: brightness(85%);background-color:var(--dark-primary-color, red);}
    </style>
    <div id="container" class="infocontainer">
        <div><paper-icon-button icon="info-outline"></paper-icon-button></div>
    </div>
`;

export class ProjectStatus extends GestureEventListeners(Element) {
  static get template() { return htmlTemplate; }
  static get properties() {
      return { 
          info: { type:String, value:'', observer:'_infoChanged', notify:true},
      }
  }
}

customElements.define('project-info', ProjectStatus);