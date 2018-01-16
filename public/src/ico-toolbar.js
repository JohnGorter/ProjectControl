import '../node_modules/@polymer/polymer/polymer.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'

const htmlTemplate = `
    <style>
        app-toolbar { background-color:var(--dark-primary-color, red);}
        .logo img { height: 45px; padding-top:5px; }
        ::slotted(paper-icon-button) { color:var(--text-primary-color, white);}
    </style>
    <app-toolbar>
        <div class="logo" style="flex:1"><img src="/src/logo.png"></div>
        <slot></slot>
    </app-toolbar>
`


export class IcoToolbar extends Element {
    static get template() { return htmlTemplate; }
}

customElements.define('ico-toolbar', IcoToolbar);