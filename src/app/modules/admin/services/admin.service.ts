import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';

const BASE_URL = ["http://localhost:8080/api/admin"];

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) { }

  postCar(postCarRequest: any): Observable<any> {
    return this.http.post(BASE_URL + "/car", postCarRequest, {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllCars(): Observable<any> {
    return this.http.get(BASE_URL + "/cars", {
      headers: this.createAuthorizationHeader()
    });
  }

  getCarbyId(id: number): Observable<any> {
    return this.http.get(BASE_URL + "/cars/" + id, {
      headers: this.createAuthorizationHeader()
    });
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(BASE_URL + "/cars/" + id, {
      headers: this.createAuthorizationHeader()
    });
  }

  updateCar(id: number, carResponse: any): Observable<any> {
    return this.http.put(BASE_URL + "/cars/" + id, carResponse, {
      headers: this.createAuthorizationHeader()
    })
  }

  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + StorageService.getToken()
    );
  }
}
