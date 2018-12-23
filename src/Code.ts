import { AttendanceConfirmCourse } from './class/AttendanceConfirmCourse';
import { CourseList } from './class/CourseList';
import { User } from './class/User';

// function getMailCourseId(){
//   const course_list = new CourseList();
//   const user = new User();
//   const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list, user);
//   attendanceConfirmCourse.getMailCourseId();
// }



function updateCourseData() {
  const course_list = new CourseList();
  const user = new User();
  const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list, user);
  attendanceConfirmCourse.updateCourseData();
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

function sendMail(){
  const course_list = new CourseList();
  const user = new User();
  const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list, user);
  attendanceConfirmCourse.sendMail();
}
