import { SpreadSheet, SHEET_NAME } from './SpreadSheet';
import { CourseList } from './ListCourse';
import { CourseData } from './ListCourse';
import { User } from './User';

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
  To = 'To',
  Title = 'Title',
  Content = 'Content',
}

export const CELL_WORDING_MAIL_CONFIRM_ID: CellWordingMailconfirmId   = {
  [MAIL_CONFIRM_COURSE_KEY.MailCourseId]: "Mail-Course-ID",
}
interface CellWordingMailconfirmId {
  [MAIL_CONFIRM_COURSE_KEY.MailCourseId]: string 
}

export const CELL_WORDING_MAIL_CONFIRM_EMAIL: CellWordingMailconfirmEmail   = {
  [MAIL_CONFIRM_COURSE_KEY.To]: "To",
  [MAIL_CONFIRM_COURSE_KEY.Title]: "Title",
  [MAIL_CONFIRM_COURSE_KEY.Content]: "Content",
}
interface CellWordingMailconfirmEmail {
  [MAIL_CONFIRM_COURSE_KEY.To]: string;
  [MAIL_CONFIRM_COURSE_KEY.Title]: string;
  [MAIL_CONFIRM_COURSE_KEY.Content]: string;
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

const EMAIL_COLUMN_NUM = 2


export class AttendanceConfirmCourse {

  attendance_confirmation_sheet: GoogleAppsScript.Spreadsheet.Sheet;
  spread_sheet: SpreadSheet;
  user: User

  constructor(
    private course_list : CourseList,
  ){
    this.user = User.instance;
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

    const email_arr = this.getEmailAddress(course_data);
    Logger.log(email_arr);
    this.setEmailAddress(email_arr);
  }

  sendMail(){
    Logger.log('--------sendMail-----');

    const to_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: EMAIL_COLUMN_NUM}, CELL_WORDING_MAIL_CONFIRM_EMAIL.To );
    if(to_row_num === -1){
      Browser.msgBox(`to_row_num not exist`);
      return null;
    }else{
      Logger.log(`to_row_num:  ${to_row_num}`); 
    }
    const email_to = this.attendance_confirmation_sheet
    .getRange( to_row_num, EMAIL_COLUMN_NUM + 1)
    .getValue();
    Logger.log(`email_to:  : ${email_to}`)


    const title_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: EMAIL_COLUMN_NUM}, CELL_WORDING_MAIL_CONFIRM_EMAIL.Title );
    if(title_row_num === -1){
      Browser.msgBox(`title_row_num not exist`);
      return null;
    }else{
      Logger.log(`title_row_num:  ${to_row_num}`);  
    }
    const email_title = this.attendance_confirmation_sheet
    .getRange( title_row_num, EMAIL_COLUMN_NUM + 1)
    .getValue();
    Logger.log(`email_title:  : ${email_title}`)


    const content_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: EMAIL_COLUMN_NUM}, CELL_WORDING_MAIL_CONFIRM_EMAIL.Content );
    if(content_row_num === -1){
      Browser.msgBox(`content_row_num not exist`);
      return null;
    }else{
      Logger.log(`content_row_num:  ${content_row_num}`);  
    }
    const email_content = this.attendance_confirmation_sheet
    .getRange( content_row_num, EMAIL_COLUMN_NUM + 1)
    .getValue();
    Logger.log(`content_row_num ${email_content}`);

    MailApp.sendEmail( String(email_to), String(email_title), String(email_content) );

  }

  
  private writeCourseData(course_data: CourseData): boolean{


    const material_key_column = 4;

    Logger.log('----------- writeCourseData ----------');

    const materkal_key_num 
      = this.spread_sheet.getVerticalRowNum(
          this.attendance_confirmation_sheet, 
          {row: 1, column: material_key_column}, 
          CELL_WORDING_MAIL_CONFIRM_MailMaterialTitle.Mailmaterial );

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

// write 

    for(let key in mailmaterial_index){
      if(key === this.course_list.getStudentsKey()){

        const students = course_data[key].join(' , ')
        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key], material_key_column + 1)
        .setValue( students );
      }else{
        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key], material_key_column + 1)
        .setValue( course_data[key] || '');
      }
    }
    return true;
  }

  getEmailAddress(course_data: CourseData ): string[]{

    const teacher = course_data.Teacher;
    const students_arr = course_data.Students || [];

    const teacher_email = this.user.getMail(teacher || '');
    const students_email_arr = this.user.getMailList(students_arr) || [];
    
    return [ ...students_email_arr, ...teacher_email ]

  }

  setEmailAddress(email_arr: string[]){


    Logger.log('---- setEmailAddress -----');
    const to_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: EMAIL_COLUMN_NUM}, CELL_WORDING_MAIL_CONFIRM_EMAIL.To );

    if(to_row_num === -1){
      Browser.msgBox(`to_row_num not exist`);
      return null;
    }else{
      Logger.log(`to_row_num:  ${to_row_num}`);  
    }

    this.attendance_confirmation_sheet
    .getRange( to_row_num, EMAIL_COLUMN_NUM + 1)
    .setValue( email_arr.join(" , ") );
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

    const mailCourseId = this.attendance_confirmation_sheet.getRange(mailcourse_id_row_num , 2).getValue();
    if(!mailCourseId){
      Browser.msgBox(`mailCourseId not exist`);
      return null;
    }else if(isNaN( Number(mailCourseId))){
      Browser.msgBox(`mailCourseId is  not a number`);
      return null;
    }

    Logger.log(`---- mailCourseId:  ${mailCourseId}`);
    return String(mailCourseId);
  }

  checkActiveSheet(){
    return true;
  }
}
