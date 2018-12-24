import { SpreadSheetNamespace } from './SpreadSheet';

export namespace ListCourseNameSpace {

export enum COURSE_KEY {
  CourseId = 'CourseId',
  CourseName = 'CourseName',
  Teacher = 'Teacher',
  Term = 'Term',
  DayOfTheWeek = 'DayOfTheWeek',
  Number = 'Number',
  UnitLessonPrice = 'UnitLessonPrice',
  CoursePrice = 'CoursePrice',
  ParticipantNumber = 'ParticipantNumber',
  TotalRevenue = 'TotalRevenue',
  PaymentRequestDay = 'PaymentRequestDay',
  LessonStatus = 'LessonStatus',
  Students = 'Students',
}


// export interface CourseCellKey{
//   [COURSE_KEY.CourseId]?: string
//   [COURSE_KEY.CourseName]?: string;
//   [COURSE_KEY.Teacher]?: string;
//   [COURSE_KEY.Term]?: string;
//   [COURSE_KEY.DayOfTheWeek]?: string;
//   [COURSE_KEY.Number]?: string;
//   [COURSE_KEY.UnitLessonPrice]?: string;
//   [COURSE_KEY.CoursePrice]?: string;
//   [COURSE_KEY.ParticipantNumber]?: string;
//   [COURSE_KEY.TotalRevenue]?:string;
//   [COURSE_KEY.PaymentRequestDay]?: string;
//   [COURSE_KEY.LessonStatus]?:string;
//   [COURSE_KEY.Students]?: string;
// }


export const CELL_WORDING_COURSE: {[key: string]: string}   = {
  [COURSE_KEY.CourseId]: "Course-ID",
  [COURSE_KEY.CourseName]: "Course-Name",
  [COURSE_KEY.Teacher]: "Teacher",
  [COURSE_KEY.Term]: "Term",
  [COURSE_KEY.DayOfTheWeek]: "DayOfTheWeek",
  [COURSE_KEY.Number]: "Number",
  [COURSE_KEY.UnitLessonPrice]: "UnitLessonPrice",
  [COURSE_KEY.CoursePrice]: "CoursePrice",
  [COURSE_KEY.ParticipantNumber]: "ParticipantNumber",
  [COURSE_KEY.TotalRevenue]: "TotalRevenue",
  [COURSE_KEY.PaymentRequestDay]: "PaymentRequestDay",
  [COURSE_KEY.LessonStatus]: "LessonStatus",
  [COURSE_KEY.Students]: "Students",
}


export interface CourseData{
  [COURSE_KEY.CourseId]?: string
  [COURSE_KEY.CourseName]?: string;
  [COURSE_KEY.Teacher]?: string;
  [COURSE_KEY.Term]?: string;
  [COURSE_KEY.DayOfTheWeek]?: string;
  [COURSE_KEY.Number]?: string;
  [COURSE_KEY.UnitLessonPrice]?: string;
  [COURSE_KEY.CoursePrice]?: string;
  [COURSE_KEY.ParticipantNumber]?: string;
  [COURSE_KEY.TotalRevenue]?:string;
  [COURSE_KEY.PaymentRequestDay]?: string;
  [COURSE_KEY.LessonStatus]?:string;
  [COURSE_KEY.Students]?: string[];
  studentsNameArr?: string[];
}


export class ListCourse {


  course_list_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;

  constructor(){
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    this.course_list_sheet = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.COURSE_LIST);
  }

  getStudentsKey(){
    return CELL_WORDING_COURSE.Students;
  }


  getCourseDataFromCourseId(courseId: string): CourseData | null{

    const course_row_num: number = this.getCourseIdRowNum(courseId);
    if(course_row_num === -1){
      return null;
    }
    const course_data: CourseData | null = this.getCourseDataFromRowNum(course_row_num);

    if( !course_data ){
      Browser.msgBox("getCourseDataFromRowNum failed");
      return null;
    }
    return course_data;
  }

  private getCourseIdRowNum(courseId: string): number{
  
    Logger.log('------ getCourseIdRowNum -------------')
    const course_row_num = this.spread_sheet.getVerticalRowNum(this.course_list_sheet, {row: 1, column: 1}, courseId );
    if(course_row_num === -1){
      Browser.msgBox(`course id ${courseId} not exist in course sheet`);
    }
    return course_row_num;
  }
  
  
  
  public getCourseDataFromRowNum(course_row_num: number): CourseData | null{
  
    Logger.log(`------ getCourseDataFromRowNum ------------- ${course_row_num} row`);
    
  
    const course_index = this.spread_sheet.getHorizontalIndex(this.course_list_sheet, {row: 1, column: 1}, CELL_WORDING_COURSE);
    if(!course_index){
      Browser.msgBox(`course index cannot retrieve`);

      return null;
    }else{
      Logger.log('course_index');
      Logger.log(course_index);
    }

    const course_data: {[key: string]: string} |  {[key: string]: string[]} 
      = this.spread_sheet.getHorzontalDataFromIndex(this.course_list_sheet, {row: course_row_num, column: 1}, course_index)

    Logger.log('--------------course_data------------------------');
    Logger.log(course_data);

    const students_column_index = course_index.Students;
    const students_data  = 
      this.spread_sheet.getHorzontalData(this.course_list_sheet, {row: course_row_num, column: students_column_index}, 20)
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});

    Logger.log(students_data);


    // course_data.studentsNameArr = course_arr.slice(course_index.Students, course_index.Students + 20)
    //                                 .map((element)=>{ return String(element)});

    course_data.Students = students_data;


    return course_data;
  }


}

}