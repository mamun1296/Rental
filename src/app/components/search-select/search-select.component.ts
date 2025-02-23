import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-search-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatTooltip
  ],
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss']
})
export class SearchSelectComponent implements OnInit {
  @Input() options: { [key: string]: any }[] = [];
  @Input() idProperty: string = 'id';
  @Input() valueProperty: string = 'value';
  @Input() placeholder: string = 'Select an option';
  // @Input() selectedId: any;
  @Input() dropdownDirection: 'up' | 'down' = 'down'; 

  @Output() selectedIdChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() optionSelected = new EventEmitter<{ option: any, index: number }>(); // New Output for selected option and index

  filteredOptions: { [key: string]: any }[] = [];
  searchControl = new FormControl('');
  dropdownOpen: boolean = false;

  selectedId: any;

  
  ngOnInit() {
    console.log('Received options in SearchSelectComponent:', this.options);

    this.filteredOptions = [...this.options];

    this.searchControl.valueChanges.subscribe(value => {
      this.filterOptions(value);
    });

    if (this.selectedId) {
      const selectedOption = this.options.find(option => option[this.idProperty] === this.selectedId);
      if (selectedOption) {
        this.searchControl.setValue(selectedOption[this.valueProperty]);
      }
    }
  }

  filterOptions(term: string | null | undefined) {
    if (!term) {
      this.filteredOptions = [...this.options];
      return;
    }

    const searchTerm = term.toLowerCase();
    this.filteredOptions = this.options.filter(option => {
      return Object.keys(option).some(key =>
        option[key] && option[key].toString().toLowerCase().includes(searchTerm)
      );
    });
  }

  onSelect(id: any) {
    this.selectedId = id;
    this.selectedIdChange.emit(this.selectedId);
    this.selectionChange.emit(this.selectedId);

    const selectedOptionIndex = this.options.findIndex(option => option[this.idProperty] === id);
    const selectedOption = this.options[selectedOptionIndex];

    if (selectedOption) {
      this.searchControl.setValue(selectedOption[this.valueProperty]);
      this.optionSelected.emit({ option: selectedOption, index: selectedOptionIndex }); 
    }

    this.dropdownOpen = false;
  }

  clearSelection() {
    this.selectedId = null;
    this.selectedIdChange.emit(this.selectedId);
    this.selectionChange.emit(this.selectedId);
    this.searchControl.setValue(null);
    this.filteredOptions = [...this.options];
    this.toggleDropdown(true);
  }

  toggleDropdown(state: boolean) {
  if (state) {
    this.searchControl.setValue(null); 
  }
  setTimeout(() => {
    this.dropdownOpen = state;
  }, 200);
}


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.search-select-input-group');
    if (!clickedInside) {
      this.toggleDropdown(false);
    }
  }
}
