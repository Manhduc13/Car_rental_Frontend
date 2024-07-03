import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrl: './update-car.component.scss'
})
export class UpdateCarComponent {

  isSpinning: boolean = false;
  carId:number = this.activatedRoute.snapshot.params["id"];

  imageChange: boolean = false;
  existingImage: string | null = null;
  imagePreview!: string | ArrayBuffer | null;
  selectedFile: any;  

  updateForm!: FormGroup;

  listOfOption: Array<{ label: string; value: string }> = [];
  listOfBrands = ["BMW", "AUDI", "FERRARI", "TESLA", "VOLVO", "TOYOTA", "HONDA", "FORD", "NISSAN", "HYUNDAI", "LEXUS", "KIA"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "CNG"];
  listOfColor = ["Red", "White", "Blue", "Black", "Orange", "Grey", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(){
    this.updateForm = this.fb.group({
      name: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      type: [null, [Validators.required]],
      color: [null, [Validators.required]],
      transmission: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
      year: [null, [Validators.required]],
    })
    this.getCarbyId();
  }

  getCarbyId(){
    this.isSpinning = true;
    this.adminService.getCarbyId(this.carId).subscribe((res) => {
      this.isSpinning = false;
      const carResponse = res;
      this.existingImage = 'data:image/jpg;base64,' + res.returnedImage;
      console.log(carResponse);
      carResponse.year = new Date(carResponse.year); // Convert year to Date type
      this.updateForm.patchValue(carResponse);
    })
  }

  onFileSelected(event: any){
    if (event && event.target && event.target.files) {
      this.selectedFile = event.target.files[0];
      this.imageChange = true;
      this.existingImage = null;
      this.previewImage();
    } else {
      console.error("No file selected or event is not valid");
    }
  }

  previewImage(){
    if (this.selectedFile && this.selectedFile.type.startsWith('image/')) { // Check if the file is an image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      console.error("Selected file is not an image or no file selected");
    }
  }

  updateCar(){
    console.log(this.updateForm.value);

    this.isSpinning = true;

    const formData: FormData = new FormData();
    if (this.imageChange && this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    formData.append('brand', this.updateForm.get('brand')?.value);
    formData.append('name', this.updateForm.get('name')?.value);
    formData.append('type', this.updateForm.get('type')?.value);
    formData.append('transmission', this.updateForm.get('transmission')?.value);
    formData.append('color', this.updateForm.get('color')?.value);
    formData.append('year', this.updateForm.get('year')?.value);
    formData.append('price', this.updateForm.get('price')?.value);
    formData.append('description', this.updateForm.get('description')?.value);
    console.log(formData);

    this.adminService.updateCar(this.carId, formData).subscribe((res) => {
      this.isSpinning = false;
      this.message.success("Car updated successfully", { nzDuration: 5000 });
      this.router.navigateByUrl("/admin/dashboard");
      console.log(res);
    }, error => {
      this.message.error("Error while updating car", { nzDuration: 5000 });
      console.error(error);
    });
  }
}
