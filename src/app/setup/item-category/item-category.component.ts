import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';

import { ItemCategoryService } from './item-category.service';
import { NotifyService } from '../../services/notify-services/notify.service';

@Component({
  selector: 'app-itemCategory-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './item-category.component.html',
  styleUrl: './item-category.component.scss'
})
export class ItemCategoryComponent implements OnInit{

  
    pageNumber: number = 1;
    pageSize: number = 15;
    listPageConfig: any;
  
    constructor(private fb: FormBuilder,
       private itemCategoryService: ItemCategoryService,
        private notifyService: NotifyService){}
        itemCategoryEntryForm!: FormGroup;

        sessionAgencyID: any;
     
        ngOnInit(): void {
          this.getUserLoginData();       
          this.sessionAgencyID = this.userLoginData.agencyID;     
          this.itemCategoryEntryFromInit();    
          this.itemCategoryListFormInit();    
          this.getitemCategory(this.itemCategoryListForm.get('searchString')?.value);      

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
        
          itemCategoryEntryFromInit(){
            this.itemCategoryEntryForm = this.fb.group({
              id: new FormControl(0),
              agencyID: new FormControl(this.sessionAgencyID),            
              itemCategoryID: new FormControl(''),    
              itemCategoryName: new FormControl('', [Validators.required, Validators.minLength(2)]),
              categoryID: new FormControl('', [Validators.required, Validators.minLength(1)]),   
              categoryName: new FormControl(''),               
              description: new FormControl(''),
              isActive: new FormControl(true),
              isApproved: new FormControl(true),
              stateStatus: new FormControl('Approved'),
              activationStatus: new FormControl('Active'),
            });  
          }

  
          onSubmit(): void {
            if (this.itemCategoryEntryForm.valid) {

              const formValue = { ...this.itemCategoryEntryForm.value };
          
              this.itemCategoryService.insert(formValue).subscribe({
                next: (response: any) => {
                  if (response?.data?.status) {
                    this.resetitemCategoryEntryFrom();
                    this.notifyService.showMessage('success', 'item categorys successfully saved.');
                    this.getitemCategory(this.itemCategoryListForm.get('searchString')?.value);                 
                  } 
                  else if (response?.data?.isDuplicate) { 
                    this.notifyService.showMessage('warning', 'item categorys successfully saved.');
                  }
                },
                error: () => {
                  this.notifyService.showMessage('error', 'Failed to save item category! Please try again.');
                },
              });
            } else {
              this.notifyService.showMessage('error', 'Form is invalid!');
            }
          }
          
          
          resetitemCategoryEntryFrom() {
            this.itemCategoryEntryForm = this.fb.group({             
            })
          }
  
          itemCategoryListForm: any;
          itemCategoryListFormInit(){        
            this.itemCategoryListForm = this.fb.group({
              id: new FormControl(0),
              agencyID: new FormControl(this.sessionAgencyID),            
              itemCategoryID: new FormControl(''),    
              itemCategoryName: new FormControl(''),
              categoryID: new FormControl(''),   
              categoryName: new FormControl(''),               
              description: new FormControl(''),
              isActive: new FormControl(''),
              isApproved: new FormControl(''),
              stateStatus: new FormControl(''),
              activationStatus: new FormControl(''),
              searchString : new FormControl('')
            })   
             
            this.itemCategoryListForm.get('searchString')?.valueChanges.subscribe((searchValue: any) => {
              this.getitemCategory(searchValue);
            });
          }
      
        
        list: any[] = [];
        getitemCategory(search: any) {
          const params = {...this.itemCategoryListForm.value, searchString: search ?? ''};   
          this.itemCategoryService.getList(params).subscribe(
            (response) => {      
              this.list = response.body?.data?.list || [];
              const pagination = response.headers.get('X-Pagination');
              if (pagination) {
             // console.log('Pagination:', pagination);
                this.listPageConfig = JSON.parse(pagination);
              }
            },
            (error) => {
              console.error('API Error:', error);
            }
          );
        }

  
      listPageChanged(event: any) {
        this.pageNumber = event;
        this.itemCategoryEntryForm.get('pageNumber')?.setValue(this.pageNumber);
        this.getitemCategory(this.itemCategoryEntryForm.get('searchString')?.value);
      }
    
}
  

