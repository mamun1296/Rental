import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnicianService } from '../../technician/technician.service';
import { SegmentService } from '../../segment/segment.service';
import { TenantService } from '../../tenant/tenant.service';
import { ComplainService } from '../../complain/complain.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnicianAssignService } from '../../technician-assign/technician-assign.service';
import { NotifyService } from '../../../services/notify-services/notify.service';

@Component({
  selector: 'app-assign-technician',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assign-technician.component.html',
  styleUrl: './assign-technician.component.scss'
})
export class AssignTechnicianComponent {
   constructor(private fb:FormBuilder, private technicianService: TechnicianService, private segmentService: SegmentService,
      private tenantService: TenantService, private complainService: ComplainService, private technicianAssignService: TechnicianAssignService,
    private notifyService: NotifyService, private route: ActivatedRoute, private router : Router)
    {
  
    }
    complain : any;
    assignTechnicianForm!: FormGroup;
    technicianCategories: any[]=[];
    properties: any[]=[];
    sessionAgencyID: any;
  
    isEditClicked = false;
  
    listPageConfig: any;
  
    isCategoryDropdownOpen = false;
    isTechnicianDropdownOpen = false;
    isPropertyDropdownOpen = false;
    isTenantDropdownOpen = false;
    isComplainDropdownOpen = false;
  
    categoryId: any;
    technicianId: any;
    propertyId:any;
    tenantId:any;
  
    categorySearchControl = new FormControl('');
    technicianSearchControl = new FormControl('');
    propertySearchControl = new FormControl('');
    tenantSearchControl = new FormControl('');
    complainSearchControl = new FormControl('');
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.complain = params;
      });
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;
      this.assignTechnicianFormInit();
      this.getTechnicianCategories();
      // this.searchCategory();
      // this.searchTechnician();
      // this.getProperties();
      // this.searchProperty();
      // this.searchTenant();
      // this.searchComplain();
    }
  
    userLoginData: any;
    getUserLoginData()
    {
      const storedUserData = localStorage.getItem('userLoginData');
      if (storedUserData) {
        this.userLoginData = JSON.parse(storedUserData);
      } else {
        console.error('No user data found in localStorage.');
      }
  }
  
  assignTechnicianFormInit()
  {
    this.assignTechnicianForm = this.fb.group({
      id: new FormControl(0),
      technicianAssignId: new FormControl(''),
      agencyId: new FormControl(this.sessionAgencyID),
      categoryID: new FormControl('',[Validators.required]),
      // technicianCategoryName: new FormControl('',[Validators.required]),
      technicianID: new FormControl('',[Validators.required]),
      // technicianName: new FormControl('',[Validators.required]),
      propertyID: new FormControl(this.complain.propertyID),
      // propertyName: new FormControl('',[Validators.required]),
      tenantID: new FormControl(this.complain.tenantID),
      // tenantName: new FormControl('',[Validators.required]),
      // complainName: new FormControl('',[Validators.required]),
      complainID: new FormControl(this.complain.complainID),
      stateStatus: new FormControl(this.complain.stateStatus),
      isActive: new FormControl(this.complain.isActive),
      activationStatus: new FormControl(this.complain.activationStatus),
      isApproved: new FormControl(this.complain.isApproved),
      billingAmount: new FormControl(0),
      paidAmount: new FormControl(0),
    });
  }
  // categoryToggleDropDown()
  // {
  //   this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  // }
  // technicianToggleDropDown()
  // {
  //   this.isTechnicianDropdownOpen = !this.isTechnicianDropdownOpen;
  // }
  // propertyToggleDropDown()
  // {
  //   this.isPropertyDropdownOpen = !this.isPropertyDropdownOpen;
  // }
  // tenantToggleDropDown()
  // {
  //   this.isTenantDropdownOpen = !this.isTenantDropdownOpen;
  // }
  // complainToggleDropDown()
  // {
  //   this.isComplainDropdownOpen = !this.isComplainDropdownOpen;
  // }
  // clearCategorySelection()
  // {
  //     this.technicianAssignForm.controls['technicianCategoryName'].setValue('');
  //     this.technicianAssignForm.controls['technicianCategoryID'].setValue('');
  //     this.technicianAssignForm.controls['technicianName'].setValue('');
  //     this.technicianAssignForm.controls['technicianID'].setValue('');
  
  //     this.categorySearchControl.setValue('');
  //     this.technicianSearchControl.setValue('');
  
  //     this.isCategoryDropdownOpen = false;
  //     this.isTechnicianDropdownOpen = false;
  
  //     this.filteredCategories = this.technicianCategories;
  //     this.filteredTechnicians = this.technicians;
  // }
  // clearTechnicianSelection()
  // {
  //   this.technicianAssignForm.controls['technicianName'].setValue('');
  //   this.technicianAssignForm.controls['technicianID'].setValue('');
  
  //   this.technicianSearchControl.setValue('');
  
  //   this.filteredTechnicians = this.technicians;
  
  //   this.isTechnicianDropdownOpen = false;
  // }
  // clearPropertySelection()
  // {
  //   this.technicianAssignForm.controls['propertyName'].setValue('');
  //   this.technicianAssignForm.controls['propertyID'].setValue('');
  
  //   this.technicianAssignForm.controls['tenantName'].setValue('');
  //   this.technicianAssignForm.controls['tenantID'].setValue('');
  
  //   this.technicianAssignForm.controls['complainName'].setValue('');
  //   this.technicianAssignForm.controls['complainID'].setValue('');
  
  //   this.isPropertyDropdownOpen = false;
  //   this.isTenantDropdownOpen = false;
  //   this.isComplainDropdownOpen = false;
  
  //   this.propertySearchControl.setValue('');
  //   this.tenantSearchControl.setValue('');
  //   this.complainSearchControl.setValue('');
  
  //   // this.filteredProperties = this.properties;
  //   // this.filteredTenants = this.tenants;
  //   // this.filteredComplains = this.complains;
  // }
  // clearTenantSelection()
  // {
  //   this.technicianAssignForm.controls['tenantName'].setValue('');
  //   this.technicianAssignForm.controls['tenantID'].setValue('');
  
  //   this.technicianAssignForm.controls['complainName'].setValue('');
  //   this.technicianAssignForm.controls['complainID'].setValue('');
  
  //   this.isTenantDropdownOpen = false;
  //   this.isComplainDropdownOpen = false;
  
  //   this.tenantSearchControl.setValue('');
  //   this.complainSearchControl.setValue('');
  
  //   // this.filteredTenants = this.tenants;
  //   // this.filteredComplains = this.complains;
  // }
  // clearComplainSelection()
  // {
  //   this.technicianAssignForm.controls['complainName'].setValue('');
  //   this.technicianAssignForm.controls['complainID'].setValue('');
  
  //   this.isComplainDropdownOpen = false;
  
  //   this.complainSearchControl.setValue('');
  // }
  selectCategory(event: Event): void {
    // console.log("selectCategory");
    const selectedId = (event.target as HTMLSelectElement).value;
    const selectedItem = this.technicianCategories.find(item => item.id === selectedId);
  
    if (selectedItem) {
      this.assignTechnicianForm.get('categoryID')?.setValue(selectedItem.id);
      // this.technicianAssignForm.get('technicianCategoryName')?.setValue(selectedItem.text);
      
      this.assignTechnicianForm.get('technicianID')?.setValue('');
      // this.technicianAssignForm.get('technicianName')?.setValue('');
  
      this.categoryId = selectedItem.id;
  
      this.getTechnicianByCategoryID(selectedItem.id);
  
      // this.categorySearchControl.setValue(selectedItem.text);
      // this.technicianSearchControl.setValue('');
  
      // this.isCategoryDropdownOpen = false;
      // this.isTechnicianDropdownOpen = false;
    }
  }
  selectTechnician(event: Event): void
  {
    const selectedId = (event.target as HTMLSelectElement).value;
    const selectedItem = this.technicians.find(item => item.id === selectedId);
    if(selectedItem){
        this.assignTechnicianForm.get('technicianID')?.setValue(selectedItem.id);
        // this.technicianAssignForm.get('technicianName')?.setValue(selectedItem.text);
        this.technicianId = selectedItem.id;
  
        this.technicianSearchControl.setValue(selectedItem.text);
        // this.getTechnicianByCategoryID(item.id);
        // this.landlordSearchControl.setValue(item.text);
        this.isTechnicianDropdownOpen = false;
      }
  }
  // selectProperty(event: Event): void
  // {
  //   const selectedId = (event.target as HTMLSelectElement).value;
  //   const selectedItem = this.properties.find(item => item.id === selectedId);
  // if(selectedItem){
  //   this.assignTechnicianForm.get('propertyID')?.setValue(selectedItem.id); 
  //   // this.technicianAssignForm.get('propertyName')?.setValue(selectedItem.text);
  //   this.assignTechnicianForm.get('tenantID')?.setValue('');
  //   // this.technicianAssignForm.get('tenantName')?.setValue('');
  //   this.assignTechnicianForm.get('complainID')?.setValue('');
  //   // this.technicianAssignForm.get('complainName')?.setValue('');
  
  //   this.propertyId = selectedItem.id;
  
  //   this.getTenants(selectedItem.id);
  //   // this.propertySearchControl.setValue(selectedItem.text);
  //   // this.tenantSearchControl.setValue('');
  //   // this.complainSearchControl.setValue('');
  
  //   // this.isPropertyDropdownOpen = false;
  //   // this.isTenantDropdownOpen = false;
  //   // this.isComplainDropdownOpen = false;
  // }
  // }
  // selectTenant(event:Event)
  // {
  //   // console.log("Tenant");
  //   const selectedId = (event.target as HTMLSelectElement).value;
  //   const selectedItem = this.tenants.find(item => item.id === selectedId);
  //   if(selectedItem){
  //     // this.tenantSearchControl.setValue(selectedItem.id);
  //     // this.complainSearchControl.setValue('');
  
  //     this.assignTechnicianForm.get('tenantID')?.setValue(selectedItem.id);
  //     // this.technicianAssignForm.get('tenantName')?.setValue(selectedItem.text);
  //     this.assignTechnicianForm.get('complainID')?.setValue('');
  //     // this.technicianAssignForm.get('complainName')?.setValue('');
  
  //     this.tenantId =selectedItem.id;
  //     console.log("Tenant");
  //     this.getComplains(selectedItem.id);
  
  //     // this.isTenantDropdownOpen = false;
  //     // this.isComplainDropdownOpen = false;
  //   }
  // }
  
  // selectComplain(item:{id: string; text:string})
  // {
  //   this.assignTechnicianForm.get('complainID')?.setValue(item.id);
  //   // this.technicianAssignForm.get('complainName')?.setValue(item.text);
  
  //   // this.complainSearchControl.setValue(item.text);
  //   // this.isComplainDropdownOpen = false;
  // }
  
  // searchCategory() {
  //   this.categorySearchControl.valueChanges.subscribe((value: any) => {
  //     this.filterCategory(value);
  //   });
  // }
  
  // filteredCategories:any[]=[];
  // filterCategory(value: string): void {
  //   const filterValue = value.toLowerCase(); 
  //   this.filteredCategories= this.technicianCategories.filter((category) =>
  //     category.id.toLowerCase().includes(filterValue) || 
  //     category.text.toLowerCase().includes(filterValue) 
  //   );
  
  //   }
    // searchTechnician() {
    //   this.technicianSearchControl.valueChanges.subscribe((value: any) => {
    //     this.filterTechnician(value);
    //   });
    // }
    // filteredTechnicians:any[]=[];
    // filterTechnician(value: string): void {
    //   const filterValue = value.toLowerCase(); 
    //   this.filteredTechnicians= this.technicians.filter((technician) =>
    //     technician.id.toLowerCase().includes(filterValue) || 
    //     technician.text.toLowerCase().includes(filterValue) 
    //   );
    //   }
    // searchProperty() {
    //     this.propertySearchControl.valueChanges.subscribe((value: any) => {
    //       this.filterProperty(value);
    //     });
    //   }
    // filteredProperties:any[]=[];
    // filterProperty(value: string): void {
    //   const filterValue = value.toLowerCase(); 
    //   this.filteredProperties= this.properties.filter((property) =>
    //     property.id.toLowerCase().includes(filterValue) || 
    //     property.text.toLowerCase().includes(filterValue) 
    //   );
    //   }
    // searchTenant() {
    //     this.tenantSearchControl.valueChanges.subscribe((value: any) => {
    //       this.filterTenant(value);
    //     });
    //   }
    // filteredTenants:any[]=[];
    // filterTenant(value: string): void {
    //       const filterValue = value.toLowerCase();
    //       this.filteredTenants= this.tenants.filter((tenant) =>
    //         tenant.id.toLowerCase().includes(filterValue) || 
    //         tenant.text.toLowerCase().includes(filterValue) 
    //       );
    //   }
    // filteredComplains:any[]=[];
    // filterComplain(value: string): void {
    //     const filterValue = value.toLowerCase(); 
    //     this.filteredComplains= this.complains.filter((complain) =>
    //       complain.id.toLowerCase().includes(filterValue) || 
    //       complain.text.toLowerCase().includes(filterValue) 
    //     );
    //   }
    // searchComplain() {
    //   this.complainSearchControl.valueChanges.subscribe((value: any) => {
    //     this.filterComplain(value);
    //   });
    // }
    // complains: any[]=[];
    // getComplains(tenantId: any)
    // {
    //   // console.log("complains");
    //   const agency_id = this.sessionAgencyID;
    //   this.complainService.getComplainsExtension(agency_id,this.propertyId,tenantId) .then((response: any) => {
    //     // console.log("responsecomplain",response);
    //     const resData = response.data || [];
    //     this.complains = resData.map((complain: any) => ({
    //       id: complain.id.toString(),
    //       text: complain.text,
    //     }));   
        
    //     // this.filteredComplains = this.complains;    
    //   })
    //   .catch((error: any) => {
    //     console.error("Error fetching complains:", error);
    //   });
    // }
  // tenants: any[]=[];
  // getTenants(propertyId:any)
  // {
  //   const agency_id = this.sessionAgencyID;
  //     this.tenantService.getTenantsExtension(propertyId,agency_id) .then((response: any) => {
  //       const resData = response.data || [];
  //       this.tenants = resData.map((tenant: any) => ({
  //         id: tenant.id.toString(),
  //         text: tenant.text,
  //       }));   
        
  //       // this.filteredTenants = this.tenants;    
  //     })
  //     .catch((error: any) => {
  //       console.error("Error fetching tenants:", error);
  //     });
  // }
  
  // getProperties()
  // {
  //   const agency_id = this.sessionAgencyID;
  //   if (!agency_id) {
  //     console.error("Error: AgencyID is not available.");
  //     return;
  //   }
  //   const property_id = '';
  //   this.tenantService.getPropertiesExtension<any[]>(property_id, agency_id)
  //     .then((response: any) => {
  //       const resData = response.data || [];
  //       this.properties = resData.map((property: any) => ({
  //         id: property.id.toString(),
  //         text: property.text,
  //       }));   
        
  //       // this.filteredProperties= this.properties;    
  //     })
  //     .catch((error: any) => {
  //       console.error("Error fetching property:", error);
  //     });
  // }
  getTechnicianCategories()
  {
    const categoryID = this.assignTechnicianForm.controls['categoryID'].value || '';
        const agencyID = this.sessionAgencyID;
        if (!agencyID) {
          console.error("Error: agencyID is not available.");
          return;
        }
        this.technicianService.getTechnicianCategoriesExtension<any[]>(categoryID, agencyID)
          .then((response: any) => {
            const resData = response.data || [];
            this.technicianCategories = resData.map((tech: any) => ({
              id: tech.id.toString(),
              text: tech.text,
            }));
            // this.filteredCategories = this.technicianCategories;      
          })
          .catch((error: any) => {
            console.error("Error fetching technician category:", error);
       });
  }
  technicians: any[] = [];
  getTechnicianByCategoryID(categoryID: any)
  {
    let params = this.assignTechnicianForm.value;
    const agencyID = this.sessionAgencyID;
        if (!agencyID) {
          console.error("Error: agencyID is not available.");
          return;
       }
  
       this.technicianService.getTechniciansInfo(params).subscribe((response: any) => {
        const resData = response?.body?.data?.list || [];
        this.technicians = resData.map((tech: any) => ({
          id: tech.technicianID,
          text: tech.technicianName,
        }));
        // this.filteredTechnicians = this.filteredTechnicians; 
        // console.log("technicians",this.technicians);
        // this.filteredTechnicianCategories = this.technicianCategories;      
      },
      (error: any) => {
        console.error("Error fetching technicians:", error);
   });
  }
  onSubmit()
  {
    if (this.assignTechnicianForm.valid) {
      const formValue = this.assignTechnicianForm.value;
    
      this.technicianAssignService.insert(formValue).subscribe({
    
          next: (response: any) => {             
            if (response?.data?.status) {
              this.notifyService.showMessage('success', 'Technician has been successfully Assigned.');
              this.router.navigate(['/complain']);
              // this.getLandloards();    
              // this.assignTechnicianFormInit();
            }
          },
          error: (error: any) => {
            this.notifyService.showMessage('error', 'Failed to Assign Technician! Please try again.');      
          }
        });
      } else {
        this.notifyService.showMessage('warning', 'Form is invalid! Please correct the errors in the form.');
      
      }
      this.assignTechnicianFormInit();
  }
}
