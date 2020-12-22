import '@polymer/iron-icon';
import { showNotification } from '@vaadin/flow-frontend/a-notification';
import { EndpointError } from '@vaadin/flow-frontend/Connect';
import { CSSModule } from '@vaadin/flow-frontend/css-utils';
import { Binder, field } from '@vaadin/form';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-date-picker';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-grid';
import { GridDataProviderCallback, GridDataProviderParams, GridElement } from '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import { GridSortColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-split-layout/vaadin-split-layout';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-upload';
import { customElement, html, internalProperty, LitElement, property, query, unsafeCSS } from 'lit-element';
import GridConfigurator from '../../generated/com/example/application/data/entity/GridConfigurator';
import Person from '../../generated/com/example/application/data/entity/Person';
import PersonModel from '../../generated/com/example/application/data/entity/PersonModel';
import * as PersonEndpoint from '../../generated/PersonEndpoint';
import * as GridConfiguratorEndpoint from '../../generated/GridConfiguratorEndpoint';
// @ts-ignore
import styles from './hello-world-view.css';

@customElement('hello-world-view')
export class HelloWorldView extends LitElement {
  static get styles() {
    return [CSSModule('lumo-typography'), unsafeCSS(styles)];
  }

  @query('#grid')
  private grid!: GridElement;

  @property({ type: Number })
  private gridSize = 0;

  @internalProperty()
  private personGridConfiguration: GridConfigurator | undefined;

  private gridDataProvider = this.getGridData.bind(this);

  private binder = new Binder<Person, PersonModel>(this, PersonModel);

  render() {
    return html`
      <vaadin-split-layout class="full-size">
        <div class="grid-wrapper">
          <vaadin-grid
            id="grid"
            class="full-size"
            .size="${this.gridSize}"
            .dataProvider="${this.gridDataProvider}"
            @active-item-changed=${this.itemSelected}
          >
          </vaadin-grid>
        </div>
        <div id="editor-layout">
          <div id="editor">
            <vaadin-form-layout
              ><vaadin-text-field
                label="First name"
                id="firstName"
                ...="${field(this.binder.model.firstName)}"
              ></vaadin-text-field
              ><vaadin-text-field
                label="Last name"
                id="lastName"
                ...="${field(this.binder.model.lastName)}"
              ></vaadin-text-field
              ><vaadin-text-field label="Email" id="email" ...="${field(this.binder.model.email)}"></vaadin-text-field
              ><vaadin-text-field label="Phone" id="phone" ...="${field(this.binder.model.phone)}"></vaadin-text-field
              ><vaadin-date-picker
                label="Date of birth"
                id="dateOfBirth"
                ...="${field(this.binder.model.dateOfBirth)}"
              ></vaadin-date-picker
              ><vaadin-text-field
                label="Occupation"
                id="occupation"
                ...="${field(this.binder.model.occupation)}"
              ></vaadin-text-field
              ><vaadin-checkbox
                id="important"
                ...="${field(this.binder.model.important)}"
                style="padding-top: var(--lumo-space-m);"
                >Important</vaadin-checkbox
              ></vaadin-form-layout
            >
          </div>
          <vaadin-horizontal-layout id="button-layout" theme="spacing">
            <vaadin-button theme="primary" @click="${this.save}">Save</vaadin-button>
            <vaadin-button theme="tertiary" @click="${this.cancel}">Cancel</vaadin-button>
          </vaadin-horizontal-layout>
        </div>
      </vaadin-split-layout>
    `;
  }

  private async getGridData(params: GridDataProviderParams, callback: GridDataProviderCallback) {
    const index = params.page * params.pageSize;
    const data = await PersonEndpoint.list(index, params.pageSize, params.sortOrders as any);
    callback(data);
  }

  async connectedCallback() {
    super.connectedCallback();
    this.gridSize = await PersonEndpoint.count();

    this.personGridConfiguration = await GridConfiguratorEndpoint.findByName("person");

    this.personGridConfiguration?.columns.forEach(
      columnConfiguration => {
        const column = new GridSortColumnElement();
        column.path = columnConfiguration.path;
        column.hidden = !columnConfiguration.visible;
        this.grid.append(column);
      }
    );
  }

  private async itemSelected(event: CustomEvent) {
    const item: Person = event.detail.value as Person;
    this.grid.selectedItems = item ? [item] : [];

    if (item) {
      const fromBackend = await PersonEndpoint.get(item.id);
      fromBackend ? this.binder.read(fromBackend) : this.refreshGrid();
    } else {
      this.clearForm();
    }
  }

  private async save() {
    try {
      await this.binder.submitTo(PersonEndpoint.update);

      if (!this.binder.value.id) {
        // We added a new item
        this.gridSize++;
      }
      this.clearForm();
      this.refreshGrid();
      showNotification('Person details stored.', { position: 'bottom-start' });
    } catch (error) {
      if (error instanceof EndpointError) {
        showNotification('Server error. ' + error.message, { position: 'bottom-start' });
      } else {
        throw error;
      }
    }
  }

  private cancel() {
    this.grid.activeItem = undefined;
  }

  private clearForm() {
    this.binder.clear();
  }

  private refreshGrid() {
    this.grid.selectedItems = [];
    this.grid.clearCache();
  }
}
