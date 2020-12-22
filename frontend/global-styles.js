// eagerly import theme styles so as we can override them
import '@vaadin/vaadin-lumo-styles/all-imports';

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
<custom-style>
  <style>
    html {
    }
  </style>
</custom-style>
`;

function addCssBlock(block) {
    const tpl = document.createElement('template');
    tpl.innerHTML = block;
    document.head.appendChild(tpl.content);
}

import $css_grid from './components/grid.css';
addCssBlock(`<dom-module id="grid_override" theme-for="vaadin-grid"><template><style>${$css_grid}</style></template></dom-module>`);

document.head.appendChild($_documentContainer.content);
