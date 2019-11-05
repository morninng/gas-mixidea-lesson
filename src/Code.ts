import { AttendanceConfirmCourseNameSpace } from './class/AttendanceConfirmCourse';
import { AttendanceConfirmSingleLessonNameSpace } from './class/AttendanceConfirmSingleLesson';
import { AttendanceConfirmLessonInCourseNameSpace } from './class/AttendanceConfirmLessonInCourse';
import { ListCourseNameSpace } from './class/ListCourse';
import { ListSingleLessonNameSpace } from './class/ListSingleLesson';
import { ListLessonInCourseNameSpace } from './class/ListLessonInCourse';
import { InvoiceNameSpace } from './class/Invoice';
import { PaymentNameSpace } from './class/Payment'
// import { UserNameSpace } from './class/User';


// function createAnotherSheetAndCopyFormat(){
//   const course_list = new ListCourseNameSpace.ListCourse();
//   const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

//   const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
//   invoice.createAnotherSheetAndCopyFormatTest(); 
// }



// function developDecoration(){
//   const course_list = new ListCourseNameSpace.ListCourse();
//   const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

//   const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
//   invoice.developDecoration(); 
// }



// function createPdfFromExistingFile(){
//   const course_list = new ListCourseNameSpace.ListCourse();
//   const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

//   const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
//   invoice.createPdfFromExistingFileTest(); 

// }

// function editExistingFileAndCreatePdfFile(){
//   const course_list = new ListCourseNameSpace.ListCourse();
//   const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

//   const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
//   invoice.editExistingFileAndCreatePdfFileTest(); 
// }
function collectAndLocateData(){
  Logger.log(' -- collectAndLocateData --')

  const course_list = new ListCourseNameSpace.ListCourse();
  const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
  const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

  const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
  invoice.collectAndLocateData(); 
}

function createEmailDrat(){

  const course_list = new ListCourseNameSpace.ListCourse();
  const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
  const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

  const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
  invoice.createEmailDrat(); 
}


// function createFileTest(){
//   const course_list = new ListCourseNameSpace.ListCourse();
//   const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

//   const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
//   invoice.createFileTest();
// }

// function attachFileTest(){
//   const course_list = new ListCourseNameSpace.ListCourse();
//   const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

//   const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list)
//   invoice.attachFileTest();

// }

function getAllDataTest(){

  const course_list = new ListCourseNameSpace.ListCourse();
  const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
  const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();
  const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list);
  invoice.getAllDataTest();
}

// function createInvoiceAndEmailDraft(){

//   const course_list = new ListCourseNameSpace.ListCourse();
//   const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();
//   const invoice = new InvoiceNameSpace.Invoice(course_list, single_lesson_list, lesson_in_course_list);
//   invoice.createInvoiceAndEmailDraft();
// }

// function getMailCourseId(){
//   const course_list = new ListCourseNameSpace.ListCourse();
//   const attendanceConfirmCourse = new AttendanceConfirmCourseNameSpace.AttendanceConfirmCourse(course_list);
//   attendanceConfirmCourse.getMailCourseId();
// }


// function getMailSingleLessonId(){
//   const single_lesson_list = new ListSingleLesson();
//   const attendanceConfirmSingleLesson = new AttendanceConfirmSingleLesson( single_lesson_list );
//   attendanceConfirmSingleLesson.getMailSingleLessonId();
// }

// function getLessonInCourseDataFromId(){
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();
//   lesson_in_course_list.getLessonInCourseDataFromId('1'); 
// }

function updateLessonInCourseData(){

  const course_list = new ListCourseNameSpace.ListCourse();

  const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();
  const attendanceConfirmLessonInCourse = new AttendanceConfirmLessonInCourseNameSpace.AttendanceConfirmLessonInCourse(lesson_in_course_list, course_list);
  attendanceConfirmLessonInCourse.updateLessonInCourseData(); 
}

function createMailDraftLessonInCourseData(){

  const course_list = new ListCourseNameSpace.ListCourse();

  const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();
  const attendanceConfirmLessonInCourse = new AttendanceConfirmLessonInCourseNameSpace.AttendanceConfirmLessonInCourse(lesson_in_course_list, course_list);
  attendanceConfirmLessonInCourse.createMailDraft(); 
}



// function getMailLessonInCourseId(){

//   const course_list = new ListCourseNameSpace.ListCourse();
//   const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();
//   const attendanceConfirmLessonInCourse = new AttendanceConfirmLessonInCourseNameSpace.AttendanceConfirmLessonInCourse(lesson_in_course_list, course_list);
//   attendanceConfirmLessonInCourse.getMailLessonInCourseId();
// }


function updateSingleLessonData(){
  const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
  const attendanceConfirmSingleLesson = new AttendanceConfirmSingleLessonNameSpace.AttendanceConfirmSingleLesson( single_lesson_list );
  attendanceConfirmSingleLesson.updateSingleLessonData();
}

function createSingleLessonMailDreft(){
  const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
  const attendanceConfirmSingleLesson = new AttendanceConfirmSingleLessonNameSpace.AttendanceConfirmSingleLesson( single_lesson_list );
  attendanceConfirmSingleLesson.createMailDraft();
}


function updateCourseData() {
  const course_list = new ListCourseNameSpace.ListCourse();
  const attendanceConfirmCourse = new AttendanceConfirmCourseNameSpace.AttendanceConfirmCourse(course_list);
  attendanceConfirmCourse.updateCourseData();
}

function createCourseMailDraft(){
  const course_list = new ListCourseNameSpace.ListCourse();
  const attendanceConfirmCourse = new AttendanceConfirmCourseNameSpace.AttendanceConfirmCourse(course_list);
  attendanceConfirmCourse.createMailDraft();
}



// function getCourseDataFromRowNum() {
//   const course_list = new CourseList();
//   course_list.getCourseDataFromRowNum(5);
// }

// function retrieveUserdata(){
//   const user = new User();
//   user.retrieveUserdata();
// }

// function getMailList(){
//   const user = new User();
//   const mail_arr = user.getMailList(["中尾晶子", "文野久美子", "高木ひろこ", "ヒル文子"]);
//   Logger.log(mail_arr);
// }


// function setEmailAddress(){
//   const course_list = new CourseList();
//   const user = new User();
//   const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list, user);
//   attendanceConfirmCourse.setEmailAddress(['aa@bb', 'cc@dd']);
// }

function calculatePaymentData(){


  const course_list = new ListCourseNameSpace.ListCourse();
  const single_lesson_list = new ListSingleLessonNameSpace.ListSingleLesson();
  const lesson_in_course_list = new ListLessonInCourseNameSpace.ListLessonInCourse();

  const payment = new PaymentNameSpace.Payment(course_list, single_lesson_list, lesson_in_course_list);
  payment.calculatePaymentData();
  // invoice.collectAndLocateData(); 
}

