import { Injectable } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

    private toastrTimeOut: number = 1500;
    constructor(public toastr: ToastrService) {
    }

    public currentYear: string = (new Date()).getFullYear().toString();
    public currentMonth: string = ((new Date()).getMonth() + 1).toString();


    // response type
    ServerResponse: string = "Server Reponse";
    SiteResponse: string = "Site Reponse";

    // response message
    SomethingWentWrong: string = "Something went wrong";
    ServerResponsedWithErorr: string = "Server responsed with erorr";
    InvalidParameters: string = "Invalid Parameters";
    InvalidExecution: string = "Invalid Execution";
    SaveComplete: string = "Save Complete";

    SuccessfullySaved: string = "Successfully Saved";

    datePickerConfig(): Partial<BsDatepickerConfig> {
        return {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ ",
            customTodayClass: 'custom-today-class',            
            adaptivePosition: true,
            maxDate: new Date(),
        };
    }

    datePickerConfig18(): Partial<BsDatepickerConfig> {
        return {
          containerClass: 'theme-blue',
          showWeekNumbers: false,
          dateInputFormat: 'YYYY-MM-DD',
          isAnimated: true,
          showClearButton: true,
          showTodayButton: true,
          todayPosition: 'top',
          rangeInputFormat: 'YYYY-MM-DD',
          adaptivePosition: true,
          maxDate: new Date(), // Use a valid Date object or undefined
        };
    }     

}