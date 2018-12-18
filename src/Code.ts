import { AttendanceConfirmCourse } from './class/AttendanceConfirmation';
import { CourseList } from './class/CourseList';



function aaa(){
  Logger.log('bbb');
}



function updateLessonData() {
  const course_list = new CourseList();
  const attendanceConfirmCourse = new AttendanceConfirmCourse(course_list);
  attendanceConfirmCourse.updateCourseData();
}


