import { SpreadSheetNamespace } from './SpreadSheet';

import { ListSingleLessonNameSpace } from './ListSingleLesson';
import { ListLessonInCourseNameSpace } from './ListLessonInCourse';
import { ListCourseNameSpace } from './ListCourse';

import { SummaryForEachTeacher, TeacherData, BUSINESS_TYPE, SummaryOfPaymentData, PAYMENT_DATA_TYPE, PaymentDataForCourse, PaymentDataForLesson, PaymentDataForLessonInCourse, GrandSummary } from '../model/payment';


export namespace PaymentNameSpace {



export class Payment {

  payment_summary_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  payment_fixedfee_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  payment_revenue_share_sheet: GoogleAppsScript.Spreadsheet.Sheet ;
  spread_sheet: SpreadSheetNamespace.SpreadSheet;

  courseData: PaymentDataForCourse[];


  
  constructor(
    private list_course : ListCourseNameSpace.ListCourse,
    private list_single_lesson : ListSingleLessonNameSpace.ListSingleLesson,
    private list_lesson_in_course : ListLessonInCourseNameSpace.ListLessonInCourse,
  ){
    this.spread_sheet = SpreadSheetNamespace.SpreadSheet.instance;
    this.payment_summary_sheet = this.spread_sheet.getSheet( SpreadSheetNamespace.SHEET_NAME.PAYMENT_MONTHLY_SUMMARY);
  }

  calculatePaymentData(){

    const teacher_data_arr: TeacherData[] = this.getTeacherData();
    const target_month = this.getTargetMonth();
    const course_data_arr: PaymentDataForCourse[] = this.list_course.getPaymentDataForCourse();
    const course_data_of_month: PaymentDataForCourse[] = 
      course_data_arr.filter(
        (course_data: PaymentDataForCourse) =>{return course_data.payment_request_day === target_month}
      );

    const lesson_in_course_data_arr: PaymentDataForLessonInCourse[] = this.list_lesson_in_course.getPaymentDataForLessonInCourse();
    const lesson_in_course_data_of_month: PaymentDataForLessonInCourse[] = 
    lesson_in_course_data_arr.filter(
        (lesson_in_course_data: PaymentDataForLessonInCourse) =>{return lesson_in_course_data.payment_request_day === target_month}
      );  

    const single_lesson_data_arr: PaymentDataForLesson[] = this.list_single_lesson.getPaymentDataForSingleLesson();
    const single_lesson_data_of_month: PaymentDataForLesson[] = 
    single_lesson_data_arr.filter(
        (single_lesson_data: PaymentDataForLesson) =>{return single_lesson_data.payment_request_day === target_month}
      );  


    Logger.log(`course_data_of_month ${JSON.stringify(course_data_of_month)}`);

    const summary_for_each_teacher_arr: SummaryForEachTeacher[] = []

    teacher_data_arr.forEach((teacher_data: TeacherData)=>{
      const teacher_name = teacher_data.name;
      Logger.log(`teacher_name ${teacher_name}`);
      const course_data_of_month_teacher_arr = course_data_of_month.filter((course_data)=>{return course_data.teacher === teacher_name});
      const lesson_in_course_data_of_month_teacher_arr = lesson_in_course_data_of_month.filter((course_data)=>{return course_data.teacher === teacher_name});
      const single_lesson_data_of_month_teacher_arr = single_lesson_data_of_month.filter((course_data)=>{return course_data.teacher === teacher_name});


      const teacher_business_type = teacher_data.business_type;
      Logger.log(`teacher_business_type ${teacher_business_type}`)
      const payment_for_eachteacher_arr: SummaryOfPaymentData[] = [];

      let calculated_fixed_course_data;
      let calculated_fixed_lesson_in_course_data;
      let calculated_fixed_single_lesson_data;
      let calculated_shared_course_data;
      let calculated_shared_lesson_in_course_data;
      let calculated_shared_single_lesson_data;

      if(teacher_business_type === BUSINESS_TYPE.FIXED){
        const fixed_margin_price = teacher_data.condition;
        const fixed_margin_usernum = teacher_data.condition2;

        if(course_data_of_month_teacher_arr && course_data_of_month_teacher_arr.length > 0){
          calculated_fixed_course_data = this.calculateCourseDataFixed(course_data_of_month_teacher_arr, fixed_margin_price, fixed_margin_usernum);
          payment_for_eachteacher_arr.push(calculated_fixed_course_data);
        }
        if(lesson_in_course_data_of_month_teacher_arr && lesson_in_course_data_of_month_teacher_arr.length > 0){
          calculated_fixed_lesson_in_course_data = this.calculateLessonInCourseDataFixed(lesson_in_course_data_of_month_teacher_arr, fixed_margin_price, fixed_margin_usernum);
          payment_for_eachteacher_arr.push(calculated_fixed_lesson_in_course_data);
        }
        if(single_lesson_data_of_month_teacher_arr && single_lesson_data_of_month_teacher_arr.length > 0){
          calculated_fixed_single_lesson_data = this.calculateSingleLessonDataFixed(single_lesson_data_of_month_teacher_arr, fixed_margin_price, fixed_margin_usernum);
          payment_for_eachteacher_arr.push(calculated_fixed_single_lesson_data);
        }

      }else if (teacher_business_type === BUSINESS_TYPE.SHARE){

        const revenue_share_ratio = teacher_data.condition;

        if(course_data_of_month_teacher_arr && course_data_of_month_teacher_arr.length > 0){
          calculated_shared_course_data = this.calculateCourseDataShared(course_data_of_month_teacher_arr, revenue_share_ratio);
          payment_for_eachteacher_arr.push(calculated_shared_course_data);
        }

        if(lesson_in_course_data_of_month_teacher_arr && lesson_in_course_data_of_month_teacher_arr.length > 0){
          calculated_shared_lesson_in_course_data = this.calculateLessonInCourseDataShared(lesson_in_course_data_of_month_teacher_arr, revenue_share_ratio );
          payment_for_eachteacher_arr.push(calculated_shared_lesson_in_course_data);
        }
        if(single_lesson_data_of_month_teacher_arr && single_lesson_data_of_month_teacher_arr.length > 0){
          calculated_shared_single_lesson_data = this.calculateSingleLessonDataShared(single_lesson_data_of_month_teacher_arr, revenue_share_ratio );
          payment_for_eachteacher_arr.push(calculated_shared_single_lesson_data);
        }
      }

      const teacher_payment_summary = this.calculate_eachteacher_payment(teacher_name, payment_for_eachteacher_arr);
      summary_for_each_teacher_arr.push(teacher_payment_summary);
    })

    const grand_summary: GrandSummary = this.calculateGrandSummary(summary_for_each_teacher_arr);


    this.write_all_data(summary_for_each_teacher_arr, grand_summary);


  }

  calculateCourseDataFixed(course_data_of_month_teacher_arr: PaymentDataForCourse[], fixed_margin_price: number, fixed_margin_usernum: number): SummaryOfPaymentData{
    // const course_data_arr = [...course_data_of_month_teacher_arr];
    Logger.log(`calculateCourseDataFixed`);
    Logger.log(`fixed_margin_price ${fixed_margin_price}`);
    Logger.log(`fixed_margin_usernum ${fixed_margin_usernum}`);

    const calculated_course_data_arr =  course_data_of_month_teacher_arr.map((course_data: PaymentDataForCourse)=>{
      Logger.log(`------------------------`)
      Logger.log(`course_data ${course_data} --`);

      const one_lesson_revenue = course_data.unit_lesson_price * (course_data.paid_students_num || 0);

      let one_lesson_platform_margin = fixed_margin_price;
      if( (course_data.paid_students_num || 0) < fixed_margin_usernum){
        one_lesson_platform_margin = fixed_margin_price * (course_data.paid_students_num || 0) / fixed_margin_usernum;
      }
      const one_lesson_allowance = one_lesson_revenue- one_lesson_platform_margin;

      const lesson_num = course_data.lesson_num;
      const course_revenue = one_lesson_revenue * lesson_num;
      const course_platform_margin = one_lesson_platform_margin * lesson_num;
      const course_allowance = one_lesson_allowance * lesson_num;

      const course_data_copy: any = {};
      for(const key in course_data){
        course_data_copy[key]=course_data[key];
      }
      course_data_copy.one_lesson_revenue = one_lesson_revenue;
      course_data_copy.one_lesson_platform_margin = one_lesson_platform_margin;
      course_data_copy.one_lesson_allowance = one_lesson_allowance;
      course_data_copy.course_revenue = course_revenue;
      course_data_copy.course_platform_margin = course_platform_margin;
      course_data_copy.course_allowance = course_allowance;

      return course_data_copy;
    })

    const revenue = calculated_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.course_revenue}, 0);
    const platform_margin = calculated_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.course_platform_margin}, 0);
    const allowance = revenue - platform_margin;


    const summary_course_data: SummaryOfPaymentData = {
      type: PAYMENT_DATA_TYPE.COURSE_FIXED,
      revenue,
      platform_margin,
      allowance,
      paymentCourseDataArr: calculated_course_data_arr,
    }


    return summary_course_data;
  }

  calculateCourseDataShared(course_data_of_month_teacher_arr: PaymentDataForCourse[], revenue_share_ratio: number ){
    Logger.log(`calculateCourseDataShared`);
    Logger.log(`revenue_share_ratio ${revenue_share_ratio}`);

    const calculated_course_data_arr =  course_data_of_month_teacher_arr.map((course_data: PaymentDataForCourse)=>{
      Logger.log(`------------------------`)
      Logger.log(`course_data ${course_data} --`);

      const one_lesson_revenue = course_data.unit_lesson_price * (course_data.paid_students_num || 0);

 
      const one_lesson_allowance = one_lesson_revenue * revenue_share_ratio;
      const one_lesson_platform_margin = one_lesson_revenue - one_lesson_allowance;

      const lesson_num = course_data.lesson_num;
      const course_revenue = one_lesson_revenue * lesson_num;
      const course_platform_margin = one_lesson_platform_margin * lesson_num;
      const course_allowance = one_lesson_allowance * lesson_num;

      const course_data_copy: any = {};
      for(const key in course_data){
        course_data_copy[key]=course_data[key];
      }
      course_data_copy.one_lesson_revenue = one_lesson_revenue;
      course_data_copy.one_lesson_platform_margin = one_lesson_platform_margin;
      course_data_copy.one_lesson_allowance = one_lesson_allowance;
      course_data_copy.course_revenue = course_revenue;
      course_data_copy.course_platform_margin = course_platform_margin;
      course_data_copy.course_allowance = course_allowance;

      return course_data_copy;
    })

    const revenue = calculated_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.course_revenue}, 0);
    const platform_margin = calculated_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.course_platform_margin}, 0);
    const allowance = revenue - platform_margin;


    const summary_course_data: SummaryOfPaymentData = {
      type: PAYMENT_DATA_TYPE.COURSE_SHARE,
      revenue,
      platform_margin,
      allowance,
      paymentCourseDataArr: calculated_course_data_arr,
    }
    return summary_course_data; 
  }


  calculateLessonInCourseDataFixed(lesson_in_course_data_of_month_teacher_arr: PaymentDataForLessonInCourse[], fixed_margin_price: number, fixed_margin_usernum: number){


    Logger.log(`calculateLessonInCourseDataFixed`);
    Logger.log(`fixed_margin_price ${fixed_margin_price}`);
    Logger.log(`fixed_margin_usernum ${fixed_margin_usernum}`);

    const calculated_lesson_in_course_data_arr =  lesson_in_course_data_of_month_teacher_arr.map( 
      ( payment_data: PaymentDataForLessonInCourse) => {

      Logger.log(`------------------------`);
      Logger.log(`payment_data ${payment_data} --`);

      const one_lesson_revenue = payment_data.unit_lesson_price * payment_data.additional_paid_students_num;

      let one_lesson_platform_margin = 0;

      const total_participants_num = payment_data.regular_students_num + payment_data.additional_paid_students_num;

      if(total_participants_num < fixed_margin_usernum){
        one_lesson_platform_margin = payment_data.additional_paid_students_num / fixed_margin_usernum  * fixed_margin_price;
      }else{
        one_lesson_platform_margin = (fixed_margin_usernum - payment_data.regular_students_num) / fixed_margin_usernum * fixed_margin_price;
      }
      const one_lesson_allowance = one_lesson_revenue- one_lesson_platform_margin;


      const lesson_in_course_data_copy: any = {};
      for(const key in payment_data){
        lesson_in_course_data_copy[key]=payment_data[key];
      }
      lesson_in_course_data_copy.one_lesson_revenue = one_lesson_revenue;
      lesson_in_course_data_copy.one_lesson_platform_margin = one_lesson_platform_margin;
      lesson_in_course_data_copy.one_lesson_allowance = one_lesson_allowance;

      return lesson_in_course_data_copy;
    })

    const revenue = calculated_lesson_in_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_revenue}, 0);
    const platform_margin = calculated_lesson_in_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_platform_margin}, 0);
    const allowance = revenue - platform_margin;


    const summary_course_data: SummaryOfPaymentData = {
      type: PAYMENT_DATA_TYPE.LESSON_IN_COURSE_FIXED,
      revenue,
      platform_margin,
      allowance,
      paymentLessonInCourseDataArr: calculated_lesson_in_course_data_arr,
    }

    return summary_course_data;
  }

  calculateLessonInCourseDataShared(lesson_in_course_data_of_month_teacher_arr: PaymentDataForLessonInCourse[], revenue_share_ratio: number){


    Logger.log(`calculateLessonInCourseDataShared`);
    Logger.log(`revenue_share_ratio ${revenue_share_ratio}`);

    const calculated_lesson_in_course_data_arr =  lesson_in_course_data_of_month_teacher_arr.map( 
      ( payment_data: PaymentDataForLessonInCourse) => {

      Logger.log(`------------------------`);
      Logger.log(`payment_data ${payment_data} --`);

      const one_lesson_revenue = payment_data.unit_lesson_price * payment_data.additional_paid_students_num;


      const one_lesson_allowance = one_lesson_revenue * revenue_share_ratio;
      let one_lesson_platform_margin = one_lesson_revenue - one_lesson_allowance;


      const lesson_in_course_data_copy: any = {};
      for(const key in payment_data){
        lesson_in_course_data_copy[key]=payment_data[key];
      }
      lesson_in_course_data_copy.one_lesson_revenue = one_lesson_revenue;
      lesson_in_course_data_copy.one_lesson_platform_margin = one_lesson_platform_margin;
      lesson_in_course_data_copy.one_lesson_allowance = one_lesson_allowance;

      return lesson_in_course_data_copy;
    })

    const revenue = calculated_lesson_in_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_revenue}, 0);
    const platform_margin = calculated_lesson_in_course_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_platform_margin}, 0);
    const allowance = revenue - platform_margin;

    const summary_course_data: SummaryOfPaymentData = {
      type: PAYMENT_DATA_TYPE.LESSON_IN_COURSE_FIXED,
      revenue,
      platform_margin,
      allowance,
      paymentLessonInCourseDataArr: calculated_lesson_in_course_data_arr,
    }

    return summary_course_data;
  }




  calculateSingleLessonDataFixed(single_lesson_data_of_month_teacher_arr: PaymentDataForLesson[], fixed_margin_price: number, fixed_margin_usernum: number){
    Logger.log(`calculateSingleLessonDataFixed`);
    Logger.log(`fixed_margin_price ${fixed_margin_price}`);
    Logger.log(`fixed_margin_usernum ${fixed_margin_usernum}`);

    const calculated_single_lesson_data_arr =  single_lesson_data_of_month_teacher_arr.map( 
      ( payment_data: PaymentDataForLesson) => {

      Logger.log(`------------------------`);
      Logger.log(`payment_data ${payment_data} --`);

      const one_lesson_revenue = payment_data.unit_lesson_price * (payment_data.paid_students_num || 0);

      let one_lesson_platform_margin = 0;


      if( (payment_data.paid_students_num || 0) < fixed_margin_usernum){
        one_lesson_platform_margin = (payment_data.paid_students_num || 0) / fixed_margin_usernum  * fixed_margin_price;
      }else{
        one_lesson_platform_margin = fixed_margin_price;
      }
      const one_lesson_allowance = one_lesson_revenue- one_lesson_platform_margin;


      const single_lesson_data_copy: any = {};
      for(const key in payment_data){
        single_lesson_data_copy[key]=payment_data[key];
      }
      single_lesson_data_copy.one_lesson_revenue = one_lesson_revenue;
      single_lesson_data_copy.one_lesson_platform_margin = one_lesson_platform_margin;
      single_lesson_data_copy.one_lesson_allowance = one_lesson_allowance;

      return single_lesson_data_copy;
    })

    const revenue = calculated_single_lesson_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_revenue}, 0);
    const platform_margin = calculated_single_lesson_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_platform_margin}, 0);
    const allowance = revenue - platform_margin;


    const summary_course_data: SummaryOfPaymentData = {
      type: PAYMENT_DATA_TYPE.SINGLE_LESSON_FIXED,
      revenue,
      platform_margin,
      allowance,
      paymentLessonInCourseDataArr: calculated_single_lesson_data_arr,
    }

    return summary_course_data;

  }

  calculateSingleLessonDataShared(single_lesson_data_of_month_teacher_arr: PaymentDataForLesson[], revenue_share_ratio: number,){
    Logger.log(`calculateSingleLessonDataShared`);
    Logger.log(`revenue_share_ratio ${revenue_share_ratio}`);

    const calculated_single_lesson_data_arr =  single_lesson_data_of_month_teacher_arr.map( 
      ( payment_data: PaymentDataForLesson) => {

      Logger.log(`------------------------`);
      Logger.log(`payment_data ${JSON.stringify(payment_data)} --`);

      const one_lesson_revenue = payment_data.unit_lesson_price * (payment_data.paid_students_num || 0);
      const one_lesson_allowance = one_lesson_revenue * revenue_share_ratio;
      let one_lesson_platform_margin = one_lesson_revenue - one_lesson_allowance;


      const single_lesson_data_copy: any = {};
      for(const key in payment_data){
        single_lesson_data_copy[key]=payment_data[key];
      }
      single_lesson_data_copy.one_lesson_revenue = one_lesson_revenue;
      single_lesson_data_copy.one_lesson_platform_margin = one_lesson_platform_margin;
      single_lesson_data_copy.one_lesson_allowance = one_lesson_allowance;

      Logger.log(`single_lesson_data_copy ${JSON.stringify(single_lesson_data_copy)}`);

      return single_lesson_data_copy;
    })

    const revenue = calculated_single_lesson_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_revenue}, 0);
    const platform_margin = calculated_single_lesson_data_arr.reduce((acc, curr: PaymentDataForCourse)=>{ return acc + curr.one_lesson_platform_margin}, 0);
    const allowance = revenue - platform_margin;


    const summary_course_data: SummaryOfPaymentData = {
      type: PAYMENT_DATA_TYPE.SINGLE_LESSON_SHARE,
      revenue,
      platform_margin,
      allowance,
      paymentLessonInCourseDataArr: calculated_single_lesson_data_arr,
    }

    return summary_course_data;

  }




  calculate_eachteacher_payment(teacher_name: string, paymentForEachTeacherArr: SummaryOfPaymentData[] ): SummaryForEachTeacher{

    const revenue = paymentForEachTeacherArr.reduce((acc, curr)=>{ return acc + curr.revenue}, 0);
    const platform_margin = paymentForEachTeacherArr.reduce((acc, curr)=>{ return acc + curr.platform_margin}, 0);
    const allowance = paymentForEachTeacherArr.reduce((acc, curr)=>{ return acc + curr.allowance}, 0);
    const tax = allowance * 0.1021
    const net_income = allowance - tax;

    const summary_each_teacher: SummaryForEachTeacher = { teacher_name, revenue, platform_margin, allowance, tax, net_income, paymentForEachTeacherArr };
    return summary_each_teacher;
  }

  calculateGrandSummary( summary_for_each_teacher_arr: SummaryForEachTeacher[] ): GrandSummary{
    const revenue = summary_for_each_teacher_arr.reduce((acc, curr)=>{ return acc + curr.revenue}, 0);
    const platform_margin = summary_for_each_teacher_arr.reduce((acc, curr)=>{ return acc + curr.platform_margin}, 0);
    const allowance = summary_for_each_teacher_arr.reduce((acc, curr)=>{ return acc + curr.allowance}, 0);
    const tax = summary_for_each_teacher_arr.reduce((acc, curr)=>{ return acc + curr.tax}, 0);
    const net_income = summary_for_each_teacher_arr.reduce((acc, curr)=>{ return acc + curr.net_income}, 0);

    return {revenue, platform_margin, allowance, tax, net_income  };
  }



  write_all_data(summary_for_each_teacher_arr: SummaryForEachTeacher[], grand_summary: GrandSummary){

    const blank_spreadsheet_initial_data = ['','','','','','','','','','','','','','',];
    const CELL_LENGTH = blank_spreadsheet_initial_data.length;

    const cellData = [blank_spreadsheet_initial_data];
    summary_for_each_teacher_arr.forEach((summary_for_each_teacher: SummaryForEachTeacher)=>{
      const teacher = [summary_for_each_teacher.teacher_name];
      cellData.push(this.fullfill(teacher, CELL_LENGTH, true))

      summary_for_each_teacher.paymentForEachTeacherArr.forEach((payment_data: SummaryOfPaymentData)=>{

        const paymentCourseDataArr: PaymentDataForCourse[] = payment_data.paymentCourseDataArr || [];
        const paymentLessonInCourseDataArr: PaymentDataForLessonInCourse[] =  payment_data.paymentLessonInCourseDataArr || [];
        const type = payment_data.type;
        const type_revenue = payment_data.revenue;
        const type_platform_margin = payment_data.platform_margin;
        const type_allowance = payment_data.allowance;

        if(type === PAYMENT_DATA_TYPE.COURSE_FIXED || type === PAYMENT_DATA_TYPE.COURSE_SHARE){
          cellData.push(this.fullfill(
            ['course name', 'unit_lesson_price', 'paid_students_num', ' one_lesson_revenue', 
            'one_lesson_platform_margin', 'one_lesson_allowance', 'lesson_num', 'course_price', 
            'course_platform_margin', 'course_allowance' ], CELL_LENGTH, true));

            paymentCourseDataArr.forEach( (each_payment: PaymentDataForCourse) => {

            const name = String(each_payment.name);
            const unit_lesson_price = String(each_payment.unit_lesson_price);
            const paid_students_num = String(each_payment.paid_students_num);
            const one_lesson_revenue = String(each_payment.one_lesson_revenue);
            const one_lesson_platform_margin = String(each_payment.one_lesson_platform_margin);
            const one_lesson_allowance = String(each_payment.one_lesson_allowance);
            const lesson_num = String(each_payment.lesson_num);
            const course_price = String(each_payment.course_revenue);
            const course_platform_margin = String(each_payment.course_platform_margin);
            const course_allowance = String(each_payment.course_allowance);
            const one_line_data: string[] = 
              [name, unit_lesson_price, paid_students_num, one_lesson_revenue,
                one_lesson_platform_margin, one_lesson_allowance, lesson_num, course_price
                ,course_platform_margin, course_allowance];
  
            cellData.push(this.fullfill(one_line_data, CELL_LENGTH, true))
          })
        }else if(type === PAYMENT_DATA_TYPE.LESSON_IN_COURSE_FIXED || type === PAYMENT_DATA_TYPE.LESSON_IN_COURSE_SHARE){

          cellData.push(this.fullfill(
            ['lesson in course name', 'unit_lesson_price', ' regular_students_num', ' additional_paid_students_num', ' one_lesson_revenue', 
            'one_lesson_platform_margin', 'one_lesson_allowance' ], CELL_LENGTH, true))

            paymentLessonInCourseDataArr.forEach( (each_payment: PaymentDataForLessonInCourse) => {

            const name = String(each_payment.name);
            const unit_lesson_price = String(each_payment.unit_lesson_price);
            const regular_students_num = String(each_payment.regular_students_num);
            const additional_paid_students_num = String(each_payment.additional_paid_students_num);
            const one_lesson_revenue = String(each_payment.one_lesson_revenue);
            const one_lesson_platform_margin = String(each_payment.one_lesson_platform_margin);
            const one_lesson_allowance = String(each_payment.one_lesson_allowance);
            const one_line_data: string[] = 
              [name, unit_lesson_price, regular_students_num, additional_paid_students_num,  one_lesson_revenue,
                one_lesson_platform_margin, one_lesson_allowance ];
  
            cellData.push(this.fullfill(one_line_data, CELL_LENGTH, true))
          })
        }else if(type === PAYMENT_DATA_TYPE.SINGLE_LESSON_FIXED || type === PAYMENT_DATA_TYPE.SINGLE_LESSON_SHARE){

            cellData.push(this.fullfill(
              ['single lesson name', 'unit_lesson_price', ' paid_students_num', ' one_lesson_revenue', 
              'one_lesson_platform_margin', 'one_lesson_allowance' ], CELL_LENGTH, true))
  
              paymentLessonInCourseDataArr.forEach( (each_payment: PaymentDataForLessonInCourse) => {
  
              const name = String(each_payment.name);
              const unit_lesson_price = String(each_payment.unit_lesson_price);
              const paid_students_num = String(each_payment.paid_students_num);
              const one_lesson_revenue = String(each_payment.one_lesson_revenue);
              const one_lesson_platform_margin = String(each_payment.one_lesson_platform_margin);
              const one_lesson_allowance = String(each_payment.one_lesson_allowance);
              const one_line_data: string[] = 
                [name, unit_lesson_price, paid_students_num, one_lesson_revenue,
                  one_lesson_platform_margin, one_lesson_allowance ];
    
              cellData.push(this.fullfill(one_line_data, CELL_LENGTH, true))
            })
        }

        cellData.push(this.fullfill([`revenue`, ` ${String( Math.round(type_revenue))}`, '', '', ''], CELL_LENGTH, false));
        cellData.push(this.fullfill([`margin`, ` ${String( Math.round(type_platform_margin))}`, '', '', ''], CELL_LENGTH, false));
        cellData.push(this.fullfill([`allowance`, ` ${String( Math.round(type_allowance))}`, '', '', ''], CELL_LENGTH, false));
      })
      if( summary_for_each_teacher &&  summary_for_each_teacher.revenue){
        cellData.push(this.fullfill([`total revenue`, `${String(Math.round( summary_for_each_teacher.revenue))}`, ''], CELL_LENGTH, false));
        cellData.push(this.fullfill([`total platform_margin`, ` ${String( Math.round(summary_for_each_teacher.platform_margin))}`, ''], CELL_LENGTH, false));
        cellData.push(this.fullfill([`total allowance`, ` ${String( Math.round(summary_for_each_teacher.allowance))}`, ''], CELL_LENGTH, false));
        cellData.push(this.fullfill([`tax`, ` ${String( Math.round(summary_for_each_teacher.tax))}`, ''], CELL_LENGTH, false));
        cellData.push(this.fullfill([`net_income`, ` ${String( Math.round(summary_for_each_teacher.net_income))}`, ''], CELL_LENGTH, false));
      }
      cellData.push(this.fullfill([`---------`, `---------`, '---------', `---------`, '---------', `---------`, '---------', `---------`, '---------'], CELL_LENGTH, false));

    })

    cellData.push(this.fullfill([`---------`, `---------`, '---------', `---------`, '---------', `---------`, '---------', `---------`, '---------'], CELL_LENGTH, false));
    cellData.push(this.fullfill([`---------`, `---------`, '---------', `---------`, '---------', `---------`, '---------', `---------`, '---------'], CELL_LENGTH, false));
    cellData.push(this.fullfill([`---------`, `---------`, '---------', `---------`, '---------', `---------`, '---------', `---------`, '---------'], CELL_LENGTH, false));

    cellData.push(this.fullfill([`revenue`, ` ${String( Math.round(grand_summary.revenue))}`, ''], CELL_LENGTH, false));
    cellData.push(this.fullfill([`platform_margin`, ` ${String( Math.round(grand_summary.platform_margin))}`, ''], CELL_LENGTH, false));
    cellData.push(this.fullfill([`allowance`, ` ${String( Math.round(grand_summary.allowance))}`, ''], CELL_LENGTH, false));
    cellData.push(this.fullfill([`tax`, ` ${String( Math.round(grand_summary.tax))}`, ''], CELL_LENGTH, false));
    cellData.push(this.fullfill([`net_income`, ` ${String( Math.round(grand_summary.net_income))}`, ''], CELL_LENGTH, false));

    this.clear_data();
    this.write_data(cellData)


  }

  fullfill( original_data: string[], length: number,  direction: boolean): string[]{

    const data = [''].concat(original_data);
    const remain_length = length - data.length
    if( remain_length > 0)
    for( let i = 0; i< remain_length; i++ ){
      if(direction){
        data.push('');
      }else{
        data.unshift('');
      }
    }
    return data;
  }

  clear_data(){
    this.payment_summary_sheet.getRange(3, 6,1000, 20 ).clear();
  }

  write_data(cellData: any[][]){

    const numrows = cellData.length;
    const numcolumns = cellData[0].length;

    this.payment_summary_sheet.getRange(3, 6, numrows, numcolumns ).setValues(cellData);
  }




  getTeacherData(): TeacherData[] {
    const range = this.payment_summary_sheet.getRange(6, 1, 15, 5 );
    const teacher_map = range.getValues();
    const teacher_data_arr: TeacherData[] = 
    teacher_map.map((data)=>{
      const teacher_data: TeacherData = {
        name: String(data[0]),
        business_type: String(data[1]),
        condition: Number(data[2]),
        condition2: Number(data[3])
      }
      return teacher_data;
    })
    Logger.log(`-- -teacher_data_arr 2 --  ${JSON.stringify(teacher_data_arr)}`)
    return teacher_data_arr;
  }







  getTargetMonth(): string {
    const range = this.payment_summary_sheet.getRange(2, 1 );
    const month = String(range.getValues());
    Logger.log(` --- month -- ${month}`);

    return month;
  }

  getPaymentCourse(){

    this.list_course.getPaymentDataForCourse();


  }



  

  getPaymentLessonInCourse(){
    
  }
  getPaymentSingleLesson(){
    
  }

  

}


}
