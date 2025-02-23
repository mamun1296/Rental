import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanlordService } from './landlord.service';
import { NotifyService } from '../../services/notify-services/notify.service';
import { UserService } from '../../services/user-services/user.service';


@Component({
  selector: 'app-landlords',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './landlord.component.html',
  styleUrls: ['./landlord.component.scss']
})
export class LandlordComponent implements OnInit {
  landlordForm!: FormGroup;
  sessionAgencyID: any;
  pageNumber: number = 1;
  pageSize: number = 15;
  listPageConfig: any;

  constructor(private fb: FormBuilder, private lanlordService: LanlordService, private notifyService: NotifyService, private userService: UserService) 
  {
     this.listPageConfig = this.userService.pageConfigInit("list", this.pageSize, 1, 0);
  }

  ngOnInit(): void {       
    this.getUserLoginData();
    this.sessionAgencyID =  this.userLoginData.agencyID;
    this.landloardFormInit();
    this.getLandloards();
  }

  userLoginData: any;
  getUserLoginData(): void {
    const storedUserData = localStorage.getItem('userLoginData');
    if (storedUserData) {
      this.userLoginData = JSON.parse(storedUserData);
    } else {
      console.error('No user data found in localStorage.');
    }
  }

  landloardFormInit(){
    this.landlordForm = this.fb.group({
      id: [0],
      agencyID: new FormControl(this.sessionAgencyID),
      landlordID: new FormControl(''),
      landlordType: new FormControl('0', [Validators.required, Validators.minLength(3)]),
      landlordName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      address: new FormControl('', [Validators.required]),
      contactNumber: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),      
    })     

    this.landlordForm.valueChanges.subscribe((value: any) => {
      this.getLandloards();
    });
  }
 

  onSubmit(): void {
    if (this.landlordForm.valid) {
      const formValue = this.landlordForm.value;
    
      this.lanlordService.insert(formValue).subscribe({
    
          next: (response: any) => {             
            if (response?.data?.status) {
              this.notifyService.showMessage('success', 'Landlord has been successfully saved.');
              this.getLandloards();    
              this.resetForm();
            }                 
            else{
              if (response?.data?.isDuplicateEmail) {
                this.notifyService.showMessage('warning', 'Email already exists!.');      
              } 
              if (response?.data?.isDuplicateUser) {
                this.notifyService.showMessage('warning', 'User name already exists!.');      
              } 
              if (response?.data?.isDuplicateContact) {
                this.notifyService.showMessage('warning', 'Contact number already exists!.');      
              }                                    
            }
          
          },
          error: (error: any) => {
            this.notifyService.showMessage('error', 'Failed to save Landlord! Please try again.');      
          }
        });
      } else {
        this.notifyService.showMessage('warning', 'Form is invalid! Please correct the errors in the form.');
      
      }     
    }
  

  resetForm() {
    this.landlordForm = this.fb.group({
      id: [0],
      agencyID: new FormControl(this.sessionAgencyID),
      landlordID: new FormControl(''),
      landlordType: new FormControl('0', [Validators.required, Validators.minLength(3)]),
      landlordName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      address: new FormControl('', [Validators.required]),
      contactNumber: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  list: any[] = [];
  getLandloards() {
    const params = this.landlordForm.value;   
    this.lanlordService.getLandloardList(params).subscribe(
      (response) => {      
        this.list = response.body?.data?.list || [];
        const pagination = response.headers.get('X-Pagination');         
        //console.log('Pagination:', pagination);
        if (pagination) {
          this.listPageConfig = JSON.parse(pagination);
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

}
