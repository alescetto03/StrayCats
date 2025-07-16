import { Component, inject, Input, Output } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { ApiService } from '../_services/rest-api/api.service';
import { Cat } from '../_services/rest-api/cat.type';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  cats: Cat[] = [];
  restService = inject(ApiService);

  fetchCats() {
      this.restService.getCats().subscribe({
        next: (data) => {
          this.cats = data;
        },
        error: (err) => {
          console.log(err) //TODO::Displayare gli errori nell'interfaccia
        }
    })
  }

  ngOnInit() {
    this.fetchCats();
  }
}
