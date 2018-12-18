import { SpreadSheet, SHEET_NAME } from './SpreadSheet';
import { CourseList } from './CourseList';
import { CourseData } from './CourseList';


export enum MAIL_CONFIRM_COURSE_KEY {
  CourseId = 'CourseId',
}

export const CELL_WORDING_MAIL_CONFIRM_COURSE: {[key: string]: string}   = {
  [MAIL_CONFIRM_COURSE_KEY.CourseId]: "Course-ID",
}

export class AttendanceConfirmCourse {

  attendance_confirmation_sheet: GoogleAppsScript.Spreadsheet.Sheet;
  spread_sheet: SpreadSheet;

  constructor(private course_list : CourseList){
    this.spread_sheet = SpreadSheet.instance;
    this.attendance_confirmation_sheet = this.spread_sheet.getSheet(SHEET_NAME.ATTENDANCE_CONFIRM);
  }



  public updateCourseData() {

    const validate = this.checkActiveSheet();
    if(!validate){
      Browser.msgBox("別のシートを参照中です。");
      return;
    }


    const courseId = this.getCourseId();
    const course_data: CourseData = this.course_list.getCourseDataFromCourseId(courseId);
    this.writeCourseData(course_data);
  }
  
  private writeCourseData(course_data: CourseData){

    const range = this.attendance_confirmation_sheet.getRange(1, 2, 100, 1 );
    const item_map = range.getValues();
    // Logger.log(item_map);
    let CourseId = "";
    item_map.forEach((item)=>{
      if( item[0] === CELL_WORDING_MAIL_CONFIRM_COURSE.CourseId ){
        Logger.log(item);
        CourseId = String(item[1]);
      }
    })
  }


  private getCourseId() {
    Logger.log('getCourseId');
    const range = this.attendance_confirmation_sheet.getRange(1, 1, 100, 2 );
    const item_map = range.getValues();
    Logger.log(item_map);
    let courseId = "";
    item_map.forEach((item)=>{
      if( item[0] === CELL_WORDING_MAIL_CONFIRM_COURSE.CourseId){
        Logger.log(item);
        courseId = String(item[1]);
      }
    })
    Logger.log(courseId);
    return courseId;
  }

  checkActiveSheet(){
    return true;
  }
}
