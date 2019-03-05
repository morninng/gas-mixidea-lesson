import { SpreadSheetNamespace } from './SpreadSheet';
import { InvoiceData } from '../model/invoice';
import { PaymentDataForCourse } from '../model/payment';

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
  RegularPaidStudents = 'RegularPaidStudents',
  RegularFreeStudents = 'RegularFreeStudents',
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
  [COURSE_KEY.CourseId]: "CourseId",
  [COURSE_KEY.CourseName]: "CourseName",
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
  [COURSE_KEY.RegularPaidStudents]: "RegularPaidStudents",
  [COURSE_KEY.RegularFreeStudents]: "RegularFreeStudents",
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
  [COURSE_KEY.RegularPaidStudents]?: string[];
  [COURSE_KEY.RegularFreeStudents]?: string[];
}


const PAID_USER_MAX_NUM = 13;
const FREE_USER_MAX_NUM = 5;

export class ListCourse {


  course_list_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;

  constructor(){
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    this.course_list_sheet = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.COURSE_LIST);
  }

  getMultipleItemKey(){
    return [CELL_WORDING_COURSE.RegularPaidStudents, CELL_WORDING_COURSE.RegularFreeStudents];
  }

  getRegularStudents(course_id): string[]{

    const courese_data: CourseData = this.getCourseDataFromCourseId(course_id) || {};

    return [ ...courese_data.RegularPaidStudents || [], ...courese_data.RegularFreeStudents || [] ];
    
  }

  getCourseDataWithPaymentRequestDay(payment_request_day: string): InvoiceData[]{

    Logger.log(`----getCourseDataWithPaymentRequestDay ${payment_request_day} -------`)
    const paidUserKey = COURSE_KEY.RegularPaidStudents;
    const paidUserSearchNum = PAID_USER_MAX_NUM;
    const priceKey = COURSE_KEY.CoursePrice;
    const namekey = COURSE_KEY.CourseName;
    const teacherkey = COURSE_KEY.Teacher;
    const termkey = COURSE_KEY.Term;
    const paymentRequestDaykey = COURSE_KEY.PaymentRequestDay;

    // this.course_list_sheet.getActiveRange()

    const range = this.course_list_sheet.getRange(1, 1, 100, 50 );
    const item_map = range.getValues();
    // Logger.log(item_map);
    const title_items = item_map[0];

    const paidUserIndex = title_items.indexOf(paidUserKey);
    const priceIndex = title_items.indexOf(priceKey);
    const nameIndex = title_items.indexOf(namekey);
    const teacherIndex = title_items.indexOf(teacherkey);
    const termIndex = title_items.indexOf(termkey);
    const paymentRequestDayIndex = title_items.indexOf(paymentRequestDaykey);

    const item_filtered_arr = item_map.filter((element)=>{return element[paymentRequestDayIndex] === payment_request_day});
    // Logger.log(`------item_filtered_arr---${payment_request_day}----`);
    Logger.log(item_filtered_arr);

    const adjusted_data: InvoiceData[] = item_filtered_arr.map((element)=>{
      const paidUsersArr = element
                            .slice(paidUserIndex, paidUserIndex + paidUserSearchNum)
                            .filter(element => {return !!element})
                            .map((element)=>{return String(element)});

      return {
        price: Number(element[priceIndex]),
        name: String(element[nameIndex]),
        term: String(element[termIndex]),
        teacher: String(element[teacherIndex]),
        paidUsers: paidUsersArr
      }
    })
    Logger.log(`--------adjusted_data -------------`)
    Logger.log(adjusted_data);

    return adjusted_data;
  }


  getPaymentDataForCourse(): PaymentDataForCourse[]{

    Logger.log(`----getPaymentDataForCourse -------`)

    const range = this.course_list_sheet.getRange(1, 1, 100, 50 );
    const item_map = range.getValues();
    // Logger.log(item_map);
    const title_items = item_map[0];

    const CourseIdIndex = title_items.indexOf(COURSE_KEY.CourseId);
    const CourseNameIndex = title_items.indexOf(COURSE_KEY.CourseName);
    const NumberIndex = title_items.indexOf(COURSE_KEY.Number);
    const CoursePriceIndex = title_items.indexOf(COURSE_KEY.CoursePrice);
    const UnitLessonPriceIndex = title_items.indexOf(COURSE_KEY.UnitLessonPrice);
    const ParticipantNumberIndex = title_items.indexOf(COURSE_KEY.ParticipantNumber);
    const TeacherIndex = title_items.indexOf(COURSE_KEY.Teacher);
    const PaymentRequestDayIndex = title_items.indexOf(COURSE_KEY.PaymentRequestDay);

    // const item_filtered_arr = item_map.filter((element)=>{return element[paymentRequestDayIndex] === payment_request_day});
    // Logger.log(`------item_filtered_arr---${payment_request_day}----`);

    const adjusted_data: PaymentDataForCourse[] = item_map.map((element)=>{

      const payment_data_for_course: PaymentDataForCourse = {
        name: String(element[CourseNameIndex]),
        unit_lesson_price: Number(element[UnitLessonPriceIndex]),
        paid_students_num: Number(element[ParticipantNumberIndex]),
        payment_request_day: String(element[PaymentRequestDayIndex]),
        course_id: String(element[CourseIdIndex]),
        lesson_num: Number(element[NumberIndex]),
        course_revenue: Number(element[CoursePriceIndex]),
        teacher: String(element[TeacherIndex]),
      }
      return payment_data_for_course;
    })
    Logger.log(`--------adjusted_data -------------`)
    Logger.log(adjusted_data);

    return adjusted_data;
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

    const paid_students_column_index = course_index.RegularPaidStudents;
    Logger.log(`paid_students_column_index ~ ${paid_students_column_index}`);
    const paid_students_data  = 
      this.spread_sheet.getHorzontalData(this.course_list_sheet, {row: course_row_num, column: paid_students_column_index}, PAID_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});


    const free_students_column_index = course_index.RegularFreeStudents;
    Logger.log(`free_students_column_index ~ ${free_students_column_index}`);
    const free_students_data  = 
      this.spread_sheet.getHorzontalData(this.course_list_sheet, {row: course_row_num, column: free_students_column_index}, FREE_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});

    course_data.RegularPaidStudents = paid_students_data;
    course_data.RegularFreeStudents = free_students_data;


    return course_data;
  }


}

}