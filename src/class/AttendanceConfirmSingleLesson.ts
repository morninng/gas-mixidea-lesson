import { SpreadSheetNamespace } from './SpreadSheet';
import { ListSingleLessonNameSpace } from './ListSingleLesson';
import { UserNameSpace } from './User';

export namespace AttendanceConfirmSingleLessonNameSpace {


export enum MAIL_CONFIRM_SINGLE_LESSON_KEY {
  MailSingleLessonId = 'MailSingleLessonId',
  Mailmaterial = 'Mailmaterial',

  SingleLessonId = 'SingleLessonId',
  SingleLessonName = 'SingleLessonName',
  Teacher = 'Teacher',
  Date = 'Date',
  Price = 'Price',
  PaidStudents = 'PaidStudents',
  FreeStudents = 'FreeStudents',
  Mentor = 'Mentor',
  PaymentRequestDay = 'PaymentRequestDay',

  LessonStatus = 'LessonStatus',
  To = 'To',
  Title = 'Title',
  Content = 'Content',
}

export const CELL_WORDING_MAIL_CONFIRM_ID = {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.MailSingleLessonId]: "Mail-SingleLesson-ID",
}
interface CellWordingMailconfirmId {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.MailSingleLessonId]: string 
}

export const CELL_WORDING_MAIL_CONFIRM_EMAIL: CellWordingMailconfirmEmail   = {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.To]: "To",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Title]: "Title",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Content]: "Content",
}
interface CellWordingMailconfirmEmail {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.To]: string;
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Title]: string;
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Content]: string;
}

export const CELL_WORDING_MAIL_CONFIRM_MailMaterialTitle: CellWordingMailconfirmMaterialTitle   = {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Mailmaterial]: "mail-data-material-key",
}
interface CellWordingMailconfirmMaterialTitle {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Mailmaterial]: string 
}

export const CELL_WORDING_MAIL_CONFIRM_MailMaterialItem: CellWordingMailconfirmMaterialItem  = {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.SingleLessonId]: "SingleLessonId",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.SingleLessonName]: "SingleLessonName",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Teacher]: "Teacher",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Date]: "Date",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Price]: "Price",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.PaidStudents]: "PaidStudents",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.FreeStudents]: "FreeStudents",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Mentor]: "Mentor",
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.PaymentRequestDay]: "PaymentRequestDay",
}
interface CellWordingMailconfirmMaterialItem {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.SingleLessonId]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.SingleLessonName]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Teacher]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Date]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Price]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.PaidStudents]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.FreeStudents]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Mentor]: string,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.PaymentRequestDay]: string,
}

export interface MailConfirmCourseMaterialIndex {
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.SingleLessonId]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.SingleLessonName]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Teacher]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Date]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Price]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.PaidStudents]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.FreeStudents]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.Mentor]: number,
  [MAIL_CONFIRM_SINGLE_LESSON_KEY.PaymentRequestDay]: number,
}

const EMAIL_COLUMN_NUM = 2


export class AttendanceConfirmSingleLesson {

  attendance_confirmation_sheet: GoogleAppsScript.Spreadsheet.Sheet;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;
  user: UserNameSpace.User

  constructor(
    private list_single_lesson : ListSingleLessonNameSpace.ListSingleLesson,
  ){
    this.user = UserNameSpace.User.instance;
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    Logger.log(`SHEET_NAME.ATTENDANCE_CONFIRM_SINGLE_LESSON ${SpreadSheetNamespace.SHEET_NAME.ATTENDANCE_CONFIRM_SINGLE_LESSON}`);
    this.attendance_confirmation_sheet = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.ATTENDANCE_CONFIRM_SINGLE_LESSON);

  }

  public updateSingleLessonData() {

    const validate = this.checkActiveSheet();
    if(!validate){
      Browser.msgBox("別のシートを参照中です。");
      return;
    }

    const mailSingleLessonId = this.getMailSingleLessonId();
    if(!mailSingleLessonId){
      Logger.log("no mailSingleLessonId found");
      Browser.msgBox("no mailSingleLessonId found");
      return;
    }else{
      Logger.log(`mailSingleLessonId = ${mailSingleLessonId}`);  
    }
    const single_lesson_data: ListSingleLessonNameSpace.SingleLessonData | null = this.list_single_lesson.getSingleLessonDataFromId(mailSingleLessonId);
    if(!single_lesson_data){
      Logger.log("single_lesson_data not found");
      return;
    }else{
      Logger.log(single_lesson_data);
    }
    const result = this.writeSingleLessonData(single_lesson_data);
    if(!result){
      Logger.log("writeSingleLessonData failed");
      return; 
    }

    const email_arr = this.getEmailAddress(single_lesson_data);
    Logger.log(email_arr);
    this.setEmailAddress(email_arr);
  }

  createMailDraft(){
    Logger.log('--------sendMail-----');

    const to_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: EMAIL_COLUMN_NUM}, CELL_WORDING_MAIL_CONFIRM_EMAIL.To );
    if(to_row_num === -1){
      Browser.msgBox(`to_row_num not exist`);
      return null;
    }else{
      Logger.log(`to_row_num:  ${to_row_num}`); 
    }
    const email_bcc = this.attendance_confirmation_sheet
    .getRange( to_row_num, EMAIL_COLUMN_NUM + 1)
    .getValue();
    Logger.log(`email_bcc:  : ${email_bcc}`)


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

    const objArgs = { bcc: email_bcc };
    const email_to = "mixidea.online.discuss@gmail.com";

    GmailApp.createDraft( String(email_to), String(email_title), String(email_content), objArgs );

  }

  
  private writeSingleLessonData(single_lesson_data: ListSingleLessonNameSpace.SingleLessonData): boolean{


    const material_key_column = 4;

    Logger.log('----------- writeSingleLessonData ----------');

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

    const multiple_items_key: string[] = this.list_single_lesson.getMultipleItemKey();

    for(let key in mailmaterial_index){
      Logger.log(`key ${key}`);
      if( multiple_items_key.indexOf(key) !== -1){
        Logger.log(single_lesson_data[key] );
        const name_arr: string[] = (single_lesson_data[key] || []).join(' , ')
        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key], material_key_column + 1)
        .setValue( name_arr );

      }else{
        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key], material_key_column + 1)
        .setValue( single_lesson_data[key] || '');
      }
    }
    return true;
  }

  getEmailAddress(single_lesson_data: ListSingleLessonNameSpace.SingleLessonData ): string[]{

    const teacher = single_lesson_data.Teacher;
    const paid_students_arr = single_lesson_data.PaidStudents || [];
    const free_students_arr = single_lesson_data.PaidStudents || [];
    const mentor_arr = single_lesson_data.Mentor || [];

    const teacher_email = this.user.getMail(teacher || '');
    const paid_students_email_arr = this.user.getMailList(paid_students_arr) || [];
    const free_students_email_arr = this.user.getMailList(free_students_arr) || [];
    const mentor_email_arr = this.user.getMailList(mentor_arr) || [];
    
    return [ ...paid_students_email_arr, ...free_students_email_arr, ...mentor_email_arr, ...teacher_email ]

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


  public getMailSingleLessonId(): string | null {

    Logger.log('---- getMailSingleLessonId -----');
    Logger.log(`this.spread_sheet ${this.spread_sheet}`)
    const mail_single_lesson_id_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: 1}, CELL_WORDING_MAIL_CONFIRM_ID.MailSingleLessonId );

    if(mail_single_lesson_id_row_num === -1){
      Browser.msgBox(`mail_single_lesson_id_row_num ${CELL_WORDING_MAIL_CONFIRM_ID.MailSingleLessonId} not exist`);
      return null;
    }else{
      Logger.log(`mail_single_lesson_id_row_num:  ${mail_single_lesson_id_row_num}`);  
    }

    const mailSingleLessonId = this.attendance_confirmation_sheet.getRange(mail_single_lesson_id_row_num , 2).getValue();
    if(!mailSingleLessonId){
      Browser.msgBox(`mailSingleLessonId not exist`);
      return null;
    }else if(isNaN( Number(mailSingleLessonId))){
      Browser.msgBox(`mailSingleLessonId is  not a number`);
      return null;
    }

    Logger.log(`---- mailSingleLessonId:  ${mailSingleLessonId}`);
    return String(mailSingleLessonId);
  }

  checkActiveSheet(){
    return true;
  }
}

}