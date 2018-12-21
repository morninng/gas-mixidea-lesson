import { SpreadSheet, SHEET_NAME } from './SpreadSheet';
import { CourseList } from './CourseList';
import { CourseData } from './CourseList';


export enum MAIL_CONFIRM_COURSE_KEY {
  MailCourseId = 'MailCourseId',
  Mailmaterial = 'Mailmaterial',
  CourseId = 'CourseId',
  CourseName = 'CourseName',
  Teacher = 'Teacher',
  Students = 'Students',
  Number = 'Number',
  Term = 'Term',
  CoursePrice = 'CoursePrice',
  PaymentRequestDay = 'PaymentRequestDay',
  MailmDataTo = 'MailmDataTo',
  MailmDataCc= 'MailmDataCc',
  MailmDataTitle = 'MailmDataTitle',
  MailmDataContent = 'MailmDataContent',
}

export const CELL_WORDING_MAIL_CONFIRM_ID: CellWordingMailconfirmId   = {
  [MAIL_CONFIRM_COURSE_KEY.MailCourseId]: "Mail-Course-ID",
}
interface CellWordingMailconfirmId {
  [MAIL_CONFIRM_COURSE_KEY.MailCourseId]: string 
}


export const CELL_WORDING_MAIL_CONFIRM_MailMaterialTitle: CellWordingMailconfirmMaterialTitle   = {
  [MAIL_CONFIRM_COURSE_KEY.Mailmaterial]: "mail-data-material-key",
}
interface CellWordingMailconfirmMaterialTitle {
  [MAIL_CONFIRM_COURSE_KEY.Mailmaterial]: string 
}

export const CELL_WORDING_MAIL_CONFIRM_MailMaterialItem: CellWordingMailconfirmMaterialItem  = {
  [MAIL_CONFIRM_COURSE_KEY.CourseId]: "Course-ID",
  [MAIL_CONFIRM_COURSE_KEY.CourseName]: "Course-NAME",
  [MAIL_CONFIRM_COURSE_KEY.Teacher]: "Teacher",
  [MAIL_CONFIRM_COURSE_KEY.Students]: "Students",
  [MAIL_CONFIRM_COURSE_KEY.Number]: "Number",
  [MAIL_CONFIRM_COURSE_KEY.Term]: "Term",
  [MAIL_CONFIRM_COURSE_KEY.CoursePrice]: "CoursePrice",
  [MAIL_CONFIRM_COURSE_KEY.PaymentRequestDay]: "PaymentRequestDay",
}
interface CellWordingMailconfirmMaterialItem {
  [MAIL_CONFIRM_COURSE_KEY.CourseId]: string,
  [MAIL_CONFIRM_COURSE_KEY.CourseName]: string,
  [MAIL_CONFIRM_COURSE_KEY.Teacher]: string,
  [MAIL_CONFIRM_COURSE_KEY.Students]: string,
  [MAIL_CONFIRM_COURSE_KEY.Number]: string,
  [MAIL_CONFIRM_COURSE_KEY.Term]: string,
  [MAIL_CONFIRM_COURSE_KEY.CoursePrice]: string,
  [MAIL_CONFIRM_COURSE_KEY.PaymentRequestDay]: string,
}

export interface MailConfirmCourseMaterialIndex {
  [MAIL_CONFIRM_COURSE_KEY.CourseId]: number,
  [MAIL_CONFIRM_COURSE_KEY.CourseName]: number,
  [MAIL_CONFIRM_COURSE_KEY.Teacher]: number,
  [MAIL_CONFIRM_COURSE_KEY.Students]: number,
  [MAIL_CONFIRM_COURSE_KEY.Number]: number,
  [MAIL_CONFIRM_COURSE_KEY.Term]: number,
  [MAIL_CONFIRM_COURSE_KEY.CoursePrice]: number,
  [MAIL_CONFIRM_COURSE_KEY.PaymentRequestDay]: number,
}

export const CELL_WORDING_MAIL_CONFIRM_MailData: {[key: string]: string}   = {
  [MAIL_CONFIRM_COURSE_KEY.MailmDataTo]: "To",
  [MAIL_CONFIRM_COURSE_KEY.MailmDataCc]: "Cc",
  [MAIL_CONFIRM_COURSE_KEY.MailmDataTitle]: "title",
  [MAIL_CONFIRM_COURSE_KEY.MailmDataContent]: "content",
}

export interface MailConfirmCourseMailIndex {
  [MAIL_CONFIRM_COURSE_KEY.MailmDataTo]: number,
  [MAIL_CONFIRM_COURSE_KEY.MailmDataCc]: number,
  [MAIL_CONFIRM_COURSE_KEY.MailmDataTitle]: number,
  [MAIL_CONFIRM_COURSE_KEY.MailmDataContent]: number,
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

    const mailCourseId = this.getMailCourseId();
    if(!mailCourseId){
      Logger.log("no mail course id found");
      Browser.msgBox("no mail course id found");
      return;
    }
    const course_data: CourseData | null = this.course_list.getCourseDataFromCourseId(mailCourseId);
    if(!course_data){
      Logger.log("course data not found");
      return;
    }
    const result = this.writeCourseData(course_data);
    if(!result){
      Logger.log("writeCourseData failed");
      return; 
    }
  }
  
  private writeCourseData(course_data: CourseData): boolean{


    const material_key_column = 4;

    Logger.log('----------- writeCourseData ----------');

    const materkal_key_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: material_key_column}, CELL_WORDING_MAIL_CONFIRM_MailMaterialTitle.Mailmaterial );

    if(materkal_key_num === -1){
      Browser.msgBox(`${CELL_WORDING_MAIL_CONFIRM_MailMaterialTitle.Mailmaterial}　は　参照するセルが間違っています。${material_key_column}列目にはありません`);
      return false;
    }


    const mailmaterial_index = 
      this.spread_sheet.getVerticalIndex(
          this.attendance_confirmation_sheet, 
          {row: 1, column: material_key_column}, 
          CELL_WORDING_MAIL_CONFIRM_MailMaterialItem );
    if(!mailmaterial_index){
      Browser.msgBox(`index not found for mail material`);
      return false;
    }



    // Logger.log('-------- course_data ------------');
    // Logger.log(course_data);

// write 

    for(let key in mailmaterial_index){
        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key] +1, material_key_column + 1)
        .setValue( course_data[key] || '');
    }

    return true;

    // this.attendance_confirmation_sheet
    //   .getRange(mailmaterial_index.CourseId +1, material_key_column + 1)
    //   .setValue( course_data.CourseId || '');

  }


  public getMailCourseId(): string | null {

    Logger.log('---- getMailCourseId -----');
    const mailcourse_id_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: 1}, CELL_WORDING_MAIL_CONFIRM_ID.MailCourseId );

    if(mailcourse_id_row_num === -1){
      Browser.msgBox(`mail course id ${CELL_WORDING_MAIL_CONFIRM_ID.MailCourseId} not exist`);
      return null;
    }else{
      Logger.log(`mailcourse_id_row_num:  ${mailcourse_id_row_num}`);  
    }

    const mailCourseId = this.attendance_confirmation_sheet.getRange(mailcourse_id_row_num +1 , 2).getValue();
    if(!mailCourseId){
      Browser.msgBox(`mailCourseId not exist`);
      return null;
    }

    Logger.log(`---- mailCourseId:  ${mailCourseId}`);
    return String(mailCourseId);
  }

  checkActiveSheet(){
    return true;
  }
}
