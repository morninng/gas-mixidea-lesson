

export interface LessonDataIndex{
  lessonNameIndex: number;
  teacherNameIndex: number;
  lessonScheduleIndex: number;
  lessonWeekdayIndex: number;
  lessonNumberIndex: number;
  lessonUnitPriceIndex: number;
  lessonPriceForOnePersonIndex: number;
  lessonPaymentRequestDayIndex: number;
  studentsNameArrIndex: number
}
export interface LessonData{
  lessonName?: string
  teacherName?: string;
  lessonSchedule?: string;
  lessonWeekday?: string;
  lessonNumber?: number;
  lessonUnitPrice?: number;
  lessonPriceForOnePerson?: number;
  lessonPaymentRequestDay?: string;
  studentsNameArr?: string[];
}
