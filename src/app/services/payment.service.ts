import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PaymentService {
  /**
   * Creates a new PollService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  createPayment(data:Object): Observable<string[]> {
    let headers = new Headers({
      'Content-Type': 'application/json'});

    return this.http.post('/api/bills/payment', JSON.stringify(data), {
      headers: headers
    }).map((res) => res.json().data);
  }

  getAllPayments() {
    return this.http.get('/api/payments')
      .map(res => res.json());
  }

  getPaymentsForCurrentMonth() {
    return this.http.get('/api/payments/current-month')
      .map(res => res.json());
  }

}
