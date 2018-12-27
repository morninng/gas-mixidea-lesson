
export namespace SpreadSheetNamespace {


export enum SHEET_NAME {
  ATTENDANCE_CONFIRM = 'メール（コース受講確認）',
  COURSE_LIST = 'Course-List',
  ATTENDANCE_CONFIRM_SINGLE_LESSON = 'メール（単発Lesson受講確認）',
  SINGLE_LESSON_LIST = '単発Lesson-List',
  ATTENDANCE_CONFIRM_LESSON_IN_COURSE = 'メール（LessonInCourse）',
  LESSON_IN_COURSE_LIST = 'Lesson-In-Course',
  User = 'User',
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

    Logger.log(`------ sheet: ${sheet}`)
    Logger.log(`------ getVerticalRowNum: ${search_value}`)
  
    const range = sheet.getRange(initialPosition.row, initialPosition.column, 100, 1 );
    const item_map = range.getValues();
    Logger.log(item_map);

    let row_num = -1;
    for(let i=0; i< item_map.length; i++){
      if(item_map[i][0] == search_value){
        row_num = i + 1;  // array is from 0 but row/column is from 1
      }
    }
    if(row_num === -1 ){
      Logger.log(`---- ${search_value} not found----`);
    }else{
      Logger.log(`----_row_num:---- ${row_num}`);
    }

    return row_num;

  }

  getVerticalIndex(sheet: GoogleAppsScript.Spreadsheet.Sheet, initialPosition: SheetPosition, cell_wording){

    const index = {}
    for(let key in cell_wording){
      index[key] = -1;
    }
    const range = sheet.getRange(initialPosition.row, initialPosition.column, 100, 1 );
    const item_map = range.getValues();

    for(let i=0; i< item_map.length; i++ ){
      for(let key in cell_wording){
        if(item_map[i][0] === cell_wording[key]){
          index[key] = i + 1; // array is from 0 but row/column is from 1
        }
      }
    }
    Logger.log(`-------- index -------${index}-----`);
    for(let key in index){
      if(index[key] === -1){
        Browser.msgBox(`vertical index ${key} not found`);
        Logger.log(`vertical index ${key} not found`)
        return null;
      }
    }
    return index;
  }

  getHorizontalIndex(
    sheet: GoogleAppsScript.Spreadsheet.Sheet, 
    initialPosition: SheetPosition, 
    cell_wording: {[key: string]: string}): {[key: string]: number} | null {


    const index = {}; 
    for(let key in cell_wording){
      index[key] = -1;
    }
    
    const range = sheet.getRange(initialPosition.row, initialPosition.column, 1, 100 );
    const item_map = range.getValues();
    const item_arr: string[] = item_map[0].map((element)=>{ return String(element) });
  
    for(let i=0; i< item_arr.length; i++ ){

      for(let key in cell_wording){;
        if(item_arr[i] === cell_wording[key]){
          index[key] = i + 1; // array is from 0 but row/column is from 1
        }
      }
    }
    for(let key in index){
      if(index[key] === -1){
        Browser.msgBox(`horizontal index ${key} not found`);
        Logger.log(`horizontal index ${key} not found`)
        return null;
      }
    }
    return index;
  }

  getHorzontalDataFromIndex(
      sheet: GoogleAppsScript.Spreadsheet.Sheet, 
      initialPosition: SheetPosition, 
      index: {[key: string]: number} ){

    const data = {};
    const range = sheet.getRange(initialPosition.row, initialPosition.column, 1, 50 );
    const item_map = range.getValues();
    const item_arr = item_map[0]; /// course_arr is from 0 and incex is from 1

    for(let key in index){
      data[key] = String(item_arr[index[key] - 1]);
    }

    return data;

  }

  getHorzontalData(
    sheet: GoogleAppsScript.Spreadsheet.Sheet, 
    initialPosition: SheetPosition, 
    number_of_cell: number ):  string[] {


    const range = sheet.getRange(initialPosition.row, initialPosition.column, 1, number_of_cell );
    const item_map = range.getValues();
    const item_arr: string[] = item_map[0].map((element)=>{ return String(element) });

    return item_arr;
  }



}

}
