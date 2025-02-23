import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComplainService } from '../../../complain/complain.service';
import { NotifyService } from '../../../../services/notify-services/notify.service';
import { TenantService } from '../../tenant.service';
import { SegmentService } from '../../../segment/segment.service';
import { UserService } from '../../../../services/user-services/user.service';
import { ModalService } from '../../../../services/modal-services/modal.service';


@Component({
  selector: 'app-tenant-add-complain',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tenant-add-complain.component.html',
  styleUrl: './tenant-add-complain.component.scss'
})
export class TenantAddComplainComponent implements OnInit{
 @Output() childToParent = new EventEmitter<any>();
@ViewChildren('complainFormDiv') complainFormDivs!: QueryList<ElementRef>;


onSegmentChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement; // Cast the target as HTMLSelectElement
  const selectedId = selectElement.value; // Get the value of the selected option
  const selectedText = selectElement.options[selectElement.selectedIndex].text; // Get the text of the selected option

  // Pass the mapped object to the selectSegment function
  this.selectSegment({ id: selectedId, text: selectedText });
}
//tempend


 images: { src: string, file: File, name: string, size: string, format: string }[][]= [];

  allowedFormats = ['image/jpeg', 'image/png', 'image/gif','image/jpg'];
  allowedFormatsForInputField = ['.jpeg', '.png', '.gif', '.jpg'];

  maxFileSizeKB = 300;

  complainForm!: FormGroup;

  sessionAgencyID: any;
  sessionTenantID: any;
  sessionPropertyID: any;
  sessionLandlordID: any;


  isPropertyDropdownOpen = false; 
  isSegmentDropdownOpen = false;
  showPropertyInvalid = false;

  allFiles: File [][]=[];  
 constructor(private fb: FormBuilder, private complainService:ComplainService, private notifyService: NotifyService, private modalService: ModalService, 
       private tenantService:TenantService, private segmentService:SegmentService, public userService: UserService, private cdr: ChangeDetectorRef) 
       {
     }
  get acceptedFormats(): string {
      return this.allowedFormatsForInputField.join(', ');
  }
     ngOnInit(): void {
      this.getUserLoginData();
      this.sessionAgencyID = this.userLoginData.agencyID;
      this.sessionTenantID = this.userLoginData.tenantID;
      this.sessionPropertyID = this.userLoginData.propertyID;
      this.sessionLandlordID = this.userLoginData.landlordID;
      this.initializeComplainForm();
      this.addComplain();
      this.loadSegments();
      // const complainsArray = this.complainForm.get('complains') as FormArray;
  
      // console.log("complainsArrayInitially",complainsArray.length);
      // return;
     
      // this.loadProperties();
      // this.searchLandlord();
      // this.searchProperty();
      // this.searchSegment();
      // this.addComplain();
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
    createComplainForm(): FormGroup{
      return this.fb.group({
        segmentID: new FormControl('', [Validators.required]),
        tenantID: new FormControl(this.sessionTenantID),
        complainName: new FormControl('', [Validators.required]),
        description: new FormControl('description'),
        isActive: new FormControl(true),
        isApproved: new FormControl(false),
        isSolved: new FormControl(false),
        stateStatus: new FormControl('Pending'),
        activationStatus: new FormControl('Active'),
        images: new FormControl([]),
      });
 
  }

  initializeComplainForm(): void {
    this.complainForm = this.fb.group({
      complainInfoForm: this.fb.group({
        id: new FormControl(0),  
        complainInfoID: new FormControl(''),
        agencyID: new FormControl(this.sessionAgencyID),
        propertyID: new FormControl(this.sessionPropertyID),
        landlordID: new FormControl(this.sessionLandlordID),
        tenantID: new FormControl(this.sessionTenantID),
        stateStatus: new FormControl('Pending'),
      }),
      complains: this.fb.array([]),
    });

  }
  get complains(): FormArray {
    return this.complainForm.get('complains') as FormArray;
  }
  addComplain(): void {
    this.complains.push(this.createComplainForm());  
    this.cdr.detectChanges();
    setTimeout(() => {
      const lastFormDiv = this.complainFormDivs.last;
      if (lastFormDiv) {
        lastFormDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
  removeComplain(index: number): void {
    if(this.complains.length>1)
      this.complains.removeAt(index);
  }
  ddlProperties: any[] = [];
  loadProperties()
  {         
    const agencyID = this.sessionAgencyID;
    if (!agencyID) {
      console.error("Error: agencyID is not available.");
      return;
    }
    const propertyID = ''; 
  
    this.tenantService.getPropertiesExtension<any[]>(propertyID, agencyID)
      .then((response: any) => {
        const resData = response.data || [];
        this.ddlProperties = resData.map((property: any) => ({
          id: property.id.toString(),
          text: property.text,
        }));  
        this.filteredProperties = this.ddlProperties;            
      })
      .catch((error: any) => {
        console.error("Error fetching properties:", error);
      });
  }
  filteredProperties: any[] = [];
        filterProperty(value: string): void {
          const filterValue = value.toLowerCase(); // Convert to lowercase for case-insensitive filtering
          this.filteredProperties = this.ddlProperties.filter((property) =>
            property.id.toLowerCase().includes(filterValue) || 
            property.text.toLowerCase().includes(filterValue) // Allow searching by both ID and name
          );
  }


  ddlSegments: any[]=[];
  filteredSegments: any[]=[];

  loadSegments():void{
    const segment_id = '';   
    const agency_id = this.sessionAgencyID;   
    this.filteredSegments = [];
    if (!agency_id) {
      console.error("Error: AgencyID is not available.");
      return;
    }    
    this.segmentService.getSegmentsExtension<any[]>(segment_id, this.sessionAgencyID, this.sessionLandlordID, this.sessionPropertyID)
      .then((response: any) => {
        const resData = response.data || [];
        this.ddlSegments = resData.map((segment: any) => ({
          id: segment.id.toString(),
          text: segment.text,
        }));   
        
        this.filteredSegments = this.ddlSegments;    
      })
      .catch((error: any) => {
        console.error("Error fetching segment:", error);
      });
  }

  segmentToggleDropdown(): void {
    this.isSegmentDropdownOpen = !this.isSegmentDropdownOpen;
  }

  clearSegmentSelection(): void {
    this.complainForm.controls['segmentID'].setValue('');
    this.complainForm.controls['segmentName'].setValue('');
  
    // this.segmentSearchControl.setValue('');
    // this.isSegmentDropdownOpen = false;  
    // this.filteredSegments = this.ddlSegments;     
    // this._segmentID = '';
  }

  selectSegment(item: { id: string; text: string }): void {
    this.complainForm.get('segmentID')?.setValue(item.id);
    this.complainForm.get('segmentName')?.setValue(item.text);   
    // this.segmentSearchControl.setValue(item.text);
    this.isSegmentDropdownOpen = false;

    // this._segmentID = item.id;
  }

  onFileSelected(event: any, index: any): void {
    var files = event.target.files;
    if (!this.allFiles[index]) {
      this.allFiles[index] = [];
    }
    // this.allFiles[index] = [...this.allFiles[index], ...files];
    const dataTransfer = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const duplicate = this.images[index]?.some(image => image.file.name === file.name);
      if (duplicate) {
        alert(`The image "${file.name}" is already selected.`);
        continue;
      }
      this.allFiles[index] = [...this.allFiles[index],file];
      const fileSizeKB = (file.size)/1024;
      const fileFormat = file.type;
      // console.log("Name: "+file.name+" Size: "+fileSizeKB+" Kb"+" Format: "+fileFormat);
      // Validate file format
      if (!this.allowedFormats.includes(fileFormat)) {
        alert(`Invalid file format: ${file.name}. Only JPEG, PNG, and GIF are allowed.`);
        continue;
      }

      //Validate file size
      if (fileSizeKB > this.maxFileSizeKB) {
        alert(`File size exceeds the limit of ${this.maxFileSizeKB} KB: ${file.name}.`);
        continue;
      }

      // Check for duplicate files
      if(!this.images[index])
      {
        this.images[index] = [];
      }

      const reader = new FileReader();
      // console.log("before",this.images);
      reader.onload = (e: any) => {
        this.images[index].push({
          src: e.target.result,
          file,
          name: file.name,
          size: fileSizeKB.toFixed(2) + 'KB',
          format: fileFormat,
        });
        this.cdr.detectChanges();
      };
      // console.log("after",this.images);
      reader.readAsDataURL(file);
    }
    this.allFiles[index]?.forEach((file) => {
    dataTransfer.items.add(file); // Add all files to the DataTransfer object
    });

    const input = document.getElementById('fileInput'+index) as HTMLInputElement;
    if (input) {
      input.files = dataTransfer.files; // Sync the input field's files
    }

    this.cdr.detectChanges();
  }
  removeImage(index: number, imageindex: number): void {
    const dataTransfer = new DataTransfer();
    this.images[index].splice(imageindex, 1);
    this.allFiles[index].splice(imageindex, 1); 

    this.allFiles[index].forEach((file) => {
      dataTransfer.items.add(file); // Rebuild the FileList
    });

    const input = document.getElementById('fileInput'+index) as HTMLInputElement;
    if (input) {
      input.files = dataTransfer.files; // Sync the input field's files
    }

    this.cdr.detectChanges();
  }
  // createFileList(files: File[]): FileList {
  //   const dataTransfer = new DataTransfer();
  //   files.forEach(file => dataTransfer.items.add(file));
  //   return dataTransfer.files; // Return updated FileList
  // }

  prepareImageData() {
    // const imageData = this.images.map(imageArray => {
    //   return imageArray.map(img => ({
    //     file: img.file,
    //     fileName: img.name,
    //     fileSize: img.size,
    //     fileFormat: img.format
    //   }));
    // });
  
    // this.complainForm.get('images')?.setValue(imageData);
    // Map the images array into the form's complains array
    // console.log("allfiles",this.allFiles);
    // console.log("images",this.images);
  const updatedComplains = this.complains.controls.map((control, index) => {
    const complain = control.value;

    // Add images to this specific complain
    complain.images = this.images[index]?.map((img) => img.file) || [];
    // console.log(complain.images);
    return complain;
  });

  // Update the complains array in the form
  this.complainForm.get('complains')?.setValue(updatedComplains);
  }
  
  submit(): void {
    // this.prepareImageData(); // Presumably preparing or validating image data
  
    // if (this.complainForm.valid) {
    //   // Get the form value and create FormData
    //   const formValue = this.complainForm.value;
    //   const formData = new FormData();
  
    //   // Append complainInfoForm values (like agencyID, landlordID, etc.)
    //   for (const key in formValue.complainInfoForm) {
    //     if (formValue.complainInfo.hasOwnProperty(key)) {
    //       formData.append(`complainInfoForm.${key}`, formValue.complainInfoForm[key]);
    //     }
    //   }
  
    //   // Process each complain in the complains array
    //   formValue.complains.forEach((complain: any, index: number) => {
    //     for (const key in complain) {
    //       if (complain.hasOwnProperty(key)) {
    //         formData.append(`complains[${index}].${key}`, complain[key]);
    //       }
    //     }
  
    //     // Process and append images for each complain in the correct structure
    //     complain.images.forEach((image: any, imageIndex: number) => {
    //       // If image is a File (binary data from input)
    //       if (image instanceof File || image instanceof Blob) {
    //         // Append the image with a proper key and filename
    //         formData.append(`complains[${index}].images[${imageIndex}]`, image, `image_${index}_${imageIndex}.jpg`);
    //       } else {
    //         console.warn('Unexpected image type:', image);
    //       }
    //     });
    //   });
  
    //   // Optional: Append additional files, if necessary
    //   this.allFiles.forEach((image: any) => {
    //     for (let i = 0; i < image.length; i++) {
    //       formData.append('File', image[i]);
    //     }
    //   });
  
    //   // Debug: Log the FormData to check its structure
    //   console.log('FormData structure:', formData);
  
    //   // Send the form data to the service for API insertion
    //   this.complainService.insert(formData).subscribe({
    //     next: (response: any) => {
    //       if (response?.data?.status) {
    //         // Reset form and show success message
    //         this.initializeComplainForm();
    //         this.notifyService.showMessage('success', 'Successfully complained. Please wait for further action.');
    //         this.loadProperties();
    //       }
    //     },
    //     error: (error: any) => {
    //       this.notifyService.showMessage('error', 'Failed to complain! Please try again.');
    //     }
    //   });
    // } else {
    //   // Handle form validation errors
    //   this.showPropertyInvalid = true;
    //   console.log('Form is invalid. Please fill out all required fields correctly.');
    //   this.complainForm.markAllAsTouched();
    // }
    this.prepareImageData(); // Map image data to the form

    if (this.complainForm.valid) {
      const formValue = this.complainForm.value;
      console.log("formValue ", this.complainForm.value);
      const formData = new FormData();
  
      // Append complainInfo values
      for (const key in formValue.complainInfoForm) {
        if (formValue.complainInfoForm.hasOwnProperty(key)) {
          formData.append(`complainInfo.${key}`, formValue.complainInfoForm[key]);
        }
      }
  
      // Append complains array
      formValue.complains.forEach((complain: any, index: number) => {
        for (const key in complain) {
          if (key !== 'images' && complain.hasOwnProperty(key)) {
            formData.append(`complains[${index}].${key}`, complain[key]);
            // console.log("form", `complains[${index}].${key}`, complain[key]);
          }
        }
  
        // Append images for each complain
        complain.images.forEach((image: File, imageIndex: number) => {
          formData.append(`complains[${index}].images`, image);
          // console.log("image",image);
          // console.log("imageindex",imageIndex);
          // console.log("formdataappend", `complains[${index}].images[${imageIndex}]`, image);
        });
      });
  
      // Debug: Log the FormData to verify its structure
      // console.log('FormData structure:', formData);
  
      // Submit form data via the service
      this.complainService.insert(formData).subscribe({
        next: (response: any) => {
          if (response?.data?.status) {
            this.notifyService.showMessage('success', 'Complaint submitted successfully.');
            this.initializeComplainForm();
            this.addComplain();
            this.images = [];
            this.allFiles = [];
            // this.loadProperties();
          }
        },
        error: (error: any) => {
          this.notifyService.showMessage('error', 'Failed to submit the complaint.');
        },
      });
    } else {
      this.complainForm.markAllAsTouched();
      console.error('Form is invalid.');
    }
  }
  

  // searchProperty() {
  //   this.propertySearchControl.valueChanges.subscribe((value: any) => {
  //     this.filterProperty(value);
  //   });
  //   }
  //   searchSegment() {
  //     this.segmentSearchControl.valueChanges.subscribe((value: any) => {
  //       this.filterSegment(value);
  //     });
  //     }
      
  //     filterSegment(value: string): void {
  //     const filterValue = value.toLowerCase();
  //     this.filteredSegments = this.ddlSegments.filter((segment) =>
  //       segment.id.toLowerCase().includes(filterValue) || 
  //       segment.text.toLowerCase().includes(filterValue)
  //     );
  //    }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to content height
  }

}
