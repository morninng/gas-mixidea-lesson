import { SpreadSheetNamespace } from './SpreadSheet';
import { ListLessonInCourseNameSpace } from './ListLessonInCourse';
import { ListCourseNameSpace } from './ListCourse';
import { UserNameSpace } from './User';

export namespace AttendanceConfirmLessonInCourseNameSpace {


export enum MAIL_CONFIRM_LESSON_IN_COURSE_KEY {
  MailLessonInCourseId = 'MailLessonInCourseId',
  Mailmaterial = 'Mailmaterial',

  LessonInCourseId = 'LessonInCourseId',
  CourseName = 'CourseName',
  EachLessonSuffix = 'EachLessonSuffix',
  Teacher = 'Teacher',
  RegularStudents = 'RegularStudents',
  Absent = 'Absent',
  AdditionalPaidStudents = 'AdditionalPaidStudents',
  AdditionalFreeStudents = 'AdditionalFreeStudents',
  MakeUpParticipants = 'MakeUpParticipants',
  Mentor = 'Mentor',
  PaymentRequestDay = 'PaymentRequestDay',
  Date = 'Date',
  Price = 'Price',

  LessonStatus = 'LessonStatus',
  To = 'To',
  Title = 'Title',
  Content = 'Content',
}

export const CELL_WORDING_MAIL_CONFIRM_ID = {
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.MailLessonInCourseId]: "MailLessonInCourseId",
}

export const CELL_WORDING_MAIL_CONFIRM_EMAIL = {
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.To]: "To",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Title]: "Title",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Content]: "Content",
}


export const CELL_WORDING_MAIL_CONFIRM_MailMaterialTitle = {
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Mailmaterial]: "Mailmaterial",
}

export const CELL_WORDING_MAIL_CONFIRM_MailMaterialItem = {
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.LessonInCourseId]: "LessonInCourseId",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.CourseName]: "CourseName",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.EachLessonSuffix]: "EachLessonSuffix",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Teacher]: "Teacher",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.RegularStudents]: "RegularStudents",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Absent]: "Absent",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.AdditionalPaidStudents]: "AdditionalPaidStudents",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.AdditionalFreeStudents]: "AdditionalFreeStudents",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.MakeUpParticipants]: "MakeUpParticipants",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Mentor]: "Mentor",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.PaymentRequestDay]: "PaymentRequestDay",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Date]: "Date",
  [MAIL_CONFIRM_LESSON_IN_COURSE_KEY.Price]: "Price",
}


const EMAIL_COLUMN_NUM = 2


export class AttendanceConfirmLessonInCourse {

  attendance_confirmation_sheet: GoogleAppsScript.Spreadsheet.Sheet;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;
  user: UserNameSpace.User

  constructor(
    private list_lesson_in_course : ListLessonInCourseNameSpace.ListLessonInCourse,
    private list_course : ListCourseNameSpace.ListCourse,
  ){
    this.user = UserNameSpace.User.instance;
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    Logger.log(`SHEET_NAME.ATTENDANCE_CONFIRM_LESSON_IN_COURSE ${SpreadSheetNamespace.SHEET_NAME.ATTENDANCE_CONFIRM_LESSON_IN_COURSE}`);
    this.attendance_confirmation_sheet = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.ATTENDANCE_CONFIRM_LESSON_IN_COURSE);
  }

  public updateLessonInCourseData() {

    const validate = this.checkActiveSheet();
    if(!validate){
      Browser.msgBox("別のシートを参照中です。");
      return;
    }

    const mailLessonInCourseId = this.getMailLessonInCourseId();
    if(!mailLessonInCourseId){
      Logger.log("no mailLessonInCourseId found");
      Browser.msgBox("no mailLessonInCourseId found");
      return;
    }else{
      Logger.log(`mailLessonInCourseId = ${mailLessonInCourseId}`);  
    }
    const lesson_in_course_data: ListLessonInCourseNameSpace.LessonInCourseData | null = this.list_lesson_in_course.getLessonInCourseDataFromId(mailLessonInCourseId);
    if(!lesson_in_course_data){
      Logger.log("lesson_in_course_data not found");
      return;
    }else{
      Logger.log("lesson_in_course_data");
      Logger.log(lesson_in_course_data);
    }

    const regular_students = this.list_course.getRegularStudents(lesson_in_course_data.CourseId);
    Logger.log('-----------regular_students----------');
    Logger.log(regular_students);

    const result = this.writeLessonInCourseData(lesson_in_course_data, regular_students);
    if(!result){
      Logger.log("writeLessonInCourseData failed");
      return; 
    }

    const email_arr = this.getEmailAddress(lesson_in_course_data);
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
    Logger.log(objArgs);

    GmailApp.createDraft( String(email_to), String(email_title), String(email_content), objArgs );

  }

  
  private writeLessonInCourseData(lesson_in_course_data: ListLessonInCourseNameSpace.LessonInCourseData, regular_students: string[]): boolean{


    const material_key_column = 4;

    Logger.log('----------- writeLessonInCourseData ----------');

    const material_key_num 
      = this.spread_sheet.getVerticalRowNum(
          this.attendance_confirmation_sheet, 
          {row: 1, column: material_key_column}, 
          CELL_WORDING_MAIL_CONFIRM_MailMaterialTitle.Mailmaterial );

    if(material_key_num === -1){
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

    const multiple_items_key: string[] = this.list_lesson_in_course.getMultipleItemKey();

    for(let key in mailmaterial_index){
      Logger.log(`key ${key}`);
      if( multiple_items_key.indexOf(key) !== -1){
        Logger.log(lesson_in_course_data[key] );
        const name_arr: string[] = (lesson_in_course_data[key] || []).join(' , ')
        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key], material_key_column + 1)
        .setValue( name_arr );

      }else if(key === CELL_WORDING_MAIL_CONFIRM_MailMaterialItem.RegularStudents){

        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key], material_key_column + 1)
        .setValue( regular_students.join(' , ') );
      
    }else{
        this.attendance_confirmation_sheet
        .getRange(mailmaterial_index[key], material_key_column + 1)
        .setValue( lesson_in_course_data[key] || '');
      }
    }
    return true;
  }

  getEmailAddress(lesson_in_course_data: ListLessonInCourseNameSpace.LessonInCourseData ): string[]{

    const teacher = lesson_in_course_data.Teacher;
    const absent_arr = lesson_in_course_data.Absent || [];
    const paid_students_arr = lesson_in_course_data.AdditionalPaidStudents || [];
    const free_students_arr = lesson_in_course_data.AdditionalFreeStudents || [];
    const makeup_participants_arr = lesson_in_course_data.MakeUpParticipants || [];
    const mentor_arr = lesson_in_course_data.Mentor || [];

    const teacher_email = this.user.getMail(teacher || '');
    const absent_email_arr = this.user.getMailList(absent_arr) || [];
    const paid_students_email_arr = this.user.getMailList(paid_students_arr) || [];
    const free_students_email_arr = this.user.getMailList(free_students_arr) || [];
    const makeup_participants_email_arr = this.user.getMailList(makeup_participants_arr) || [];
    const mentor_email_arr = this.user.getMailList(mentor_arr) || [];

    return [ ...teacher_email, ...absent_email_arr, ...paid_students_email_arr, ...free_students_email_arr, ...makeup_participants_email_arr,  ...mentor_email_arr ];

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


  public getMailLessonInCourseId(): string | null {

    Logger.log('---- getMailLessonInCourseId -----');
    Logger.log(`this.spread_sheet ${this.spread_sheet}`)
    const mail_lesson_in_course_id_row_num = this.spread_sheet.getVerticalRowNum(this.attendance_confirmation_sheet, {row: 1, column: 1}, CELL_WORDING_MAIL_CONFIRM_ID.MailLessonInCourseId );

    if(mail_lesson_in_course_id_row_num === -1){
      Browser.msgBox(`mail_lesson_in_course_id_row_num ${CELL_WORDING_MAIL_CONFIRM_ID.MailLessonInCourseId} not exist`);
      return null;
    }else{
      Logger.log(`mail_lesson_in_course_id_row_num:  ${mail_lesson_in_course_id_row_num}`);  
    }

    const mailLessonInCourseId = this.attendance_confirmation_sheet.getRange(mail_lesson_in_course_id_row_num , 2).getValue();
    if(!mailLessonInCourseId){
      Browser.msgBox(`mailLessonInCourseId not exist`);
      return null;
    }else if(isNaN( Number(mailLessonInCourseId))){
      Browser.msgBox(`mailLessonInCourseId is  not a number`);
      return null;
    }

    Logger.log(`---- mailLessonInCourseId:  ${mailLessonInCourseId}`);
    return String(mailLessonInCourseId);
  }

  checkActiveSheet(){
    return true;
  }
}

}