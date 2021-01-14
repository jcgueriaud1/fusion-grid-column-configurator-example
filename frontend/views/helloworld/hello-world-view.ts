import '@polymer/iron-icon';
import { CSSModule } from '@vaadin/flow-frontend/css-utils';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-split-layout/vaadin-split-layout';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-upload';
import { customElement, html, LitElement, unsafeCSS } from 'lit-element';
import { registerTranslateConfig, use, translate, get } from "lit-translate";

// @ts-ignore
import styles from './hello-world-view.css';

@customElement('hello-world-view')
export class HelloWorldView extends LitElement {
  static get styles() {
    return [CSSModule('lumo-typography'), unsafeCSS(styles)];
  }


  render() {
    return html`<h1>${translate("header.title")}</h1>
    <p>${translate("header.subtitle")}</p>
    <span>${translate("cta.awesome", { things: () => get("cta.cats") })}</span>
    <vaadin-button @click="${this.switchToEnglish}">English</vaadin-button>
    <vaadin-button @click="${this.switchToFrench}">Francais</vaadin-button>
    `;
  }


  async connectedCallback() {
    super.connectedCallback();
    registerTranslateConfig({
      loader: lang => fetch(`/assets/i18n/${lang}.json`).then(res => res.json())
    });
    use("en");
  }

  switchToFrench() {
    use("fr");
  }

  switchToEnglish() {
    use("en");
  }
}
