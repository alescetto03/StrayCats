import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { MarkdownModule } from 'ngx-markdown';
import { ApiService } from '../_services/rest-api/api.service';
import { ToastrService } from 'ngx-toastr';

const validExtensions = ['jpg', 'jpeg', 'webp'];

@Component({
  selector: 'app-cat-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MapComponent,
    LMarkdownEditorModule,
    MarkdownModule,
  ],
  templateUrl: './cat-form.component.html',
  styleUrl: './cat-form.component.css',
})
export class CatFormComponent {
  toastr = inject(ToastrService);
  content: string = '';
  catForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });
  latitude: number | null = null;
  longitude: number | null = null;
  submitted: boolean = false;
  isExtensionInvalid : boolean = false;
  invalidData : boolean = false;

  selectedFile?: File;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.catForm.get('description')?.valueChanges.subscribe((value) => {
      this.content = value || '';
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  handleSubmit() {
    this.submitted = true;
    const fileExtension = this.selectedFile?.name.toLowerCase().split('.').pop();
    if (fileExtension) {
      this.isExtensionInvalid = validExtensions.includes(fileExtension)
    }
    this.invalidData = this.catForm.invalid || 
                    !this.selectedFile || 
                    this.selectedFile.size > 5 * 1024 * 1024 || 
                    this.isExtensionInvalid;                  
    if (this.invalidData) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      console.log(this.latitude)
      console.log(this.longitude)

      const formData = new FormData();
      formData.append('title', this.catForm.value.title!);
      formData.append('description', this.catForm.value.description!);

      // se hai anche latitude, longitude:
      // formData.append('latitude', this.catForm.value.latitude!);
      // formData.append('longitude', this.catForm.value.longitude!);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      //this.apiService.saveCat(formData).subscribe({
      //  next: () => alert('Randagio salvato!'),
      //  error: (err) => console.error(err),
      //});
    }
  }

  onMapClick(coords: { lat: number; lng: number }) {
    this.latitude = coords.lat;
    this.longitude = coords.lng;
  }
}
