import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { ItemService } from './item.service';
import { NotifyService } from '../../services/notify-services/notify.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit{

  itemsFormArray: FormArray;

  pageNumber: number = 1;
  pageSize: number = 15;
  listPageConfig: any;

  constructor(private fb: FormBuilder, private itemService: ItemService, private notifyService: NotifyService){   
    this.itemsFormArray = this.fb.array([this.createItem()]); 
  }
      itemEntryForm!: FormGroup;
      sessionAgencyID: any;
   
      ngOnInit(): void {
        this.getUserLoginData();       
        this.sessionAgencyID = this.userLoginData.agencyID;     
        this.itemEntryFromInit();    
        this.itemListFormInit();    
        this.getItems(this.itemListForm.get('searchString')?.value);       
        this.loadItemsCategory();
       
      }
      
      ddlItemsCategory: any[] = [];
      loadItemsCategory(): void {       
      const agency_id = this.sessionAgencyID;
      if (!agency_id) {
        console.error("Error: AgencyID is not available.");
        return;
      }
      const categoryID = '';
      this.itemService.getItemCategoryExtension<any[]>(categoryID,agency_id)
        .then((response: any) => {
          const resData = response.data || [];
          this.ddlItemsCategory = resData.map((item: any) => ({
            id: item.id.toString(),
            text: item.text,
          }));
          //console.log("this.ddlItems ", this.ddlItems);
        })
        .catch((error: any) => {
          console.error("Error fetching Items:", error);
        });
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
      
        itemEntryFromInit(){
          this.itemEntryForm = this.fb.group({
            items: this.fb.array([this.createItem()]) // Initialize FormArray
          });

        }

        createItem(): FormGroup {
          return this.fb.group({
            id: new FormControl(0),
            agencyID: new FormControl(this.sessionAgencyID),            
            itemID: new FormControl(''),    
            itemName: new FormControl('', [Validators.required, Validators.minLength(2)]),
            categoryID: new FormControl('', [Validators.required, Validators.minLength(1)]),   
            categoryName: new FormControl(''),               
            description: new FormControl(''),
            isActive: new FormControl(true),
            isApproved: new FormControl(true),
            stateStatus: new FormControl('Approved'),
            activationStatus: new FormControl('Active'),
          });
        }

        onItemSubmit(): void {
          if (this.itemEntryForm.valid) {
            const items = this.items.controls.map((item) => item.value);
        
            // Prepare the payload for submission
            const payload = {
              items: items.map((item) => ({
                id: item.id || 0,
                agencyID: this.sessionAgencyID,
                itemID: item.itemID,
                itemName: item.itemName,
                categoryID: item.categoryID,
                categoryName: item.categoryName,
                description: item.description,
                isActive: item.isActive,
                stateStatus: item.stateStatus ?? '',
                activationStatus: item.activationStatus ?? '',
              })),
            };
        
            this.itemService.insert(payload).subscribe({
              next: (response: any) => {
                if (response?.data?.status) {
                  this.resetItemEntryFrom();
                  this.notifyService.showMessage('success', 'Items successfully saved.');
                  this.getItems(this.itemListForm.get('searchString')?.value);
                  this.loadItemsCategory();
                } else if (response?.data?.isDuplicate) {
                  const duplicateItems = response?.data?.duplicateItems || [];
        
                  // Mark duplicates with errors and show a notification
                  duplicateItems.forEach((duplicateItemName: string) => {
                    const duplicateIndex = items.findIndex(
                      (item) =>
                        item.itemName?.trim().toLowerCase() ===
                        duplicateItemName.trim().toLowerCase()
                    );
                    if (duplicateIndex >= 0) {
                      this.items.at(duplicateIndex).get('itemName')?.setErrors({ duplicate: true });
                    }
                  });
        
                  this.notifyService.showMessage(
                    'warning',
                    `Duplicate items detected: ${duplicateItems.join(', ')}.`
                  );
                }
              },
              error: () => {
                this.notifyService.showMessage('error', 'Failed to save item! Please try again.');
              },
            });
          } else {
            this.notifyService.showMessage('error', 'Form is invalid!');
            this.markAllControlsTouched(this.itemEntryForm);
          }
        }
        
        
        markAllControlsTouched(formGroup: FormGroup | FormArray): void {
          Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            if (control instanceof FormGroup || control instanceof FormArray) {
              this.markAllControlsTouched(control);
            } else {
              control?.markAsTouched();
            }
          });
        }
        
        
        resetItemEntryFrom() {
          this.itemEntryForm = this.fb.group({  
            items: this.fb.array([this.createItem()]) 
          })
        }

        itemListForm: any;
        itemListFormInit(){        
          this.itemListForm = this.fb.group({
            id: new FormControl(0),
            agencyID: new FormControl(this.sessionAgencyID),            
            itemID: new FormControl(''),    
            itemName: new FormControl(''),
            categoryID: new FormControl(''),   
            categoryName: new FormControl(''),               
            description: new FormControl(''),
            isActive: new FormControl(''),
            isApproved: new FormControl(''),
            stateStatus: new FormControl(''),
            activationStatus: new FormControl(''),
            searchString : new FormControl('')
          })   
           
          this.itemListForm.get('searchString')?.valueChanges.subscribe((searchValue: any) => {
            this.getItems(searchValue);
          });
        }
    
      
      list: any[] = [];
      getItems(search: any) {
        const params = {...this.itemListForm.value, searchString: search ?? ''};   
        this.itemService.getList(params).subscribe(
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

    get items(): FormArray {
      return this.itemEntryForm.get('items') as FormArray;
    }

    addItem(): void {
      this.items.push(this.createItem());
    }

    // Remove a specific row
    removeItem(index: number): void {  
      if (this.items.length > 1) {
        this.items.removeAt(index);
      }
    }
    
    itemNameChanged(event: Event, index: number): void {
      const selectElement = event.target as HTMLSelectElement;
      const id = selectElement.value;     
      if (id === '') {
        return;
      }
    
  
      const duplicateItemNames = this.items.controls.filter(
        (item, i) => item.get('itemName')?.value === id && i !== index
      );
    
      if (duplicateItemNames.length > 0) {
        this.items.at(index).get('itemName')?.setValue('');
        this.notifyService.showMessage('warning', 'Duplicate Item Name Detected!');
        return;
      }
    }


    listPageChanged(event: any) {
      this.pageNumber = event;
      this.itemEntryForm.get('pageNumber')?.setValue(this.pageNumber);
      this.getItems(this.itemEntryForm.get('searchString')?.value);
    }
  
}


