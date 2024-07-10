import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrl: './get-bookings.component.scss'
})
export class GetBookingsComponent {
  
  isSpinning: boolean = false;
  bookings: any;

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(){
    this.getBookings();
  }

  getBookings(){
    this.isSpinning = true;
    this.adminService.getBookings().subscribe((res) => {
      this.isSpinning = false;
      console.log(res)
      this.bookings = res;
    })
  }

  changeBookingStatus(id: number, status: string){
    this.isSpinning = true;
    // console.log(id,status);
    this.adminService.changeBookingStatus(id,status).subscribe((res) => {
      this.isSpinning = false;
      console.log(res)
      this.getBookings();
      this.message.success("Booking status changed successfully", {nzDuration: 5000})
    }, error => {
      this.message.error("Something went wrong", {nzDuration: 5000})
    })
  }
}
