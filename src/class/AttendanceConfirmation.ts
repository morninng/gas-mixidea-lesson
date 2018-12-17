import { SpreadSheet, SHEET_NAME } from './SpreadSheet';
import { LessonData } from '../model/lesson';
import { LessonList } from './LessonList';

export class AttendanceConfirmation {


  attendance_confirmation_sheet: GoogleAppsScript.Spreadsheet.Sheet;
  spread_sheet: SpreadSheet;

  constructor(private lesson_list : LessonList){
    this.spread_sheet = SpreadSheet.instance;
    this.attendance_confirmation_sheet = this.spread_sheet.getSheet(SHEET_NAME.ATTENDANCE_CONFIRM);
  }

  public hello(){
    const range: GoogleAppsScript.Spreadsheet.Range = this.attendance_confirmation_sheet.getRange('A1');
    const value = range.getValue();
    Logger.log(value);
  }


  public getLessonData() {
    const lessonId = this.getLessonId();
    const lesson_data: LessonData = this.lesson_list.getLessonDataFromLessonId(lessonId);
    this.writeLessonData(lesson_data);
  }
  
  private writeLessonData(lesson_data: LessonData){
  
  }

  private getLessonId() {
    Logger.log('Hello World');
    const range = this.attendance_confirmation_sheet.getRange(1, 2, 100, 2 );
    const item_map = range.getValues();
    Logger.log(item_map);
    let lessonId = "";
    item_map.forEach((item)=>{
      if(item[0]=='レッスンID'){
        Logger.log(item);
        lessonId = String(item[1]);
      }
    })
    Logger.log(lessonId);
    return lessonId;
  }

}
