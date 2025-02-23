import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-complain',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-complain.component.html',
  styleUrl: './edit-complain.component.scss'
})
export class EditComplainComponent {
  complainForm!: FormGroup;
  complaintData: any;
  imagedata: any;
  imagePreviews: any[]=[];
  selectedFiles: File[] = [];
  actualFileNames: any[][][]=[];
  complaininfoindex: any;
  complainindex:any;

  maxFileSizeKB = 300;


  segments = [
    { id: 'S0006', text: 'Bedroom' },
    { id: 'S0007', text: 'Living Room' },
    { id: 'S0008', text: 'Kitchen' },
  ];

  constructor(private fb: FormBuilder, private router: Router) {

  }
  ngOnInit() {
    // Retrieve data from navigation state
    if (history.state && history.state.complaintData) {
      this.complaintData = history.state.complaintData;
      this.imagedata = history.state.images;
      this.actualFileNames = history.state.actualFileNames;
      this.complaininfoindex = history.state.complaininfoindex;
      this.complainindex = history.state.complainindex;
      // console.log("complainData",this.complaintData);
      // console.log("imagedata",this.imagedata);
      // console.log("actualFileNames",this.actualFileNames[this.complaininfoindex][this.complainindex]);
      this.initializeForm();
      this.loadExistingImages();
    } else {
      console.warn("No complaint data found!");
    }
    // console.log("complainForm",this.complainForm);
    this.adjustInitialHeight();
    // console.log("complainform",this.complainForm);
  }
  initializeForm()
  {
       this.complainForm =  this.fb.group({
          propertyID: new FormControl(this.complaintData?.propertyID || '', [Validators.required]),
          segmentID: new FormControl(this.complaintData?.segmentID || '', [Validators.required]),
          complainName: new FormControl(this.complaintData?.complainName|| '', [Validators.required]),
          description: new FormControl('description'),
          isActive: new FormControl(true),
          isApproved: new FormControl(false),
          isSolved: new FormControl(false),
          stateStatus: new FormControl('Pending'),
          activationStatus: new FormControl('Active'),
          images: new FormControl([]),
        });
      }
      loadExistingImages() {
        if (this.imagedata && this.imagedata.length) {
          this.imagePreviews = [...this.imagedata]; // Use the Blob URLs directly
        }
        this.loadInitialImages();
        
      }
      async loadInitialImages() {
        const dataTransfer = new DataTransfer();
    
        for (let i = 0; i < this.imagedata.length; i++) {
          const url = this.imagedata[i];
    
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], `${ this.actualFileNames[this.complaininfoindex][this.complainindex][i]}`, { type: blob.type });
    
            this.selectedFiles.push(file); // Store in array
            dataTransfer.items.add(file);
          } catch (error) {
            console.error('Error loading image:', error);
          }
        }
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.files = dataTransfer.files;
        // console.log("selectedFiles",this.selectedFiles);
      }

      onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files || target.files.length === 0) return;
    
        const dataTransfer = new DataTransfer();
    
        // Keep previous images
        this.selectedFiles.forEach(file => dataTransfer.items.add(file));
    
        // Add new images to selection
        for (let i = 0; i < target.files.length; i++) {
          const file = target.files[i];
          const duplicate = this.actualFileNames[this.complaininfoindex][this.complainindex].some(name => name === file.name);
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
          this.actualFileNames[this.complaininfoindex][this.complainindex].push(file.name);
          dataTransfer.items.add(file);
    
          // Show preview of new images
          const reader = new FileReader();
          reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
          reader.readAsDataURL(file);
        }
    
        // Update the input field with the combined files
        target.files = dataTransfer.files;
        // console.log("selectedFiles2", this.selectedFiles);
      }

    allowedFormats = ['image/jpeg', 'image/png', 'image/gif','image/jpg'];
    allowedFormatsForInputField = ['.jpeg', '.png', '.gif', '.jpg'];

    get acceptedFormats(): string {
        return this.allowedFormatsForInputField.join(', ');
    }

     removeImage(index: number) {
    this.imagePreviews.splice(index, 1); // Remove from UI
    this.selectedFiles.splice(index, 1); // Remove from array
    this.actualFileNames[this.complaininfoindex][this.complainindex].splice(index,1);

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
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on content
      }
    }, 0);
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to content height
  }
}
