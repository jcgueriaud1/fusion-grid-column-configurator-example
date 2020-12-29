export default interface GridColumnConfigurator {
  id: number;
  direction?: string; // Cannot generate union type with Vaadin Fusion see https://github.com/vaadin/flow/issues/8064
  headerText: string;
  orderColumn: number;
  path: string;
  visible: boolean;
}