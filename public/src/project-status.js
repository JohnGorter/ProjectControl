import '../node_modules/@polymer/polymer/polymer.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import '../node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import '../node_modules/@polymer/iron-icon/iron-icon.js'

const htmlTemplate = `
    <style>
        .statuscontainer { background-color:red;ill-change:transform; position:relative;transition:transform 0.2s ease-in-out; }
        .status { height:100%;line-height:4.5em;font-variant: small-caps;}
    </style>
    <div id="container" class="statuscontainer" on-track="_scroll">
        <template is="dom-repeat" items="{{statussen}}">
            <div class="status"> {{item}} </div>
        </template>
    </div>
`;

export class ProjectStatus extends GestureEventListeners(Element) {
  static get template() { return htmlTemplate; }
  static get properties() {
      return { 
          status: { type:String, value:'', observer:'_statusChanged', notify:true},
          statussen: { type:Array, value:['Not Started','In Progress','Done']}}
  }

  _statusChanged(){
      (this.status);
      let status = this.statussen.indexOf(this.status);
      this._scrollTo(status * (100 / this.statussen.length));
  }

  _scrollTo(e){
      let p = e >= 62 ? 62 : e >= 31 ? 31 : 0;
      this.$.container.style.transform = 'translateY(-' + p + '%)';
      
  }

  _scroll(e){
     if (e.detail.state == "end" && e.detail.dy > 20) {
       // console.log("scroll down");
         this._percent = this._indexToPercent(this.statussen.indexOf(this.status));
         this._percent -= 31;
         if (this._percent <= 0) this._percent = 0;
         this.status = this.statussen[this._percentToIndex(this._percent)];
         this.dispatchEvent(new CustomEvent("status-updated", { detail:this.status }));
     }
     if (e.detail.state == "end" && e.detail.dy < -20) {
      //  console.log("scroll up");
        this._percent = this._indexToPercent(this.statussen.indexOf(this.status));
        this._percent += 31;
        if (this._percent >= 62) this._percent = 62;
        this.status = this.statussen[this._percentToIndex(this._percent)];
        this.dispatchEvent(new CustomEvent("status-updated", { detail:this.status }));
        
    }
  }

  _indexToPercent(index){
      return index == 2 ? 62 : index == 1 ? 31 : 0;
  }

  _percentToIndex(percent){
      if (percent >= 62) return 2;
      if (percent >= 31) return 1;
      return 0;
  }
}

customElements.define('project-status', ProjectStatus);