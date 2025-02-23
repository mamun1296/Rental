import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agency-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agency-edit.component.html',
  styleUrl: './agency-edit.component.scss'
})
export class AgencyEditComponent implements OnInit{

  @Input() Id : any;
  sessionAgencyID: any;
  agencyForm!: FormGroup;
  constructor(private fb:FormBuilder)
  {

  }
  ngOnInit(): void { 
    this.fetchFormData();
    this.getUserLoginData();
    this.sessionAgencyID = this.userLoginData.agencyID;
   this.getAgencyInfo(this.sessionAgencyID);
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
  getAgencyInfo(sessionAgencyID: any)
  {

  }
  
  fetchFormData()
  {
    this.agencyForm = this.fb.group({
      id: new FormControl(0),
      agencyName: new FormControl('Trust Bd',[Validators.required, Validators.min(3)]),
      agencyEmail: new FormControl('trustbd@gmail.com', [Validators.required, Validators.email]),
      agencyPrimaryContact: new FormControl('01222222222',[Validators.required]),
      agencySecondaryContact: new FormControl(''),
      agencyNID: new FormControl(''),
      agencyPresentAddress: new FormControl(''),
      agencyPermanentAddress: new FormControl(''),
      agencyTradeLicense: new FormControl(''),
    })
  }

}
