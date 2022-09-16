export enum Action {
  readConfig,
}
export interface IPostData {
  action: Action;
  payload: any;
}
