
export enum SHEET_NAME {
  ATTENDANCE_CONFIRM = 'メール（コース受講確認）',
  COURSE_LIST = 'Course-List',
}

export interface SheetPosition {
  row: number,
  column: number,
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

/* return -1 if not found */

  getVerticalRowNum(sheet: GoogleAppsScript.Spreadsheet.Sheet, initialPosition: SheetPosition, search_value: string): number{

    Logger.log(`------ getVerticalRowNum: ${search_value}`)
  
    const range = sheet.getRange(initialPosition.row, initialPosition.column, 100, 1 );
    const item_map = range.getValues();
    Logger.log(item_map);

    let row_num = -1;
    for(let i=0; i< item_map.length; i++){
      if(item_map[i][0] == search_value){
        row_num = i;
      }
    }
    if(row_num === -1 ){
      Logger.log(`---- ${search_value} not found----`);
    }else{
      Logger.log(`----_row_num:---- ${row_num}`);
    }

    return row_num;

  }


}