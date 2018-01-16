import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from '/node_modules/@polymer/polymer/polymer-element.js'


export class IcoPush extends Element {
    static get properties() {
        return { 
            auto: { type:Boolean, value:false, reflectToAttribute:true },
            subscription: { type:Object, notify:true, value:{} },
            appguid: { type:String, notify:true, value:'', readOnly:true }
        }
    }

    connectedCallback(){
        console.log('should we start'+ this.auto);
        if (this.auto)
            this.subscribe(); 
    }

    subscribe(){
        this._subscribeUserToPush();
    }

    _urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/')
        ;
        const rawData = window.atob(base64);
        return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }

    _uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    _subscribeUserToPush() {
        // get guid for this app or..
        let appguid;
        if ('appguid' in localStorage) { appguid = localStorage["appguid"]; }
        else {  appguid = this._uuidv4(); localStorage["appguid"] = appguid; }

        // generate a new guid for this device
        return navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            registration.pushManager.getSubscription().then((subscription) => {
                if (!subscription) {
                    const subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: this._urlBase64ToUint8Array(
                            "BIhEAaJ_CafHwMzJ4Be3-4oyPTeyQsmND5CL7txodaTE2h85pqxvYConMuRTwUb01ta4SJyou8it8whn77EYvds"
                        )
                    };
                  registration.pushManager.subscribe(subscribeOptions).then(pushSubscription => {
                        let payload = { subscription:pushSubscription, deviceId:appguid};
                        this._sendSubscriptionToBackEnd(payload);
                        return pushSubscription;
                    })
                    .catch(err => { 
                    });
                } else {
                    let payload = { subscription:subscription, deviceId:appguid};
                    this._sendSubscriptionToBackEnd(payload);
                }
            }).catch(err =>  {
                console.log(err);
            });
        }).catch(err =>  {
            console.warn(err);
        });
    }

    _sendSubscriptionToBackEnd(subscription) {
       this._setAppguid(subscription.deviceId);
       this.subscription = subscription.subscription;
    }
}


customElements.define('ico-pushmessages', IcoPush);