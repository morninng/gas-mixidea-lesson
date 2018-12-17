import { SpreadSheet } from './SpreadSheet'

const ATTENDANCE_SHEETNAME = "受講確認メール";

export class AttendanceConfirmation {


  attendance_confirmation_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheet;

  constructor(){
    this.spread_sheet = new SpreadSheet();
    this.attendance_confirmation_sheet = this.spread_sheet.getSheet(ATTENDANCE_SHEETNAME);
  }

  public hello(){
    const range: GoogleAppsScript.Spreadsheet.Range = this.attendance_confirmation_sheet.getRange('A1');
    const value = range.getValue();
    Logger.log(value);
  }


}
