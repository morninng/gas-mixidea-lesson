import { SpreadSheetNamespace } from './SpreadSheet';
import { InvoiceData } from '../model/invoice';

import { PaymentDataForLesson } from '../model/payment';

export namespace ListSingleLessonNameSpace {

export enum SINGLE_LESSON_KEY {
  SingleLessonId = 'SingleLessonId',
  SingleLessonName = 'SingleLessonName',
  Teacher = 'Teacher',
  Date = 'Date',
  Price = 'Price',
  PaidStudentsNum = 'PaidStudentsNum',
  FreeStudentsNum = 'FreeStudentsNum',
  PaymentRequestDay = 'PaymentRequestDay',
  LessonStatus = 'LessonStatus',
  PaidStudents = 'PaidStudents',
  FreeStudents = 'FreeStudents',
  Mentor = 'Mentor',
}

export const CELL_WORDING_SINGLE_LESSON: {[key: string]: string}   = {
  [SINGLE_LESSON_KEY.SingleLessonId]: "SingleLessonId",
  [SINGLE_LESSON_KEY.SingleLessonName]: "SingleLessonName",
  [SINGLE_LESSON_KEY.Teacher]: "Teacher",
  [SINGLE_LESSON_KEY.Date]: "Date",
  [SINGLE_LESSON_KEY.Price]: "Price",
  [SINGLE_LESSON_KEY.PaidStudentsNum]: "PaidStudentsNum",
  [SINGLE_LESSON_KEY.FreeStudentsNum]: "FreeStudentsNum",
  [SINGLE_LESSON_KEY.PaymentRequestDay]: "PaymentRequestDay",
  [SINGLE_LESSON_KEY.LessonStatus]: "LessonStatus",
  [SINGLE_LESSON_KEY.PaidStudents]: "PaidStudents",
  [SINGLE_LESSON_KEY.FreeStudents]: "FreeStudents",
  [SINGLE_LESSON_KEY.Mentor]: "Mentor",
}


export interface SingleLessonData{
  [SINGLE_LESSON_KEY.SingleLessonId]?: string
  [SINGLE_LESSON_KEY.SingleLessonName]?: string;
  [SINGLE_LESSON_KEY.Teacher]?: string;
  [SINGLE_LESSON_KEY.Date]?: string;
  [SINGLE_LESSON_KEY.Price]?: string;
  [SINGLE_LESSON_KEY.PaidStudentsNum]?: string;
  [SINGLE_LESSON_KEY.FreeStudentsNum]?: string;
  [SINGLE_LESSON_KEY.PaymentRequestDay]?: string;
  [SINGLE_LESSON_KEY.LessonStatus]?:string;
  [SINGLE_LESSON_KEY.PaidStudents]?: string[];
  [SINGLE_LESSON_KEY.FreeStudents]?: string[];
  [SINGLE_LESSON_KEY.Mentor]?: string[];
}

const PAID_USER_MAX_NUM = 25;
const FREE_USER_MAX_NUM = 5;
const MENTOR_USER_MAX_NUM = 2;

export class ListSingleLesson {

  single_lesson_list_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;

  constructor(){
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    this.single_lesson_list_sheet = this.spread_sheet.getSheet( SpreadSheetNamespace.SHEET_NAME.SINGLE_LESSON_LIST);
  }

  getMultipleItemKey(){
    return [CELL_WORDING_SINGLE_LESSON.PaidStudents, CELL_WORDING_SINGLE_LESSON.FreeStudents, CELL_WORDING_SINGLE_LESSON.Mentor ];
  }


  getSingleLessonDataFromId(singleLessonId: string): SingleLessonData | null{

    Logger.log(`-------- getSingleLessonDataFromId -------------`)

    const single_lesson_row_num: number = this.getSingleLessonIdRowNum(singleLessonId);
    if(single_lesson_row_num === -1){
      return null;
    }else{
      Logger.log(`single_lesson_row_num = ${single_lesson_row_num}`)
    }
    const single_lesson_data: SingleLessonData | null = this.getSingleLessonDataFromRowNum(single_lesson_row_num);

    if( !single_lesson_data ){
      Browser.msgBox("getCourseDataFromRowNum failed");
      return null;
    }else{
      Logger.log(single_lesson_data);
    }
    return single_lesson_data;
  }

  private getSingleLessonIdRowNum(singleLessonId: string): number{
  
    Logger.log('------ getCourseIdRowNum -------------')
    const single_lesson_row_num = this.spread_sheet.getVerticalRowNum(this.single_lesson_list_sheet, {row: 1, column: 1}, singleLessonId );
    if(single_lesson_row_num === -1){
      Browser.msgBox(`course id ${singleLessonId} not exist in course sheet`);
    }
    return single_lesson_row_num;
  }
  




  getSingleLessonDataWithPaymentRequestDay(payment_request_day: string): InvoiceData[]{

    Logger.log(`-----getSingleLessonDataWithPaymentRequestDay -----${payment_request_day}`)

    const paidUserKey = SINGLE_LESSON_KEY.PaidStudents;
    const paidUserSearchNum = PAID_USER_MAX_NUM;
    const priceKey = SINGLE_LESSON_KEY.Price;
    const namekey = SINGLE_LESSON_KEY.SingleLessonName;
    const teacherkey = SINGLE_LESSON_KEY.Teacher;
    const termkey = SINGLE_LESSON_KEY.Date;
    const paymentRequestDaykey = SINGLE_LESSON_KEY.PaymentRequestDay;

    // this.single_lesson_list_sheet.getActiveRange()

    const range = this.single_lesson_list_sheet.getRange(1, 1, 300, 50 );
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
    // Logger.log(item_filtered_arr);

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
  


  getPaymentDataForSingleLesson(){

    Logger.log(`-----getPaymentDataForLessonInCourse`)

    const range = this.single_lesson_list_sheet.getRange(1, 1, 300, 50 );
    const item_map = range.getValues();
    // Logger.log(item_map);
    const title_items = item_map[0];

    const SingleLessonName = title_items.indexOf(SINGLE_LESSON_KEY.SingleLessonName);
    const TeacherIndex = title_items.indexOf(SINGLE_LESSON_KEY.Teacher);
    const DateIndex = title_items.indexOf(SINGLE_LESSON_KEY.Date);
    const PriceIndex = title_items.indexOf(SINGLE_LESSON_KEY.Price);
    
    const PaidStudentsNumIndex = title_items.indexOf(SINGLE_LESSON_KEY.PaidStudentsNum);
    
    const paymentRequestDayIndex = title_items.indexOf(SINGLE_LESSON_KEY.PaymentRequestDay);


    const adjusted_data: PaymentDataForLesson[] = item_map.map((element)=>{

      return {
        name: ` ${String(element[SingleLessonName])} - ${String(element[DateIndex])}`,
        teacher: String(element[TeacherIndex]),
        unit_lesson_price: Number(element[PriceIndex]),
        paid_students_num: Number(element[PaidStudentsNumIndex]),
        payment_request_day: String(element[paymentRequestDayIndex]),
      }
    })
    Logger.log(`--------adjusted_data -------------`)
    Logger.log(adjusted_data);

    return adjusted_data;
  }

  public getSingleLessonDataFromRowNum(single_lesson_row_num: number): SingleLessonData | null{
  
    Logger.log(`------ getSingleLessonDataFromRowNum ------------- ${single_lesson_row_num} row`);
    
  
    const single_lesson_index = this.spread_sheet.getHorizontalIndex(this.single_lesson_list_sheet, {row: 1, column: 1}, CELL_WORDING_SINGLE_LESSON);
    if(!single_lesson_index){
      Browser.msgBox(`single_lesson_index cannot retrieve`);

      return null;
    }else{
      Logger.log(' --------- single_lesson_index --------- ');
      Logger.log(single_lesson_index);
    }

    const single_lesson_data: {[key: string]: string} |  {[key: string]: string[]} 
      = this.spread_sheet.getHorzontalDataFromIndex(this.single_lesson_list_sheet, {row: single_lesson_row_num, column: 1}, single_lesson_index)

    Logger.log('--------------single_lesson_data------------------------');
    Logger.log(single_lesson_data);

    const paid_students_column_index = single_lesson_index.PaidStudents;
    const paid_students_data  = 
      this.spread_sheet.getHorzontalData(this.single_lesson_list_sheet, {row: single_lesson_row_num, column: paid_students_column_index}, PAID_USER_MAX_NUM )
      .filter((element) =>{ return !!element})
      .map((element)=>{ return String(element)});


      const free_students_column_index = single_lesson_index.FreeStudents;
      const free_students_data  = 
        this.spread_sheet.getHorzontalData(this.single_lesson_list_sheet, {row: single_lesson_row_num, column: free_students_column_index}, FREE_USER_MAX_NUM )
        .filter((element) =>{ return !!element})
        .map((element)=>{ return String(element)});
  
  
      const mentor_column_index = single_lesson_index.Mentor;
      const mentor_data  = 
        this.spread_sheet.getHorzontalData(this.single_lesson_list_sheet, {row: single_lesson_row_num, column: mentor_column_index}, MENTOR_USER_MAX_NUM )
        .filter((element) =>{ return !!element})
        .map((element)=>{ return String(element)});      


    single_lesson_data.PaidStudents = paid_students_data || [];
    single_lesson_data.FreeStudents = free_students_data || [];
    single_lesson_data.Mentor = mentor_data || [];


    return single_lesson_data;
  }


}


}