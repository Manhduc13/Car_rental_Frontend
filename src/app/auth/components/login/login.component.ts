import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isSpinning: boolean = false;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  login() {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe((res) => {
      console.log(res);
      if (res.userId != null) {
        const user = {
          id: res.userId,
          role: res.userRoles
        }
        StorageService.saveUser(user);
        StorageService.saveToken(res.jwt);

        if (StorageService.isAdminLoggedIn()) {
          this.message.success("Login successful", { nzDuration: 5000 });
          this.router.navigateByUrl("/admin/dashboard");
        } else if (StorageService.isCustomerLoggedIn()) {
          this.message.success("Login successful", { nzDuration: 5000 });
          this.router.navigateByUrl("/customer/dashboard");
        } else {
          this.message.error("Bad credentials", { nzDuration: 5000 });
        }
      } else {
        this.message.error("Email or password is incorrect!", { nzDuration: 5000 });
      }
    })
  }
}
