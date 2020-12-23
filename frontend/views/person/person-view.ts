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
import '@vaadin/vaadin-icons';
import '@vaadin/vaadin-context-menu';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-ordered-layout/vaadin-vertical-layout';
import '@vaadin/vaadin-split-layout/vaadin-split-layout';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-upload';
import { nothing, render } from 'lit-html';
import { customElement, html, internalProperty, LitElement, property, query, unsafeCSS } from 'lit-element';
import Person from '../../generated/com/example/application/data/entity/Person';
import PersonModel from '../../generated/com/example/application/data/entity/PersonModel';
import * as PersonEndpoint from '../../generated/PersonEndpoint';
import * as GridConfiguratorEndpoint from '../../generated/GridConfiguratorEndpoint';
import styles from './person-view.css';
import GridConfigurator from '../../generated/com/example/application/data/entity/GridConfigurator';
import { GridColumnElement } from '@vaadin/vaadin-grid/src/vaadin-grid-column';
import GridColumnConfigurator from '../../generated/com/example/application/data/entity/GridColumnConfigurator';
import { ButtonElement } from '@vaadin/vaadin-button/vaadin-button';


@customElement('person-view')
export class PersonView extends LitElement {
  static get styles() {
    return [CSSModule('lumo-typography'), unsafeCSS(styles)];
  }

  @query('#grid')
  private grid!: GridElement;

  @query('#menu-button')
  private menuButton!: ButtonElement;

  @property({ type: Number })
  private gridSize = 0;

  @internalProperty()
  private personGridConfiguration: GridConfigurator | undefined;

  private gridDataProvider = this.getGridData.bind(this);

  private renderContextMenu = this.getContextMenu.bind(this);

  private binder = new Binder<Person, PersonModel>(this, PersonModel);

  // todo https://vaadin.com/components/vaadin-grid/html-examples/grid-columns-demos
  render() {
    return html`
      <vaadin-split-layout class="full-size">
        <div class="grid-wrapper">
        <vaadin-context-menu .renderer="${this.renderContextMenu}" open-on="click" .listenOn="${this.menuButton}">
          <vaadin-button theme="icon" aria-label="Hide column menu"
            id="menu-button">
            <iron-icon icon="lumo:menu"></iron-icon>
          </vaadin-button>
        </vaadin-context-menu>
          <vaadin-grid
            id="grid"
            class="full-size"
            theme="small"
            .size="${this.gridSize}"
            .dataProvider="${this.gridDataProvider}"
            @active-item-changed=${this.itemSelected}
            column-reordering-allowed
            @column-reorder="${this.columnReordered}"
          >
          ${
            this.personGridConfiguration?
            (
              this.personGridConfiguration!.columns.sort((a,b) => (a.orderColumn - b.orderColumn)).map(column =>
              html`<vaadin-grid-sort-column ?hidden="${!column.visible}" path="${column.path}" id="${column.id}"></vaadin-grid-sort-column
              >`)
            ): nothing
          }
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

  private getContextMenu(root: HTMLElement) {
      render(
        html`<vaadin-vertical-layout>
          ${this.personGridConfiguration!.columns.map((configuration) => {
            return html`<vaadin-checkbox ?checked="${configuration.visible}" @click="${(e: CustomEvent) => this.toggleVisibility(e, configuration.id)}">${configuration.path}</vaadin-checkbox>`;
          })}
          </vaadin-vertical-layout>
        `,
        root as HTMLElement,
        { eventContext: this } // bind event listener properly
      );
  }

  private toggleVisibility(e: CustomEvent, columnId: Number) {
    console.log("toggleVisibility" + e);
    debugger;
    const columns: GridColumnConfigurator[] = [];
    // add all hidden columns
    this.personGridConfiguration!.columns.forEach( (column) => {
      const visible = (column.id == columnId)?!column.visible:column.visible;
      columns.push( {...column, visible: visible });
    }
  );
  this.personGridConfiguration = {...this.personGridConfiguration!, columns: columns};
  }

  private columnReordered(event: CustomEvent) {
    const orderedColumns = event.detail.columns as GridColumnElement[];
    const columns: GridColumnConfigurator[] = [];
    orderedColumns.forEach((column, order) => {
      const columnConfiguration = this.personGridConfiguration?.columns.find(col => col.id.toString() == column.id);
      if (columnConfiguration) {
        columns.push( {...columnConfiguration, orderColumn: order });
      }
    });
    // add all hidden columns
    this.personGridConfiguration!.columns.forEach( (column) => {
        if (!column.visible) {
          columns.push(column);
        }
      }
    );
    this.personGridConfiguration!.columns = columns;
    GridConfiguratorEndpoint.update(this.personGridConfiguration!);
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
