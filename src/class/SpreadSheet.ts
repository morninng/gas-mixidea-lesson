export class SpreadSheet {

  sheets: {[key: string]: GoogleAppsScript.Spreadsheet.Sheet} = {};

  constructor(){}

  getSheet (sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
    if (this.sheets[sheetName]){
      return this.sheets[sheetName];
    };

    this.sheets[sheetName] = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    return this.sheets[sheetName];
  }


}