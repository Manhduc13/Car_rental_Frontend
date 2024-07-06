import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../../auth/services/storage/storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrl: './book-car.component.scss'
})
export class BookCarComponent {

  carId:number = this.activatedRoute.snapshot.params["id"];
  car: any;
  processedImg: any;
  bookCarForm!: FormGroup;
  isSpinning: boolean = false;
  dateFormat: string = "dd-MM-yyyy";

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(){
    this.bookCarForm = this.fb.group({
      endDate: [null,[Validators.required]],
      startDate: [null,[Validators.required]]
    })
    this.getCarbyId();
  }

  getCarbyId(){
    this.customerService.getCarById(this.carId).subscribe((res) =>{
      console.log(res)
      this.processedImg = 'data:image/jpg;base64,' + res.returnedImage;
      this.car = res
    })
  }

  bookACar(data: any){
    console.log(data);
    this.isSpinning = true;
    let bookCarRequest = {
      startDate: data.startDate,
      endDate: data.endDate,
      userId: StorageService.getUserId(),
      carId: this.carId
    }
    this.customerService.bookACar(bookCarRequest).subscribe((res) => {
      this.isSpinning = false;
      this.message.success("Booking request submitted successfully", {nzDuration: 5000});
      this.router.navigateByUrl("/customer/dashboard")
      console.log(res);
    }, error => {
      this.message.error("Somethinh went wrong", {nzDuration: 5000})
      console.log(error);
    })
  }
}

