// custom style for pallete definition
const htmlTemplate = `
    <custom-style>
        <style>
            html { overscroll-behavior:none;overflow: hidden;height: 100%;}
            body { user-select: none;margin:0px;background-color:var(--background-color); font-family: 'Roboto', 'Noto';height: 100%; overflow: auto;}
                    :root { 
                --dark-primary-color:#0A324E; 
                --default-primary-color:#136872;
                --light-primary-color: #ECECEC; 
                --text-primary-color: #FFFFFF; 
                --accent-color: #18C29C; 
                --primary-text-color: #000; 
                --secondary-text-color: #136872; 
                --divider-color: #BDBDBD;
                --background-color: #ECECEC;
            }
        </style>
    </custom-style>
`

const div = document.createElement("div");
div.hidden = true; 
div.innerHTML = htmlTemplate; 
document.body.appendChild(div); 

// shared style for inclusion in shadow dom
const htmlSharedTemplate = `
    <dom-module id="project-styles">
            <template>
                <style>
                    * { font-family:roboto }
                    ico-toolbar { position:fixed;z-index:10;width:100vw;top:0px;}

                    #toolbarplacer { margin-top:75px;}
                </style>
            </template>
    </dom-module>
`
const divShared = document.createElement("div");
divShared.hidden = true; 
divShared.innerHTML = htmlSharedTemplate; 
document.body.appendChild(divShared); 