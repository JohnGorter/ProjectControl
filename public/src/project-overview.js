import '../node_modules/@polymer/polymer/polymer.js'
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import '../node_modules/@polymer/iron-icons/iron-icons.js'
import '../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js'
import '../node_modules/@polymer/iron-pages/iron-pages.js'

import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'

import './project-status.js'
import './project-info.js'

const htmlTemplate = `
    <style>
        .overviewcontainer { border-radius:5px;overflow:hidden;position:relative; display:flex;border:0px solid black;height:80px;margin:10px;text-align:center;transition:height 0.2s ease-in-out;}
        .overviewtitle { padding-top:20px;will-change:transform;position:absolute;width:100%; z-index:2;background-color:var(--dark-primary-color);color:var(--light-primary-color);height:100%;transition:transform 0.1s ease-in-out;}
        .overviewactions { position:absolute;width:200px;z-index:0;height:100%;right:0px;}
        div[left] { transform:translateX(-200px);}
        .overviewaction { height:100%;display:flex;}
        .overviewaction * { flex:1;}
        .overviewcontainer.done { opacity:0.4;}
        .progress  { background-color:var(--accent-color);}
    </style>
    <div id="container" class$="{{_getClass('overviewcontainer ', project.status)}}" on-tap="_tap">
       <div class$="{{_getClass('overviewtitle ', project.status)}}" id="title">
       {{ project.title }} <br/>
       <small>{{ project.description }}</small> <br/><br/>
       </div>
       <div class="overviewactions">
            <div class="overviewaction">
                <project-info info="{{project.info}}" on-tap="_showInfo"></project-info>
                <project-status status="{{project.status}}" on-status-updated="_changeStatus"></project-status>
            </div>
       </div>
    </div>
    
`;

export class ProjectOverview extends GestureEventListeners(Element) {
//   static get observers() {return ['_changeStatus(project.status)'];}
  static get template() { return htmlTemplate; }
  static get properties(){
      return {
          project: { type:Object, value:{} }
      }
    }

  connectedCallback(){
      this.$.container.addEventListener('touchstart', this._touch.bind(this));
      this.$.container.addEventListener('touchmove', this._touch.bind(this));
      this.$.container.addEventListener('touchend', this._touch.bind(this));
  }
  _showInfo(e){
  }

  _changeStatus(e){
      this.dispatchEvent(new CustomEvent("status-updated", { detail:this.project}));
  }
  _getClass(p, e){
    return p + " " + (e == "Done" ? "done": e == "In Progress" ? "progress" : "");
  }
  _tap(){
    if (this.$.title.attributes['left']){
        this.$.title.removeAttribute('left');
    } else {
        this.$.title.setAttribute('left',true);
    }
  }

  _touch(e){
      //console.log('e', e);
      if (e.type == "touchstart"){
          this._tracking = true;
          this._origx = e.touches[0].clientX;
          this._origy = e.touches[0].clientY;
          this._dx = 0;
          this._dy = 0;
      }
     
      if (e.type == "touchmove" && this._tracking){
        this._dx = this._origx - e.touches[0].clientX;
        this._dy = this._origy - e.touches[0].clientY;
      }

      if (e.type == "touchend" && this._tracking){
        //  console.log('touchend dx', this._dx, this._dy);
         this._tracking = false;
         if (this._dx < -50 && this._dy > -50 && this._dy < 50) {
            this.$.title.removeAttribute('left');
         }
         else if (this._dx > 50 && this._dy > -50 && this._dy < 50) {
            this.$.title.setAttribute('left',true);
            
         } else if (this._dy > -50 && this._dy < 50) {
             this._tap();
         }

      }
  }
}

customElements.define('project-overview', ProjectOverview);