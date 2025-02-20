import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

const loginMaterial = [
  CommonModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule
]


@NgModule({
  declarations: [],
  imports: [
    loginMaterial
  ],
  exports: [
    loginMaterial
  ]
})
export class LoginMatModule { }
