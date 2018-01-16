import '../node_modules/@polymer/polymer/polymer.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import '../node_modules/@polymer/paper-button/paper-button.js'
import '../node_modules/@polymer/paper-listbox/paper-listbox.js'
import '../node_modules/@polymer/paper-item/paper-item.js'
import '../node_modules/@polymer/paper-checkbox/paper-checkbox.js'
import '../node_modules/@polymer/iron-icon/iron-icon.js'

const htmlTemplate = `
    <style>
        #container { background-color:var(--light-primary-color);margin:20px;}
        paper-listbox { background-color:var(--light-primary-color);}
        paper-checkbox { margin-left:15px;background-color:var(--light-primary-color);}
    </style>
    <div id="container">
        <paper-listbox>
        <paper-checkbox noink checked="{{state.NotStarted}}">Not Started</paper-checkbox>
        <paper-checkbox noink checked="{{state.InProgress}}">In Progress</paper-checkbox>
        <paper-checkbox noink checked="{{state.Done}}">Done</paper-checkbox>
        </paper-listbox>
    </div>
`;

export class ProjectFilterDialog extends Element {
  static get template() { return htmlTemplate; }
}

customElements.define('project-filterdialog', ProjectFilterDialog);