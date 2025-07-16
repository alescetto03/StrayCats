import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/rest-api/api.service';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-cat-detail',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './cat-detail.component.html',
  styleUrl: './cat-detail.component.css'
})
export class CatDetailComponent {
  constructor(private route: ActivatedRoute) {}
  id: number = 0;
  cat: any;
  restService = inject(ApiService);

  ngOnInit() {
    this.id = this.route.snapshot.params["id"];
    this.restService.getCatById(this.id)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.cat = data;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
