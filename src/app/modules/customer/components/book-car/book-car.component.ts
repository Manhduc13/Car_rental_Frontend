import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrl: './book-car.component.scss'
})
export class BookCarComponent {

  carId:number = this.activatedRoute.snapshot.params["id"];
  car: any;
  processedImg: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService) { }

  ngOnInit(){
    this.getCarbyId();
  }

  getCarbyId(){
    this.customerService.getCarById(this.carId).subscribe((res) =>{
      console.log(res)
      this.processedImg = 'data:image/jpg;base64,' + res.returnedImage;
      this.car = res
    })
  }
}

