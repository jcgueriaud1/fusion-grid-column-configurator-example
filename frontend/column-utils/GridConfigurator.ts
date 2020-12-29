import GridColumnConfigurator from './GridColumnConfigurator';

export default interface GridConfigurator {
  id: number;
  columns: Array<GridColumnConfigurator>;
  name: string;
  multisort: boolean;
}
