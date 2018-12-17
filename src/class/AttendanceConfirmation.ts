import { SpreadSheet } from './SpreadSheet';
import { LessonDataIndex, LessonData } from '../model/lesson';

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


  private getLessonId() {
    Logger.log('Hello World');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('受講確認メール');
    const range = sheet.getRange(1, 2, 100, 2 );
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
  
  public getLessonData() {
    const lessonId = this.getLessonId();
    const lesson_row_num: number = this.getLessonIdRow(lessonId);
    const lesson_data: LessonData = this.getLessonDataFromRowNum(lesson_row_num);
    this.writeLessonData(lesson_data);
  }
  
  private writeLessonData(lesson_data: LessonData){
  
  }
  
  
  private getLessonIdRow(lessonId: string): number{
  
    Logger.log('------ getLessonDataFromId -------------')
  
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('有料レッスン一覧');
    const range = sheet.getRange(1, 1, 100, 1 );
    const item_map = range.getValues();
    Logger.log(item_map);
  
  
    let lesson_row_num = 0;
    for(let i=0; i< item_map.length; i++){
      if(item_map[i][0] == lessonId){
        lesson_row_num = i;
      }
    }
    Logger.log(lesson_row_num);
  
    return lesson_row_num;
  
  }
  
  
  
  private getLessonDataFromRowNum(lesson_row_num: number): LessonData{
  
  
    Logger.log(`------ getLessonDataFromRowNum ------------- ${lesson_row_num} row`)
  
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('有料レッスン一覧');
    const range_title = sheet.getRange(1, 1, 1, 50 );
    const title_map = range_title.getValues();
    Logger.log(title_map);
    const title_arr = title_map[0]
  
    const lesson_index: LessonDataIndex = {
      lessonNameIndex: 0,
      teacherNameIndex: 0,
      lessonScheduleIndex: 0,
      lessonWeekdayIndex: 0,
      lessonNumberIndex: 0,
      lessonUnitPriceIndex: 0,
      lessonPriceForOnePersonIndex: 0,
      lessonPaymentRequestDayIndex: 0,
      studentsNameArrIndex: 0,
    }; 
  
  
  
    for(let i=0; i< title_arr.length; i++ ){
      if(title_arr[i]==='講座名'){
        lesson_index.lessonNameIndex = i;
      }
      if(title_arr[i]==='講師名'){
        lesson_index.teacherNameIndex = i;
      }
      if(title_arr[i]==='レッスン時期'){
        lesson_index.lessonScheduleIndex = i;
      }
      if(title_arr[i]==='レッスン曜日'){
        lesson_index.lessonWeekdayIndex = i;
      }
      if(title_arr[i]==='回数'){
        lesson_index.lessonNumberIndex = i;
      }
      if(title_arr[i]==='1レッスン単価'){
        lesson_index.lessonUnitPriceIndex = i;
      }
      if(title_arr[i]==='一人あたり総レッスン単価'){
        lesson_index.lessonPriceForOnePersonIndex = i;
      }
      if(title_arr[i]==='請求月'){
        lesson_index.lessonPaymentRequestDayIndex = i;
      }
      if(title_arr[i]==='生徒名一覧'){
        lesson_index.studentsNameArrIndex = i;
      }
    }
    Logger.log(lesson_index);
    const lesson_data: LessonData = {};
    const range_lesson = sheet.getRange(lesson_row_num, 1, 1, 50 );
    const lesson_map = range_lesson.getValues();
    Logger.log(lesson_map);
    const lesson_arr = lesson_map[0];
    Logger.log(lesson_arr);
    lesson_data.lessonName = String(lesson_arr[lesson_index.lessonNameIndex]);
    lesson_data.teacherName = String(lesson_arr[lesson_index.teacherNameIndex]);
    lesson_data.lessonSchedule = String(lesson_arr[lesson_index.lessonScheduleIndex]);
    lesson_data.lessonWeekday = String(lesson_arr[lesson_index.lessonWeekdayIndex]);
    lesson_data.lessonNumber = Number(lesson_arr[lesson_index.lessonNumberIndex]);
    lesson_data.lessonUnitPrice = Number(lesson_arr[lesson_index.lessonUnitPriceIndex]);
    lesson_data.lessonPriceForOnePerson = Number(lesson_arr[lesson_index.lessonPriceForOnePersonIndex]);
    lesson_data.lessonPaymentRequestDay = String(lesson_arr[lesson_index.lessonPaymentRequestDayIndex]);
    lesson_data.studentsNameArr = lesson_arr.slice(lesson_index.studentsNameArrIndex, lesson_index.studentsNameArrIndex + 20)
                                    .map((element)=>{ return String(element)});
  
    Logger.log('--------------------------------------');
  
    Logger.log(lesson_data);
    return lesson_data;
    
  }





}
