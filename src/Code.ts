import { AttendanceConfirmCourse } from './class/AttendanceConfirmCourse';
import { AttendanceConfirmSingleLesson } from './class/AttendanceConfirmSingleLesson';
import { ListCourse } from './class/ListCourse';
import { ListSingleLesson } from './class/ListSingleLesson';
import { User } from './class/User';

// function getMailCourseId(){
//   const course_list = new CourseList();
//   const user = new User();
//   const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list, user);
//   attendanceConfirmCourse.getMailCourseId();
// }


// function getMailSingleLessonId(){
//   const single_lesson_list = new ListSingleLesson();
//   const attendanceConfirmSingleLesson = new AttendanceConfirmSingleLesson( single_lesson_list );
//   attendanceConfirmSingleLesson.getMailSingleLessonId();
// }

function updateSingleLessonData(){
  const single_lesson_list = new ListSingleLesson();
  const attendanceConfirmSingleLesson = new AttendanceConfirmSingleLesson( single_lesson_list );
  attendanceConfirmSingleLesson.updateSingleLessonData();
}

function sendSingleLessonMail(){
  const single_lesson_list = new ListSingleLesson();
  const attendanceConfirmSingleLesson = new AttendanceConfirmSingleLesson( single_lesson_list );
  attendanceConfirmSingleLesson.sendMail();
}


function updateCourseData() {
  const course_list = new ListCourse();
  const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list);
  attendanceConfirmCourse.updateCourseData();
}

function sendCourseMail(){
  const course_list = new ListCourse();
  const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list);
  attendanceConfirmCourse.sendMail();
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
