
import { SpreadSheetNamespace } from './SpreadSheet';
import { ListSingleLessonNameSpace } from './ListSingleLesson';
import { ListLessonInCourseNameSpace } from './ListLessonInCourse';
import { ListCourseNameSpace } from './ListCourse';
import { UserNameSpace } from './User';
import { InvoiceData } from '../model/invoice';



export namespace TestNameSpace {

const INVOICE_FOLDER_ID = "1LT9GvV_DkmndaJWiv-58QhA0uAMHo23b";


interface PriceSummary{
  total: number,
  tax: number,
  total_with_tax: number,
}

const PDF_FORMAT_INITIAL_ROW = 4;
const PDF_FORMAT_PRICE_COLUMN = 7;
const PDF_FORMAT_NUMBER_ROW = 27;
const PDF_FORMAT_BLANK_DATA = [
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[]],
]


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


const INVOICE_SUMMARYDATA_INITIAL_ROW = 3;





class Test {

  sheet_invoice_data: GoogleAppsScript.Spreadsheet.Sheet;
  sheet_pdf_format: GoogleAppsScript.Spreadsheet.Sheet;
  sheet_pdf_format_id: number;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;
  sheet_invoice_ss_fileid_mapping: GoogleAppsScript.Spreadsheet.Sheet;
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
  }

  private getAllData(request_day: string){
    return {}
  }


  private getPaymentRequestDay(){
    return ""
  }



  createInvoiceAndEmailDraft(){

    const request_day = String(this.getPaymentRequestDay());

    const user_invoice_data_collection: {[key: string]: InvoiceData[]} = this.getAllData(request_day);
    for(const key in user_invoice_data_collection){

      this.createInvoiceAndEmailDraftOneUser(request_day, key, user_invoice_data_collection[key]);
      Utilities.sleep(10000);

    }
  }



// https://sites.google.com/site/appsmatome/home/fileman/pdfmaking
  // https://groups.google.com/forum/#!topic/google-apps-api-japan/h9Mcpq2RF50

  createInvoiceAndEmailDraftOneUser(request_day, user, invoice_data_arr: InvoiceData[]){

    Logger.log(`createInvoiceAndEmailDraftOneUser - ${user}`);

    const price_summary: PriceSummary = this.calculatePrice(invoice_data_arr);
    this.prepareSheetForPDF(invoice_data_arr, user, price_summary);
    const title = `mixidea請求書：${request_day} - ${user}`
    const pdf = this.spread_sheet.createPDF(this.sheet_pdf_format_id, title);
    const user_emails_arr = this.user.getMail(user);
    this.createEmailDraftTest(user_emails_arr, title, pdf);
  }

  private calculatePrice( invoice_data_arr: InvoiceData[]): PriceSummary{
    let price_sum = 0;

    invoice_data_arr.forEach( (element: InvoiceData) => {
      price_sum = price_sum + element.price;
    })

    const price_with_tax = Math.ceil(price_sum * 1.08);

    return {total:price_sum, tax:price_with_tax - price_sum,  total_with_tax: price_with_tax  };
  }





  prepareSheetForPDF(invoice_data_arr: InvoiceData[], user: string, price_summary: PriceSummary ){

    this.clearSheetForPDF()

    let row = PDF_FORMAT_INITIAL_ROW

    invoice_data_arr.forEach((invoice_data: InvoiceData) => {

      this.sheet_pdf_format
      .getRange(row, 1)
      .setValue( invoice_data.teacher );

      this.sheet_pdf_format
      .getRange(row, 2)
      .setValue( invoice_data.name );

      this.sheet_pdf_format
      .getRange(row, PDF_FORMAT_PRICE_COLUMN)
      .setValue( invoice_data.price );

      row++;
    })

    // user
    this.sheet_pdf_format
    .getRange(PDF_FORMAT_USERNAME_ROW, PDF_FORMAT_USERNAME_COLUMN)
    .setValue( user );

    // total
    this.sheet_pdf_format
    .getRange(PDF_FORMAT_PRICE_TOTAL_ROW, PDF_FORMAT_PRICE_TOTAL_COLUMN)
    .setValue( price_summary.total );

    // tax
    this.sheet_pdf_format
    .getRange(PDF_FORMAT_TAX_ROW, PDF_FORMAT_TAX_COLUMN)
    .setValue( price_summary.tax );

    // total with tax
    this.sheet_pdf_format
    .getRange(PDF_FORMAT_PRICE_TOTAL_WITH_TAX_ROW, PDF_FORMAT_PRICE_TOTAL_WITH_TAX_COLUMN)
    .setValue( price_summary.total_with_tax );

  }






  clearSheetForPDF(){
    this.sheet_pdf_format
    .getRange(PDF_FORMAT_INITIAL_ROW, 1, PDF_FORMAT_NUMBER_ROW, PDF_FORMAT_PRICE_COLUMN)
    .setValues( PDF_FORMAT_BLANK_DATA );
  }





  createEmailDraftTest(email_to: string[], title: string ,pdf ){

    const objArgs = { attachments:pdf };
    const email_to_str = email_to.join(' , ');
    Logger.log(`email_to_str:  ${email_to_str}`)
    GmailApp.createDraft( email_to_str, title, 'test content', objArgs );
  }


  // https://kiyotatsu.com/gas_ss-sheet-copy-cname/
  // https://qiita.com/matsuhandy/items/c6b408962c265c011440

  createAnotherSheetAndCopyFormatTest(){

    const ssNew = this.spread_sheet.createSpreadsheetInfolder(INVOICE_FOLDER_ID, 'newcreationway')

    const ssNewID = ssNew.getId();//IDをゲット
    Logger.log(`ssNewID ${ssNewID}`);
    const ssNewFile = SpreadsheetApp.openById(ssNewID);//オープン
    const activeSpreadsheet = SpreadsheetApp.setActiveSpreadsheet(ssNewFile);//アクティブシートに設定，操作が有効なシート
    const masterSheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];//アクティブシートをゲットする
    masterSheet.getRange(1,1, 2,2).setValues([["aa", "bb"], ["cc", "dd"]]).setFontColor("red");
    Utilities.sleep(1000);



    // https://tonari-it.com/gas-google-drive-create-file/

    // ファイルの生成方法を変えてみる。
    

    // const myFolder = DriveApp.getFolderById(INVOICE_FOLDER_ID);

    var myFile = DriveApp.getFileById(ssNewID);
    const pdf = myFile.getAs("application/pdf").setName("dddfdd.pdf");
    const objArgs = { attachments:pdf };
    GmailApp.createDraft( 'moriyama_yuuta@hotmail.com', 'test pdf attachment', 'test content', objArgs );
    // myFolder.createFile(pdf);
  }

  createPdfFromExistingFileTest(){
    const myFile = DriveApp.getFileById('171tfFnCurWpFhhMb2fOjzwi-dHoFFZB8XL6xbM1ZiJ8');
    const pdf = myFile.getAs("application/pdf").setName("dddfdd.pdf");

    const objArgs = { attachments:pdf };
    GmailApp.createDraft( 'moriyama_yuuta@hotmail.com', 'test pdf attachment', 'test content', objArgs );

  }






  editExistingFileAndCreatePdfFileTest(){
    const myFile = DriveApp.getFileById('171tfFnCurWpFhhMb2fOjzwi-dHoFFZB8XL6xbM1ZiJ8');

    const ssNewID = myFile.getId();//IDをゲット
    Logger.log(`ssNewID ${ssNewID}`);
    const ssNewFile = SpreadsheetApp.openById(ssNewID);//オープン
    const activeSpreadsheet = SpreadsheetApp.setActiveSpreadsheet(ssNewFile);//アクティブシートに設定，操作が有効なシート
    const masterSheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];//アクティブシートをゲットする
    masterSheet.getRange(1,1, 2,2).setValues([["edit", "edit"], ["edit", "edit"]]).setFontColor("red");


    const pdf = myFile.getAs("application/pdf").setName("dddfdd.pdf");
    const objArgs = { attachments:pdf };
    GmailApp.createDraft( 'moriyama_yuuta@hotmail.com', 'test pdf attachment', 'test content', objArgs );

  }



  createFileTest(){
    Logger.log("createFileTest");
 
    const myFolder = DriveApp.getFolderById(INVOICE_FOLDER_ID);
    const createdFoler = myFolder.createFolder("dddd");
    Logger.log(createdFoler);
    createdFoler.createFile('NewFile.pdf', 'Hello, world! \n aaa assasdf  \n');
  }

  attachFileTest(){
    const pdf = this.spread_sheet.createPDF(this.sheet_pdf_format_id, 'aaaa');
    const objArgs = { attachments:pdf };
    GmailApp.createDraft( 'moriyama_yuuta@hotmail.com', 'test', 'test content', objArgs );

  }


}


}