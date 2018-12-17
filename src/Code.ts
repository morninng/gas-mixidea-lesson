import { AttendanceConfirmation } from './class/AttendanceConfirmation';
import { LessonList } from './class/LessonList';

function aaa(){
  console.log('bbb');
}

function hello(){
  const lesson_list = new LessonList();
  const attendanceConfirmation = new AttendanceConfirmation(lesson_list);
  attendanceConfirmation.hello();
}

function getLessonData() {
  const lesson_list = new LessonList();
  const attendanceConfirmation = new AttendanceConfirmation(lesson_list);
  attendanceConfirmation.getLessonData();
}

