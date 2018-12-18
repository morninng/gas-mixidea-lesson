import { SpreadSheet, SHEET_NAME } from './SpreadSheet';

export enum COURSE_KEY {
  CourseId = 'CourseId',
  CourseName = 'CourseName',
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


export const CELL_WORDING_COURSE: {[key: string]: string}   = {
  [COURSE_KEY.CourseId]: "Course-ID",
  [COURSE_KEY.CourseName]: "Course-Name",
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

export interface CourseDataIndex{
  [COURSE_KEY.CourseId]: number;
  [COURSE_KEY.CourseName]: number;
  [COURSE_KEY.Term]: number;
  [COURSE_KEY.DayOfTheWeek]: number;
  [COURSE_KEY.Number]: number;
  [COURSE_KEY.UnitLessonPrice]: number;
  [COURSE_KEY.CoursePrice]: number;
  [COURSE_KEY.ParticipantNumber]: number;
  [COURSE_KEY.TotalRevenue]: number;
  [COURSE_KEY.PaymentRequestDay]: number;
  [COURSE_KEY.LessonStatus]: number;
  [COURSE_KEY.Students]: number;
}

export interface CourseData{
  [COURSE_KEY.CourseId]?: string
  [COURSE_KEY.CourseName]?: string;
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


export class CourseList {


  course_list_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheet;

  constructor(){
    this.spread_sheet = SpreadSheet.instance;
    this.course_list_sheet = this.spread_sheet.getSheet(SHEET_NAME.COURSE_LIST);
  }


  getCourseDataFromCourseId(courseId: string): CourseData{

    const course_row_num: number = this.getCourseIdRowNum(courseId);
    const course_data: CourseData = this.getCourseDataFromRowNum(course_row_num);
    return course_data;
  }

  private getCourseIdRowNum(courseId: string): number{
  
    Logger.log('------ getCourseIdRowNum -------------')
  
    const range = this.course_list_sheet.getRange(1, 1, 100, 1 );
    const item_map = range.getValues();
    Logger.log(item_map);
  
    let course_row_num = 0;
    for(let i=0; i< item_map.length; i++){
      if(item_map[i][0] == courseId){
        course_row_num = i;
      }
    }
    Logger.log(course_row_num);
  
    return course_row_num;
  
  }
  
  
  
  private getCourseDataFromRowNum(course_row_num: number): CourseData{
  
  
    Logger.log(`------ getCourseDataFromRowNum ------------- ${course_row_num} row`)
  
    const range_title = this.course_list_sheet.getRange(1, 1, 1, 50 );
    const title_map = range_title.getValues();
    Logger.log(title_map);
    const title_arr: string[] = title_map[0].map((element)=>{ return String(element) });
  
    const course_index: CourseDataIndex = {
      CourseId: 0,
      CourseName: 0,
      Term: 0,
      DayOfTheWeek: 0,
      Number: 0,
      UnitLessonPrice: 0,
      CoursePrice: 0,
      ParticipantNumber: 0,
      TotalRevenue: 0,
      PaymentRequestDay: 0,
      LessonStatus: 0,
      Students: 0,
    }; 
  
    for(let i=0; i< title_arr.length; i++ ){

      // for文ためして、エラーをチェックしてそれをdeactivateする

      if(title_arr[i] === CELL_WORDING_COURSE.CourseId){
        course_index.CourseId = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.CourseName){
        course_index.CourseName = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.Term){
        course_index.Term = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.DayOfTheWeek){
        course_index.DayOfTheWeek = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.Number){
        course_index.Number = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.UnitLessonPrice){
        course_index.UnitLessonPrice = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.CoursePrice){
        course_index.CoursePrice = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.ParticipantNumber){
        course_index.ParticipantNumber = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.TotalRevenue){
        course_index.TotalRevenue = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.PaymentRequestDay){
        course_index.PaymentRequestDay = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.LessonStatus){
        course_index.LessonStatus = i;
      }
      if(title_arr[i] === CELL_WORDING_COURSE.Students){
        course_index.Students = i;
      }
    }
    Logger.log(course_index);
    const course_data: CourseData = {};
    const range_course = this.course_list_sheet.getRange(course_row_num, 1, 1, 50 );
    const course_map = range_course.getValues();
    Logger.log(course_map);
    const course_arr = course_map[0];
    Logger.log(course_arr);
    course_data.CourseId = String(course_arr[course_index.CourseId]);
    course_data.CourseName = String(course_arr[course_index.CourseName]);
    course_data.Term = String(course_arr[course_index.Term]);
    course_data.DayOfTheWeek = String(course_arr[course_index.DayOfTheWeek]);
    course_data.Number = String(course_arr[course_index.Number]);
    course_data.UnitLessonPrice = String(course_arr[course_index.UnitLessonPrice]);
    course_data.ParticipantNumber = String(course_arr[course_index.ParticipantNumber]);
    course_data.TotalRevenue = String(course_arr[course_index.TotalRevenue]);
    course_data.PaymentRequestDay = String(course_arr[course_index.PaymentRequestDay]);
    course_data.LessonStatus = String(course_arr[course_index.LessonStatus]);
    course_data.studentsNameArr = course_arr.slice(course_index.Students, course_index.Students + 20)
                                    .map((element)=>{ return String(element)});
  
    Logger.log('--------------------------------------');
  
    Logger.log(course_data);
    return course_data;
  }


}