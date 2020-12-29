import { nothing, render } from 'lit-html';
import {  html } from 'lit-element';
import GridConfigurator from './GridConfigurator';
import { ifDefined } from 'lit-html/directives/if-defined';
import { GridSortColumnElement } from '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import { GridSorterDirection } from '@vaadin/vaadin-grid/@types/interfaces';
import GridColumnConfigurator from './GridColumnConfigurator';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-checkbox/vaadin-checkbox-group';
import { CheckboxGroupElement } from '@vaadin/vaadin-checkbox/vaadin-checkbox-group';

export function renderGridColumns(gridConfiguration: GridConfigurator | undefined, gridConfigurationUpdated: (t: GridColumnConfigurator[]) => void) {
  return html`${
    gridConfiguration?
    (
      gridConfiguration!.columns.sort((a,b) => (a.orderColumn - b.orderColumn)).map(column =>
      html`<vaadin-grid-sort-column ?hidden="${!column.visible}"
        path="${column.path}" header="${column.headerText}" id="${column.id}"
        direction="${ifDefined(column.direction?(column.direction as "asc" | "desc"): undefined)}"
        @direction-changed="${(event: CustomEvent) => directionChanged(event, gridConfiguration!, gridConfigurationUpdated)}">
        </vaadin-grid-sort-column>`)
    ): nothing
  }`
}

function directionChanged(event: CustomEvent, gridConfiguration: GridConfigurator, gridConfigurationUpdated: (t: GridColumnConfigurator[]) => void) {
  // get column id
  const columnId = Number((event.target as GridSortColumnElement).id);
  const newDirection = (event.detail.value as GridSorterDirection);
  const columns: GridColumnConfigurator[] = [];
  let updated = false;
  // add all hidden columns
  gridConfiguration!.columns.forEach( (column) => {
      let direction;
      if (column.id === columnId) {
        if (column.direction !== newDirection) {
          updated = true;
          direction = newDirection;
        }
      } else {
        // no multi sort, reset the other columns
        if (!gridConfiguration.multisort) {
          direction = null;
        }
      }
      columns.push( {...column, direction: direction as  "asc" | "desc" | undefined });
    }
  );
  if (updated) {
    gridConfigurationUpdated(columns);
  }
}


export function getContextMenu(gridConfiguration: GridConfigurator | undefined, parent: HTMLElement, root: HTMLElement, gridConfigurationUpdated: (t: GridColumnConfigurator[]) => void) {
  const ids  = gridConfiguration?.columns.filter(column => column.visible).map(column => String(column.id));
  // dont use checked of the checkbox as it's buggy: https://github.com/vaadin/vaadin-checkbox/issues/154
  render(
    html`<vaadin-checkbox-group theme="vertical" @change="${(e: CustomEvent) => toggleVisibility(e, gridConfiguration, gridConfigurationUpdated)}" .value="${ids}">
      ${gridConfiguration!.columns.map((configuration) => {
        return html`<vaadin-checkbox value="${configuration.id}">${configuration.headerText}</vaadin-checkbox>`;
      })}
    </vaadin-checkbox-group>
    `,
    root as HTMLElement,
    { eventContext: parent } // bind event listener properly
  );
}


function toggleVisibility(e: CustomEvent, gridConfiguration: GridConfigurator | undefined, gridConfigurationUpdated: (t: GridColumnConfigurator[]) => void) {
    const checkboxGroup = e.currentTarget as CheckboxGroupElement;
    console.log("toggleVisibility");
    const columns: GridColumnConfigurator[] = [];
    // add all hidden columns
    gridConfiguration!.columns.forEach( (column) => {
      const visible = (checkboxGroup.value.includes(String(column.id)));
      columns.push( {...column, visible: visible });
    }
  );
  gridConfigurationUpdated(columns);
}