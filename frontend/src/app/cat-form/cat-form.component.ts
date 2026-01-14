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
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
  router = inject(Router)

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

  async handleSubmit() {
    this.submitted = true;
    const fileExtension = this.selectedFile?.name.toLowerCase().split('.').pop();
    if (fileExtension) {
      this.isExtensionInvalid = !validExtensions.includes(fileExtension)
    }
    this.invalidData = this.catForm.invalid || 
                    !this.selectedFile || 
                    this.selectedFile.size > 5 * 1024 * 1024 || 
                    this.isExtensionInvalid ||
                    !this.latitude ||
                    !this.longitude;                  
    if (this.invalidData) {
      this.toastr.error("I dati forniti non sono validi!", "Oops! Dati invalidi!");
    } else {
      try {
        /*
         * Utilizzo firstValueFrom per convertire l'observable in una Promise, 
         * altrimenti dovrei utilizzare degli Observable annidati (codice poco pulito)
        */
        const cat = await firstValueFrom(
          this.apiService.saveCat({
            title: this.catForm.value.title as string,
            description: this.catForm.value.description as string,
            latitude: this.latitude as number,
            longitude: this.longitude as number
          })
        );
        const formData = new FormData();
        formData.append('image', this.selectedFile as File);
        await firstValueFrom(
          this.apiService.uploadCatImage(formData, cat.catId as bigint)
        );
        this.toastr.success(
          "Il nuovo gatto è stato registrato con successo",
          "Salvataggio completato!"
        );
        this.router.navigate([`cats/${cat.catId}`]);
      } catch (error) {
        this.toastr.error(
          "Non è stato possibile completare l'operazione.",
          "Errore!"
        );
      }
    }
  }

  onMapClick(coords: { lat: number; lng: number }) {
    this.latitude = coords.lat;
    this.longitude = coords.lng;
  }
}
