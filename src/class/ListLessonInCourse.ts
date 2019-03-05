import { SpreadSheetNamespace } from './SpreadSheet';
import { InvoiceData } from '../model/invoice';

import { PaymentDataForLessonInCourse } from '../model/payment';

export namespace ListLessonInCourseNameSpace {

export enum LESSON_IN_COURSE_KEY {
  LessonInCourseId = 'LessonInCourseId',
  CourseId = 'CourseId',
  CourseName = 'CourseName',
  EachLessonSuffix = 'EachLessonSuffix',
  Teacher = 'Teacher',
  Date = 'Date',
  Price = 'Price',
  RegularStudentsNum = 'RegularStudentsNum',
  PaidStudentsNum = 'PaidStudentsNum',
  PaymentRequestDay = 'PaymentRequestDay',
  LessonStatus = 'LessonStatus',
  AdditionalPaidStudents = 'AdditionalPaidStudents',
  AdditionalFreeStudents = 'AdditionalFreeStudents',
  Absent = 'Absent',
  MakeUpParticipants = 'MakeUpParticipants',
  Mentor = 'Mentor',
}
// it is better to use interface to check the proper key while you debug
// export const CELL_WORDING_LESSON_IN_COURSE: CellWordingLessonInCourse   = {

export const CELL_WORDING_LESSON_IN_COURSE: {[key: string]: string}   = {
  [LESSON_IN_COURSE_KEY.LessonInCourseId]: "LessonInCourseId",
  [LESSON_IN_COURSE_KEY.CourseId]: "CourseId",
  [LESSON_IN_COURSE_KEY.CourseName]: "CourseName",
  [LESSON_IN_COURSE_KEY.EachLessonSuffix]: "EachLessonSuffix",
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

interface CellWordingLessonInCourse {
  [LESSON_IN_COURSE_KEY.LessonInCourseId]: string,
  [LESSON_IN_COURSE_KEY.CourseId]: string,
  [LESSON_IN_COURSE_KEY.CourseName]: string,
  [LESSON_IN_COURSE_KEY.EachLessonSuffix]: string,
  [LESSON_IN_COURSE_KEY.Teacher]: string,
  [LESSON_IN_COURSE_KEY.Date]: string,
  [LESSON_IN_COURSE_KEY.Price]: string,
  [LESSON_IN_COURSE_KEY.PaymentRequestDay]: string,
  [LESSON_IN_COURSE_KEY.LessonStatus]: string,
  [LESSON_IN_COURSE_KEY.AdditionalPaidStudents]: string,
  [LESSON_IN_COURSE_KEY.AdditionalFreeStudents]: string,
  [LESSON_IN_COURSE_KEY.Absent]: string,
  [LESSON_IN_COURSE_KEY.MakeUpParticipants]: string,
  [LESSON_IN_COURSE_KEY.Mentor]: string,

}



export interface LessonInCourseData{
  [LESSON_IN_COURSE_KEY.LessonInCourseId]?: string,
  [LESSON_IN_COURSE_KEY.CourseId]?: string,
  [LESSON_IN_COURSE_KEY.CourseName]?: string,
  [LESSON_IN_COURSE_KEY.EachLessonSuffix]?: string,
  [LESSON_IN_COURSE_KEY.Teacher]?: string,
  [LESSON_IN_COURSE_KEY.Date]?: string,
  [LESSON_IN_COURSE_KEY.Price]?: string,
  [LESSON_IN_COURSE_KEY.RegularStudentsNum]?: string,
  [LESSON_IN_COURSE_KEY.PaidStudentsNum]?: string,
  [LESSON_IN_COURSE_KEY.PaymentRequestDay]?: string,
  [LESSON_IN_COURSE_KEY.LessonStatus]?: string,
  [LESSON_IN_COURSE_KEY.AdditionalPaidStudents]?: string[],
  [LESSON_IN_COURSE_KEY.AdditionalFreeStudents]?: string[],
  [LESSON_IN_COURSE_KEY.Absent]?: string[],
  [LESSON_IN_COURSE_KEY.MakeUpParticipants]?: string[],
  [LESSON_IN_COURSE_KEY.Mentor]?: string[],
}

const PAID_USER_MAX_NUM = 20;
const FREE_USER_MAX_NUM = 6;
const ABSENT_USER_MAX_NUM = 3;
const MAKEUP_USER_MAX_NUM = 3;
const MENTOR_USER_MAX_NUM = 2;

export class ListLessonInCourse {

  lesson_in_course_list_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;

  constructor(){
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    this.lesson_in_course_list_sheet = this.spread_sheet.getSheet( SpreadSheetNamespace.SHEET_NAME.LESSON_IN_COURSE_LIST);
  }

  getMultipleItemKey(){
    return [CELL_WORDING_LESSON_IN_COURSE.AdditionalPaidStudents, 
            CELL_WORDING_LESSON_IN_COURSE.AdditionalFreeStudents, 
            CELL_WORDING_LESSON_IN_COURSE.Absent, 
            CELL_WORDING_LESSON_IN_COURSE.MakeUpParticipants, 
            CELL_WORDING_LESSON_IN_COURSE.Mentor ];
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
   
  getLessonInCourseDataWithPaymentRequestDay(payment_request_day: string): InvoiceData[]{

 
    Logger.log(`-----getLessonInCourseDataWithPaymentRequestDay -----${payment_request_day}`)

    const paidUserKey = LESSON_IN_COURSE_KEY.AdditionalPaidStudents;
    const paidUserSearchNum = PAID_USER_MAX_NUM;
    const priceKey = LESSON_IN_COURSE_KEY.Price;
    const course_namekey = LESSON_IN_COURSE_KEY.CourseName;
    const eachn_lesson_suffix = LESSON_IN_COURSE_KEY.EachLessonSuffix;
    const teacherkey = LESSON_IN_COURSE_KEY.Teacher;
    const termkey = LESSON_IN_COURSE_KEY.Date;
    const paymentRequestDaykey = LESSON_IN_COURSE_KEY.PaymentRequestDay;

    // this.single_lesson_list_sheet.getActiveRange()

    const range = this.lesson_in_course_list_sheet.getRange(1, 1, 300, 50 );
    const item_map = range.getValues();
    // Logger.log(item_map);
    const title_items = item_map[0];

    const paidUserIndex = title_items.indexOf(paidUserKey);
    const priceIndex = title_items.indexOf(priceKey);
    const courseNameIndex = title_items.indexOf(course_namekey);
    const eachLessonSuffixIndex = title_items.indexOf(eachn_lesson_suffix);
    const teacherIndex = title_items.indexOf(teacherkey);
    const termIndex = title_items.indexOf(termkey);
    const paymentRequestDayIndex = title_items.indexOf(paymentRequestDaykey);

    const item_filtered_arr = item_map.filter((element)=>{return element[paymentRequestDayIndex] === payment_request_day});
    // Logger.log(`------item_filtered_arr---${payment_request_day}----`);
    // Logger.log(item_filtered_arr);

    const adjusted_data: InvoiceData[] = item_filtered_arr.map((element)=>{
      const paidUsersArr = element
                            .slice(paidUserIndex, paidUserIndex + paidUserSearchNum)
                            .filter(element => {return !!element})
                            .map((element)=>{return String(element)});

      return {
        price: Number(element[priceIndex]),
        name: ` ${String(element[courseNameIndex])} - ${String(element[eachLessonSuffixIndex])}`,
        term: String(element[termIndex]),
        teacher: String(element[teacherIndex]),
        paidUsers: paidUsersArr
      }
    })
    Logger.log(`--------adjusted_data -------------`)
    Logger.log(adjusted_data);

    return adjusted_data;

  }


  getPaymentDataForLessonInCourse(){


 
    Logger.log(`-----getPaymentDataForLessonInCourse`)

    // this.single_lesson_list_sheet.getActiveRange()

    const range = this.lesson_in_course_list_sheet.getRange(1, 1, 300, 50 );
    const item_map = range.getValues();
    // Logger.log(item_map);
    const title_items = item_map[0];

    const CourseIdIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.CourseId);
    const TeacherIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.Teacher);
    const CourseNameIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.CourseName);
    const EachLessonSuffixIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.EachLessonSuffix);
    const DateIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.Date);
    const PriceIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.Price);
    
    const RegularStudentsNumIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.RegularStudentsNum);
    const PaidStudentsNumIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.PaidStudentsNum);
    
    const PaymentRequestDayIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.PaymentRequestDay);


    const paymentRequestDayIndex = title_items.indexOf(LESSON_IN_COURSE_KEY.PaymentRequestDay);


    const adjusted_data: PaymentDataForLessonInCourse[] = item_map.map((element)=>{

      return {
        name: ` ${String(element[CourseNameIndex])} - ${String(element[EachLessonSuffixIndex])} - ${String(element[DateIndex])}`,
        teacher: String(element[TeacherIndex]),
        unit_lesson_price: Number(element[PriceIndex]),
        payment_request_day: String(element[paymentRequestDayIndex]),
        course_id: String(element[CourseIdIndex]),
        regular_students_num: Number(element[RegularStudentsNumIndex]),
        additional_paid_students_num:  Number(element[PaidStudentsNumIndex]),
      }
    })
    Logger.log(`--------adjusted_data -------------`)
    Logger.log(adjusted_data);

    return adjusted_data;


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
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: absent_students_column_index}, ABSENT_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});


    const makeup_participants_column_index = lesson_in_course_index.MakeUpParticipants;
    Logger.log(`makeup_participants_column_index ~ ${makeup_participants_column_index}`);
    const makeup_participants_data  = 
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: makeup_participants_column_index}, MAKEUP_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});


    const mentor_column_index = lesson_in_course_index.Mentor;
    Logger.log(`mentor_column_index ~ ${mentor_column_index}`);
    const mentor_data  = 
      this.spread_sheet.getHorzontalData(this.lesson_in_course_list_sheet, {row: lesson_in_course_row_num, column: mentor_column_index}, MENTOR_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});      


    lesson_in_course_data.AdditionalPaidStudents = paid_students_data || [];
    lesson_in_course_data.AdditionalFreeStudents = free_students_data || [];
    lesson_in_course_data.Absent = absent_students_data || [];
    lesson_in_course_data.MakeUpParticipants = makeup_participants_data || [];
    lesson_in_course_data.Mentor = mentor_data || [];


    return lesson_in_course_data;
  }
}


}