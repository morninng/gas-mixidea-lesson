import { SpreadSheetNamespace } from './SpreadSheet';


export namespace ListLessonInCourseNameSpace {

export enum LESSON_IN_COURSE_KEY {
  LessonInCourseId = 'LessonInCourseId',
  CourseId = 'CourseId',
  CourseName = 'CourseName',
  EachLessonSuffux = 'EachLessonSuffux',
  Teacher = 'Teacher',
  Date = 'Date',
  Price = 'Price',
  PaymentRequestDay = 'PaymentRequestDay',
  LessonStatus = 'LessonStatus',
  AdditionalPaidStudents = 'AdditionalPaidStudents',
  AdditionalFreeStudents = 'AdditionalFreeStudents',
  Absent = 'Absent',
  MakeUpParticipants = 'MakeUpParticipants',
  Mentor = 'Mentor',
}

export const CELL_WORDING_LESSON_IN_COURSE: {[key: string]: string}   = {
  [LESSON_IN_COURSE_KEY.LessonInCourseId]: "LessonInCourseId",
  [LESSON_IN_COURSE_KEY.CourseId]: "CourseId",
  [LESSON_IN_COURSE_KEY.CourseName]: "CourseName",
  [LESSON_IN_COURSE_KEY.EachLessonSuffux]: "EachLessonSuffux",
  [LESSON_IN_COURSE_KEY.Teacher]: "Teacher",
  [LESSON_IN_COURSE_KEY.Date]: "Date",
  [LESSON_IN_COURSE_KEY.Price]: "Price",
  [LESSON_IN_COURSE_KEY.PaymentRequestDay]: "PaymentRequestDay",
  [LESSON_IN_COURSE_KEY.LessonStatus]: "LessonStatus",
  [LESSON_IN_COURSE_KEY.AdditionalPaidStudents]: 'AdditionalPaidStudents',
  [LESSON_IN_COURSE_KEY.AdditionalFreeStudents]: 'AdditionalFreeStudents',
  [LESSON_IN_COURSE_KEY.Absent]: 'Absent',
  [LESSON_IN_COURSE_KEY.MakeUpParticipants]: 'MakeUpParticipants',
  [LESSON_IN_COURSE_KEY.Mentor]: 'Mentor',
}


export interface LessonInCourseData{
  [LESSON_IN_COURSE_KEY.LessonInCourseId]?: string,
  [LESSON_IN_COURSE_KEY.CourseId]?: string,
  [LESSON_IN_COURSE_KEY.CourseName]?: string,
  [LESSON_IN_COURSE_KEY.EachLessonSuffux]?: string,
  [LESSON_IN_COURSE_KEY.Teacher]?: string,
  [LESSON_IN_COURSE_KEY.Date]?: string,
  [LESSON_IN_COURSE_KEY.Price]?: string,
  [LESSON_IN_COURSE_KEY.PaymentRequestDay]?: string,
  [LESSON_IN_COURSE_KEY.LessonStatus]?: string,
  [LESSON_IN_COURSE_KEY.AdditionalPaidStudents]?: string[],
  [LESSON_IN_COURSE_KEY.AdditionalFreeStudents]?: string[],
  [LESSON_IN_COURSE_KEY.Absent]?: string[],
  [LESSON_IN_COURSE_KEY.MakeUpParticipants]?: string[],
  [LESSON_IN_COURSE_KEY.Mentor]?: string[],
}

const PAID_USER_MAX_NUM = 25;
const FREE_USER_MAX_NUM = 5;
const ABSENT_USER_MAX_NUM = 5;
const MAKEUP_USER_MAX_NUM = 5;
const MENTOR_USER_MAX_NUM = 2;

export class ListLessonInCourse {

  lesson_in_course_list_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;

  constructor(){
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    this.lesson_in_course_list_sheet = this.spread_sheet.getSheet( SpreadSheetNamespace.SHEET_NAME.LESSON_IN_COURSE_LIST);
  }

  getMultipleItemKey(){
    return [CELL_WORDING_LESSON_IN_COURSE.PaidStudents, CELL_WORDING_LESSON_IN_COURSE.FreeStudents, CELL_WORDING_LESSON_IN_COURSE.Mentor ];
  }

  getLessonInCourseDataFromId(lessonInCourseId: string): LessonInCourseData | null{

    Logger.log(`-------- getLessonInCourseDataFromId -------------`)

    const lesson_in_course_row_num: number = this.getLessonInCourseIdRowNum(lessonInCourseId);
    if(lesson_in_course_row_num === -1){
      return null;
    }else{
      Logger.log(`lesson_in_course_row_num = ${lesson_in_course_row_num}`)
    }
    const lesson_in_course_data: LessonInCourseData | null = this.getLessonInCourseDataFromRowNum(lesson_in_course_row_num);

    if( !lesson_in_course_data ){
      Browser.msgBox("getLessonInCourseDataFromRowNum failed");
      return null;
    }else{
      Logger.log(lesson_in_course_data);
    }
    return lesson_in_course_data;
  }

  private getLessonInCourseIdRowNum(lessonInCourseId: string): number{
  
    Logger.log('------ getLessonInCourseIdRowNum -------------')
    const single_lesson_row_num = this.spread_sheet.getVerticalRowNum(this.lesson_in_course_list_sheet, {row: 1, column: 1}, lessonInCourseId );
    if(single_lesson_row_num === -1){
      Browser.msgBox(`course id ${lessonInCourseId} not exist in course sheet`);
    }
    return single_lesson_row_num;
  }
  
  
  public getLessonInCourseDataFromRowNum(lesson_in_course_row_num: number): LessonInCourseData | null{
  
    Logger.log(`------ getLessonInCourseDataFromRowNum ------------- ${lesson_in_course_row_num} row`);
    
    /* LessonInCourseData */
    const lesson_in_course_index = this.spread_sheet.getHorizontalIndex(this.lesson_in_course_list_sheet, {row: 1, column: 1}, CELL_WORDING_LESSON_IN_COURSE);
    if(!lesson_in_course_index){
      Browser.msgBox(`lesson_in_course_index cannot retrieve`);

      return null;
    }else{
      Logger.log(' --------- lesson_in_course_index --------- ');
      Logger.log(lesson_in_course_index);
    }

    const lesson_in_course_data: {[key: string]: string} |  {[key: string]: string[]} 
      = this.spread_sheet.getHorzontalDataFromIndex(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: 1}, lesson_in_course_index)

    Logger.log('--------------lesson_in_course_data------------------------');
    Logger.log(lesson_in_course_data);

    const paid_students_column_index = lesson_in_course_index.AdditionalPaidStudents;
    Logger.log(`paid_students_column_index ~ ${paid_students_column_index}`);
    const paid_students_data  = 
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: paid_students_column_index}, PAID_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});


    const free_students_column_index = lesson_in_course_index.AdditionalFreeStudents;
    Logger.log(`free_students_column_index ~ ${free_students_column_index}`);
    const free_students_data  = 
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: free_students_column_index}, FREE_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});
  

    const absent_students_column_index = lesson_in_course_index.Absent;
    Logger.log(`absent_students_column_index ~ ${absent_students_column_index}`);
    const absent_students_data  = 
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: absent_students_column_index}, FREE_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});


    const makeup_participants_column_index = lesson_in_course_index.MakeUpParticipants;
    Logger.log(`makeup_participants_column_index ~ ${makeup_participants_column_index}`);
    const makeup_participants_data  = 
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: makeup_participants_column_index}, FREE_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});


    const mentor_column_index = lesson_in_course_index.Mentor;
    Logger.log(`mentor_column_index ~ ${mentor_column_index}`);
    const mentor_data  = 
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: mentor_column_index}, MENTOR_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});      


    lesson_in_course_data.PaidStudents = paid_students_data || [];
    lesson_in_course_data.FreeStudents = free_students_data || [];
    lesson_in_course_data.Absent = absent_students_data || [];
    lesson_in_course_data.MakeUpParticipants = makeup_participants_data || [];
    lesson_in_course_data.Mentor = mentor_data || [];


    return lesson_in_course_data;
  }


}


}