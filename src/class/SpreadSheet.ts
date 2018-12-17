
export enum SHEET_NAME {
  ATTENDANCE_CONFIRM = '受講確認メール',
  LESSON_LIST = '有料レッスン一覧',
}


// https://qiita.com/tonkotsuboy_com/items/225d08e915a57777c9dc
// use singleton


export class SpreadSheet {

  private static _instance: SpreadSheet;

  sheets: {[key: string]: GoogleAppsScript.Spreadsheet.Sheet} = {};

  private constructor(){}

  public static get instance():SpreadSheet{
    if(!this._instance){
      this._instance = new SpreadSheet();
      Logger.log('SpreadSheet instance created');
    } else {
      Logger.log('SpreadSheet instance called but already created');
    }
    return this._instance;
  };


  getSheet (sheetName: SHEET_NAME): GoogleAppsScript.Spreadsheet.Sheet {
    if (this.sheets[sheetName]){
      return this.sheets[sheetName];
    };

    this.sheets[sheetName] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    return this.sheets[sheetName];
  }


}