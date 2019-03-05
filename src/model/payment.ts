


export interface SummaryForEachTeacher {
  teacher_name: string,
  revenue: number,
  platform_margin: number,
  allowance: number,
  tax: number,
  net_income: number,
  paymentForEachTeacherArr: SummaryOfPaymentData[]
}

export interface SummaryOfPaymentData {
  type: PAYMENT_DATA_TYPE,
  revenue: number,
  platform_margin: number,
  allowance: number,
  paymentDataArr: PaymentDataForCourse[],
}

export interface PaymentDataForLesson {
  name: string,
  teacher: string,
  unit_lesson_price: number,
  paid_students_num: number,
  one_lesson_revenue?: number,
  one_lesson_platform_margin?: number,
  one_lesson_allowance?: number,
  payment_request_day: string,
}

export interface PaymentDataForCourse extends PaymentDataForLesson {
  course_id: string;
  lesson_num: number,
  course_revenue: number,
  course_platform_margin?: number,
  course_allowance?: number,
}

export interface TeacherData {
  name: string,
  business_type: string,
  condition: number,
  condition2: number,
}

export enum BUSINESS_TYPE {
  FIXED = 'FIXED',
  SHARE = 'SHARE',
}

export enum LECTURE_TYPE {
  COURSE = 'COURSE',
  LESSON_IN_COURSE = 'LESSON_IN_COURSE',
  SINGLE_LESSON = 'SINGLE_LESSON',
}


export enum PAYMENT_DATA_TYPE {
  COURSE_FIXED = 'COURSE_FIXED',
  LESSON_IN_COURSE_FIXED = 'LESSON_IN_COURSE_FIXED',
  SINGLE_LESSON_FIXED = 'SINGLE_LESSON_FIXED',
  COURSE_SHARE = 'COURSE_SHARE',
  LESSON_IN_COURSE_SHARE = 'LESSON_IN_COURSE_SHARE',
  SINGLE_LESSON_SHARE = 'SINGLE_LESSON_SHARE',
}



