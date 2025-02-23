import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifyService } from '../../../../services/notify-services/notify.service';
import { ComplainService } from '../../../complain/complain.service';
import { SegmentService } from '../../../segment/segment.service';



@Component({
  selector: 'app-tenant-edit-complain',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tenant-edit-complain.component.html',
  styleUrl: './tenant-edit-complain.component.scss'
})
export class TenantEditComplainComponent implements OnInit{
  @Output() childToParent = new EventEmitter<any>();

  @Input() complaintData: any;
  @Input() imagedata: any;
  @Input() actualFileNames: any;
  @Input() index: any;

  sessionAgencyID: any;
  sessionTenantID: any;
  sessionPropertyID: any;
  sessionLandlordID: any;

  complainForm!: FormGroup;

  imagePreviews: any[]=[];
  selectedFiles: File[] = [];

  maxFileSizeKB = 300;
  allowedFormats = ['image/jpeg', 'image/png', 'image/gif','image/jpg'];

  constructor(private fb: FormBuilder, private router: Router, private segmentService: SegmentService,
    private notifyService: NotifyService, private complainService: ComplainService, private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.getUserLoginData();
    this.sessionAgencyID = this.userLoginData.agencyID;
    this.sessionTenantID = this.userLoginData.tenantID;
    this.sessionPropertyID = this.userLoginData.propertyID;
    this.sessionLandlordID = this.userLoginData.landlordID;
    this.initializeForm();
    this.loadSegments();
    setTimeout(() => {
      const defaultSegment = this.filteredSegments.find(segment => segment.id === this.complaintData?.segmentID);
      if (defaultSegment) {
        this.complainForm.get('segmentID')?.setValue(defaultSegment.id);
      }
    }, 500);
    this.loadExistingImages();
    this.adjustInitialHeight();
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

  isSegmentDropdownOpen: boolean=false;
  segmentToggleDropdown(): void {
    this.isSegmentDropdownOpen = !this.isSegmentDropdownOpen;
  }
  images: { src: string, file: File, name: string, size: string, format: string }[][]= [];
  allFiles: File [][]=[];
  initializeForm() {
    this.complainForm = this.fb.group({
      propertyID: new FormControl(this.complaintData?.propertyID || '', [Validators.required]),
      segmentID: new FormControl(this.complaintData?.segmentID || '', [Validators.required]),
      complainID: new FormControl(this.complaintData?.complainID || '',[Validators.required]),
      updatedBy: new FormControl(this.complaintData?.tenantID||'',[Validators.required]),
      complainName: new FormControl(this.complaintData?.complainName || '', [Validators.required]),
      description: new FormControl(this.complaintData?.description || ''),
      isActive: new FormControl(this.complaintData?.isActive ?? true),
      isApproved: new FormControl(this.complaintData?.isApproved ?? false),
      isSolved: new FormControl(this.complaintData?.isSolved ?? false),
      stateStatus: new FormControl(this.complaintData?.stateStatus || 'Pending'),
      activationStatus: new FormControl(this.complaintData?.activationStatus || 'Active'),
      images: new FormControl(this.complaintData?.images || []), // Include images in the form
    });
  
    // If the complaint contains images, populate the preview array
    this.images = this.complaintData?.images?.map((img:any) => ({
      src: img.url, // Assuming `url` contains the image preview link
      file: null, // Set file as null initially
      name: img.name,
      size: img.size,
      format: img.format,
    })) || [];


  }
  
      loadExistingImages() {
        if (this.imagedata && this.imagedata.length) {
          this.imagePreviews = [...this.imagedata]; // Use the Blob URLs directly
        }
        this.loadInitialImages(0);
        
      }
      async loadInitialImages(index:number) {
        const dataTransfer = new DataTransfer();
    
        for (let i = 0; i < this.imagedata.length; i++) {
          const url = this.imagedata[i];
        if (!Array.isArray(this.images[index])) {
          this.images[index] = []; 
        }
    
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], `${ this.actualFileNames[this.index][i]}`, { type: blob.type });
    
            this.selectedFiles.push(file); // Store in array
            dataTransfer.items.add(file);
            const reader = new FileReader();

            reader.onload = (e: any) => {
              this.images[index].push({
                src: e.target.result,
                file,
                name: file.name,
                size: `${((file.size)/1024).toFixed(2)} KB`,
                format: file.type,
              });
              this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
          } catch (error) {
            console.error('Error loading image:', error);
          }
        }
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.files = dataTransfer.files;
        // console.log("selectedFiles",this.selectedFiles);
      }

      // onFileSelected(event: Event) {
      //   const target = event.target as HTMLInputElement;
      //   if (!target.files || target.files.length === 0) return;
    
      //   const dataTransfer = new DataTransfer();
    
      //   // Keep previous images
      //   this.selectedFiles.forEach(file => dataTransfer.items.add(file));
    
      //   // Add new images to selection
      //   for (let i = 0; i < target.files.length; i++) {
      //     const file = target.files[i];
      //     const duplicate = this.actualFileNames[this.index].some((name:any) => name === file.name);
      //     if (duplicate) {
      //       alert(`The image "${file.name}" is already selected.`);
      //       continue;
      //     }
      //     const fileSizeKB = (file.size)/1024;
      //     const fileFormat = file.type;

      //     if (!this.allowedFormats.includes(fileFormat)) {
      //       alert(`Invalid file format: ${file.name}. Only JPEG, PNG, and GIF are allowed.`);
      //       continue;
      //     }
    
      //     if (fileSizeKB > this.maxFileSizeKB) {
      //       alert(`File size exceeds the limit of ${this.maxFileSizeKB} KB: ${file.name}.`);
      //       continue;
      //     }
      //     this.selectedFiles.push(file);
      //     this.actualFileNames[this.index].push(file.name);
      //     dataTransfer.items.add(file);
    
      //     // Show preview of new images
      //     const reader = new FileReader();
      //     reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      //     reader.readAsDataURL(file);
      //   }
    
      //   // Update the input field with the combined files
      //   target.files = dataTransfer.files;
      //   // console.log("selectedFiles2", this.selectedFiles);
      // }
      onFileSelected(event: any, index: number): void {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;
        const files = target.files;
        const dataTransfer = new DataTransfer();
    
        //   // Keep previous images
          this.selectedFiles.forEach(file => dataTransfer.items.add(file));
      
          if (!Array.isArray(this.images[index])) {
            this.images[index] = []; 
          }

        for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const duplicate = this.actualFileNames[this.index].some((name:any) => name === file.name);
              if (duplicate) {
                alert(`The image "${file.name}" is already selected.`);
                continue;
              }
              const fileSizeKB = (file.size)/1024;
              const fileFormat = file.type;
    
              if (!this.allowedFormats.includes(fileFormat)) {
                alert(`Invalid file format: ${file.name}. Only JPEG, PNG, and GIF are allowed.`);
                continue;
              }
        
              if (fileSizeKB > this.maxFileSizeKB) {
                alert(`File size exceeds the limit of ${this.maxFileSizeKB} KB: ${file.name}.`);
                continue;
              }
              this.selectedFiles.push(file);
              this.actualFileNames[this.index].push(file.name);
              dataTransfer.items.add(file);
        
              // Show preview of new images
              const reader = new FileReader();

            reader.onload = (e: any) => {
              this.imagePreviews.push(e.target.result);
              this.images[index].push({
                src: e.target.result,
                file,
                name: file.name,
                size: `${fileSizeKB.toFixed(2)} KB`,
                format: fileFormat,
              });
              this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
            target.files = dataTransfer.files;
          }
          console.log("images",this.images);
      }  

    allowedFormatsForInputField = ['.jpeg', '.png', '.gif', '.jpg'];

    get acceptedFormats(): string {
        return this.allowedFormatsForInputField.join(', ');
    }

    removeImage(index: number, imageindex: number) {
    this.imagePreviews.splice(imageindex, 1); // Remove from UI
    this.images[index].splice(imageindex, 1);
    this.selectedFiles.splice(imageindex, 1); // Remove from array
    this.actualFileNames[this.index].splice(imageindex,1);
    console.log("actualFileNames", this.actualFileNames);

    // Update file input after removal
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach(file => dataTransfer.items.add(file));

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.files = dataTransfer.files;
    // console.log("selectedFiles2",this.selectedFiles);
  }
  adjustInitialHeight()
  {
    setTimeout(() => {
      const textarea = document.getElementById('complainName') as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, 0);
  }
  // get complains(): FormArray {
  //   return this.complainForm.get('complains') as FormArray;
  // }
  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  // prepareImageData() {
  //   const updatedComplains = this.complains.controls.map((control, index) => {
  //     const complain = control.value;
  
  //     // Add images to this specific complain
  //     complain.images = this.images[index]?.map((img) => img.file) || [];
  //     // console.log(complain.images);
  //     return complain;
  //   });
  
    // Update the complains array in the form
  //   this.complainForm.get('complains')?.setValue(updatedComplains);
  // }
  submit(): void {
    // this.prepareImageData();
    if (this.complainForm.valid) {
      const formValue = this.complainForm.value;
      const formData = new FormData();
  
      // Append form fields
      for (const key in formValue) {
        if (key !== 'images' && formValue.hasOwnProperty(key)) {
          formData.append(`${key}`, formValue[key]);
        }
      }
  
      // Append images
      this.images[0].forEach((image, index) => {
        if (image.file) {
          formData.append(`images`, image.file);
        }
      });
      // console.log(formData);
      // return;
      // Call API for update
      this.complainService.update(formData).subscribe({
        next: (response: any) => {
          console.log("response",response);
          if (response?.data?.status) {
            this.notifyService.showMessage('success', 'Complaint updated successfully.');
            this.childToParent.emit();
          }
        },
        error: () => {
          this.notifyService.showMessage('error', 'Failed to update the complaint.');
        },
      });
    } else {
      this.complainForm.markAllAsTouched();
      console.error('Form is invalid.');
    }
  }  


}
