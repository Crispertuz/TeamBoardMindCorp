import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private env: string;

  constructor(private _http: HttpClient) {
    this.env = environment.APP_URL;
  }

  forgottenPassword(email: any) {
    return this._http.post<any>(this.env + 'forgotPassword/forgottenPassword', email);
  }

  forgottenPasswordConfirm(passwordData: any) {
    return this._http.put<any>(this.env + 'forgotPassword/forgottenPasswordConfirm', passwordData);
  }


  
}
