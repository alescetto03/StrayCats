import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatDetailComponent } from './cat-detail.component';

describe('CatDetailComponent', () => {
  let component: CatDetailComponent;
  let fixture: ComponentFixture<CatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
