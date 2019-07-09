import { SpreadSheetNamespace } from './SpreadSheet';
import { ListSingleLessonNameSpace } from './ListSingleLesson';
import { ListLessonInCourseNameSpace } from './ListLessonInCourse';
import { ListCourseNameSpace } from './ListCourse';
import { UserNameSpace } from './User';
import { InvoiceData } from '../model/invoice';

export namespace InvoiceNameSpace {


const INVOICE_FOLDER_ID = "1LT9GvV_DkmndaJWiv-58QhA0uAMHo23b";

interface PriceSummary{
  total: number,
  tax: number,
  total_with_tax: number,
}

const PDF_FORMAT_INVOICEDATA_INITIAL_ROW = 4;

const PDF_FORMAT_PRICE_COLUMN = 7;
const PDF_FORMAT_USERNAME_ROW = 1;
const PDF_FORMAT_USERNAME_COLUMN = 6;
const PDF_FORMAT_PRICE_TOTAL_ROW = 32;
const PDF_FORMAT_PRICE_TOTAL_COLUMN = 7;
const PDF_FORMAT_TAX_ROW = 34;
const PDF_FORMAT_TAX_COLUMN = 7;
const PDF_FORMAT_PRICE_TOTAL_WITH_TAX_ROW = 35;
const PDF_FORMAT_PRICE_TOTAL_WITH_TAX_COLUMN = 7;
const PDF_FORMAT_WIDTH = 8;
const PDF_FORMAT_HEIGHT = 36;






export class Invoice {

  sheet_invoice_data: GoogleAppsScript.Spreadsheet.Sheet;
  sheet_pdf_format: GoogleAppsScript.Spreadsheet.Sheet;
  sheet_pdf_format_id: number;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;
  sheet_invoice_ss_fileid_mapping: GoogleAppsScript.Spreadsheet.Sheet;
  sheet_invoice_mail: GoogleAppsScript.Spreadsheet.Sheet;
  user: UserNameSpace.User;

  constructor(
    private list_course : ListCourseNameSpace.ListCourse,
    private list_single_lesson : ListSingleLessonNameSpace.ListSingleLesson,
    private list_lesson_in_course : ListLessonInCourseNameSpace.ListLessonInCourse,
  ){
    this.user = UserNameSpace.User.instance;
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    Logger.log(`SHEET_NAME.ATTENDANCE_CONFIRM_SINGLE_LESSON ${SpreadSheetNamespace.SHEET_NAME.ATTENDANCE_CONFIRM_SINGLE_LESSON}`);
    this.sheet_invoice_data = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.INVOICE_DATA);
    this.sheet_pdf_format = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.INVOICE_PDF_FORMAT);
    this.sheet_pdf_format_id = this.sheet_pdf_format.getSheetId();
    this.sheet_invoice_ss_fileid_mapping = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.INVOICE_SS_FILEID);
    this.sheet_invoice_mail = this.spread_sheet.getSheet(SpreadSheetNamespace.SHEET_NAME.INVOICE_MAIL);

  }

  collectAndLocateData(){

    this.clearSummary()

    const request_day = String(this.getPaymentRequestDay());
    const user_invoice_data_collection: {[key: string]: InvoiceData[]} = this.getAllData(request_day);

    this.createSsForPDF(request_day, user_invoice_data_collection)
    this.createSummary(user_invoice_data_collection)

  }

  private clearSummary(){
    // clear all
    this.sheet_invoice_data.getRange(2, 2,1000, 6 ).clear();
  }

  private createSummary(user_invoice_data_collection:  {[key: string]: InvoiceData[]}){

    // write new
    const invoice_summary_cell: string[][] = []
    for(const user in user_invoice_data_collection){

      invoice_summary_cell.push([
        user,"","","","",""
      ])
      const user_invoice_data: InvoiceData[] = user_invoice_data_collection[user];

      user_invoice_data.forEach((invoice_data: InvoiceData)=>{
        invoice_summary_cell.push([
          "",
          invoice_data.teacher,
          invoice_data.term,
          invoice_data.name,
          String(invoice_data.price),"",
        ])
      })
      const price_summary: PriceSummary = this.calculatePrice(user_invoice_data);
      invoice_summary_cell.push([
        "","","","","",String(price_summary.total)
      ])
    }
    Logger.log("------------invoice_summary_cell---------------")
    Logger.log(invoice_summary_cell)
    if(invoice_summary_cell.length > 0){
      this.sheet_invoice_data.getRange(2, 2, invoice_summary_cell.length, 6 ).setValues(invoice_summary_cell);
    }
  }

  

  private createSsForPDF(request_day: string, user_invoice_data_collection:  {[key: string]: InvoiceData[]}){

    this.clearFileIdUserMapping()

    const default_pdf_format_data: string[][]= this.getPdfFormat();
    Logger.log(`--------default_pdf_format_data ------------`);
    Logger.log(default_pdf_format_data);

    const ssfilID_user_mapping: string[][] = []

    for(const user in user_invoice_data_collection){
      const ss_file_id = this.prepareSpreadSheetForPDF(request_day, user, user_invoice_data_collection[user], default_pdf_format_data);
      const file_id_with_user = [user, ss_file_id];
      ssfilID_user_mapping.push(file_id_with_user);
    }
    Logger.log('-----ssfilID_user_mapping ------')
    Logger.log(ssfilID_user_mapping);

    this.writeFileIdUserMapping(ssfilID_user_mapping)
  }

  private getPdfFormat(){

    return this.sheet_pdf_format
    .getRange(1, 1, 36, 8)
    .getValues()
    .map(element=>{
      return element.map(value =>{
        return String(value);
      })
    });

  }


  private prepareSpreadSheetForPDF(request_day: string, user: string, user_invoice_data: InvoiceData[], default_pdf_format_data: string[][]): string{

    const file_name = `${request_day} - ${user}`;

    const ssNew = this.spread_sheet.createSpreadsheetInfolder(INVOICE_FOLDER_ID, file_name);

    const ssNewID = ssNew.getId();//IDをゲット
    Logger.log(`ssNewID ${ssNewID}`);
    const ssNewFile = SpreadsheetApp.openById(ssNewID);//オープン
    const activeSpreadsheet = SpreadsheetApp.setActiveSpreadsheet(ssNewFile);//アクティブシートに設定，操作が有効なシート
    const masterSheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];//アクティブシートをゲットする

// set default data
    masterSheet.getRange(1,1, PDF_FORMAT_HEIGHT, PDF_FORMAT_WIDTH ).setValues(default_pdf_format_data)    
// customize for user

    this.writeUserIndivicualDataToUserSS(masterSheet, user_invoice_data, user)
    this.decorateUserSS( masterSheet )

    return ssNewID;
  }

  private writeUserIndivicualDataToUserSS( user_spreadsheet: GoogleAppsScript.Spreadsheet.Sheet, user_invoice_data: InvoiceData[], user: string ){
    

    const price_summary: PriceSummary = this.calculatePrice(user_invoice_data);
    let row = PDF_FORMAT_INVOICEDATA_INITIAL_ROW

    user_invoice_data.forEach((invoice_data: InvoiceData) => {
      // teacher
      user_spreadsheet
      .getRange(row, 1)
      .setValue( invoice_data.teacher );
      // name
      user_spreadsheet
      .getRange(row, 2)
        .setValue( invoice_data.name );
      // price
      user_spreadsheet
      .getRange(row, PDF_FORMAT_PRICE_COLUMN)
      .setValue( invoice_data.price );
      row++;
    })

    // user
    user_spreadsheet
    .getRange(PDF_FORMAT_USERNAME_ROW, PDF_FORMAT_USERNAME_COLUMN)
    .setValue( user );
    // total
    user_spreadsheet
    .getRange(PDF_FORMAT_PRICE_TOTAL_ROW, PDF_FORMAT_PRICE_TOTAL_COLUMN)
    .setValue( price_summary.total );
    // tax
    user_spreadsheet
    .getRange(PDF_FORMAT_TAX_ROW, PDF_FORMAT_TAX_COLUMN)
    .setValue( price_summary.tax );
    // total with tax
    user_spreadsheet
    .getRange(PDF_FORMAT_PRICE_TOTAL_WITH_TAX_ROW, PDF_FORMAT_PRICE_TOTAL_WITH_TAX_COLUMN)
    .setValue( price_summary.total_with_tax );
  }

  // developDecoration(){
  //   const ssNewFile = SpreadsheetApp.openById('1WpzfqO1jqBXUSBi9pXmtfDvalrM-89VBwb03dEQ_KRE');//オープン
  //   const activeSpreadsheet = SpreadsheetApp.setActiveSpreadsheet(ssNewFile);//アクティブシートに設定，操作が有効なシート
  //   const masterSheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];//アクティブシートをゲットする
  //   this.decorateUserSS(masterSheet);
  // }



  private decorateUserSS(user_spreadsheet: GoogleAppsScript.Spreadsheet.Sheet){

    const font_size_big = 18;
    const font_size_middle = 14;
    const font_main_color = "#000080";
    const base_cell_color = "#00FFFF";

    // title
    const title_range = user_spreadsheet.getRange("A1")
    title_range.setFontSize(font_size_big);
    title_range.setFontColor(font_main_color);
    // second title
    const secondtitle_range = user_spreadsheet.getRange("A2:G2")
    secondtitle_range.setFontSize(font_size_middle);
    secondtitle_range.setBackground(base_cell_color);
    // menu title
    const menu_range = user_spreadsheet.getRange("A3:G3")
    menu_range.setFontWeight("bold");

    // subtotal, tax rate tax total amount title
    const total_payment_title_range = user_spreadsheet.getRange("F32:F35");
    total_payment_title_range.setBackground(base_cell_color);

    // subtotal, tax rate tax total amount value
    const total_payment_value_range = user_spreadsheet.getRange("G32:G35");
    total_payment_value_range.setFontWeight("bold");

    // total amount value
    const final_payment_value_range = user_spreadsheet.getRange("G35");
    final_payment_value_range.setFontSize(font_size_big);

    // payment target
    const payment_target_range = user_spreadsheet.getRange("A32");
    payment_target_range.setFontWeight("bold");

  }


  private clearFileIdUserMapping(){
    this.sheet_invoice_ss_fileid_mapping.getRange(1, 1, 1000, 2).clear();
  }

  private writeFileIdUserMapping(ssfilID_user_mapping: string[][]){

    if(ssfilID_user_mapping.length > 0){
      this.sheet_invoice_ss_fileid_mapping.getRange(1, 1, ssfilID_user_mapping.length, 2).setValues(ssfilID_user_mapping);
    }
  }
  private getFileIdUserMapping(): string[][]{
    return this.sheet_invoice_ss_fileid_mapping.getRange(1, 1, 500,  2).getValues()
      .filter((element)=>{ return !!element[0]})
      .map((element)=>{ return [String(element[0]), String(element[1])] });
  }

/**************************** */

  createEmailDrat(){

    Logger.log("----createEmailDrat------");

    const request_day = String(this.getPaymentRequestDay());
    const user_invoice_data_collection: {[key: string]: InvoiceData[]} = this.getAllData(request_day);

    const ssfilID_user_mapping: string[][] = this.getFileIdUserMapping();
    const ssfilID_user_obj = {};
    ssfilID_user_mapping.forEach((element: string[])=>{
      ssfilID_user_obj[element[0]] = element[1];
    })

    const email_material: string[] = this.sheet_invoice_mail.getRange(2,2,3,1)
                                      .getValues()
                                      .map((element)=>{ return String([element[0]])});

    for(const user in user_invoice_data_collection){
      const file_id = ssfilID_user_obj[user];
      if(!file_id){
        Logger.log(`${user} not found in ssfilID_user_obj`);
        Browser.msgBox(`${user} not found in ssfilID_user_obj`);  
        return;
      }
      const email_arr = this.user.getMail(user);
      const invoice_data = user_invoice_data_collection[user];
      this.createEmailForEachUser(file_id, user,request_day, email_arr,  email_material, invoice_data)
    }
  }


  private createEmailForEachUser(fileId: string, user, request_day, email_arr, email_material: string[], invoice_data: InvoiceData[]){

    const email_material_initial = email_material[0];
    Logger.log(`email_material_initial ${email_material_initial}`);
    const email_material_second = email_material[1];
    Logger.log(`email_material_second ${email_material_second}`);
    const email_material_footer = email_material[2];
    Logger.log(`email_material_footer ${email_material_footer}`);
    const summary_price = this.calculatePrice(invoice_data);

    let invoice_str = "";
    invoice_data.forEach((invoice: InvoiceData)=>{
      invoice_str = invoice_str + `  講師：${invoice.teacher} - 講座名${invoice.name}  - 期間：${invoice.term} - 金額${invoice.price}円 \n`;
    })

    const mail_content = `${user} ${email_material_initial} ${invoice_str} ${email_material_second} ${summary_price.total_with_tax} ${email_material_footer}`

    const myFile = DriveApp.getFileById(fileId);
    const pdf = myFile.getAs("application/pdf").setName(`mixidea請求書_${request_day}_${user}.pdf`);

    const objArgs = { attachments:pdf, cc: "mixidea.online.discuss@gmail.com" };
    GmailApp.createDraft( email_arr.join(' , '), `mixidea請求書_${request_day}_${user}`, mail_content,  objArgs );

  }

  private calculatePrice( invoice_data_arr: InvoiceData[]): PriceSummary{
    let price_sum = 0;

    invoice_data_arr.forEach( (element: InvoiceData) => {
      price_sum = price_sum + element.price;
    })

    const price_with_tax = Math.round(price_sum * 1.08);

    return {total:price_sum, tax:price_with_tax - price_sum,  total_with_tax: price_with_tax  };
  }


  getAllDataTest(){

    const request_day = String(this.getPaymentRequestDay());
    this.getAllData(request_day);
  }

  getAllData(request_day: string){
    const course_data: InvoiceData[] = this.list_course.getCourseDataWithPaymentRequestDay(request_day);
    const single_lesson_data: InvoiceData[] = this.list_single_lesson.getSingleLessonDataWithPaymentRequestDay(request_day);
    const lesson_in_course: InvoiceData[] = this.list_lesson_in_course.getLessonInCourseDataWithPaymentRequestDay(request_day);

    const sum_data: InvoiceData[] =[ ...single_lesson_data, ...course_data, ...lesson_in_course];

    const users: {[key: string]: string[]} = this.user.getUserData() || {};

    const user_invoice_data: {[key: string]: InvoiceData[]}  = {}
    for(const key in users){
      sum_data.forEach((element: InvoiceData)=>{

        if(element.paidUsers && element.paidUsers.indexOf(key) !== -1){

          if(!user_invoice_data[key]){
            user_invoice_data[key] = []
          }
          user_invoice_data[key].push({
            price: element.price,
            name: element.name,
            teacher: element.teacher,
            term: element.term
          });
        }
      })
    }
    Logger.log('----------user_invoice_data --------')
    Logger.log(user_invoice_data);

    return user_invoice_data;
  }


  private getPaymentRequestDay(){
    const range = this.sheet_invoice_data.getRange(1, 2);
    const value = range.getValue();
    Logger.log(` ----- getPaymentRequestDay ${value} -----`);
    return value;
  }


}

}