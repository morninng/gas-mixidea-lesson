import { AttendanceConfirmation } from './class/AttendanceConfirmation';
import { CourseList } from './class/CourseList';



function aaa(){
  Logger.log('bbb');
}

function hello(){
  const course_list = new CourseList();
  const attendanceConfirmation = new AttendanceConfirmation(course_list);
  attendanceConfirmation.hello();
}

function updateLessonData() {
  const course_list = new CourseList();
  const attendanceConfirmation = new AttendanceConfirmation(course_list);
  attendanceConfirmation.updateLessonData();
}


