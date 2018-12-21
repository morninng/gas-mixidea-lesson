import { AttendanceConfirmCourse } from './class/AttendanceConfirmCourse';
import { CourseList } from './class/CourseList';




function getMailCourseId(){
  const course_list = new CourseList();
  const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list);
  attendanceConfirmCourse.getMailCourseId();
}



function updateLessonData() {
  const course_list = new CourseList();
  const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list);
  attendanceConfirmCourse.updateCourseData();
}

// function getCourseDataFromRowNum() {
//   const course_list = new CourseList();
//   course_list.getCourseDataFromRowNum(5);
// }

