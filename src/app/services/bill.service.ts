import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { Bill } from '../bills/bill';

@Injectable()
export class BillService {
  /**
   * Creates a new PollService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  getAllBills() {
    return this.http.get('/api/bills')
      .map(res => res.json());
  }


  getBill(id:string): Observable<Bill> {
    return this.http.get('/api/bills/' + id)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }

  saveBill(data:Bill): Observable<string[]> {
    let headers = new Headers({
      'Content-Type': 'application/json'});

    return this.http.post('/api/bills/', JSON.stringify(data), {
      headers: headers
    }).map((res) => res.json().data);
  }

  updateBill(bill:Bill): Observable<string[]> {
    let headers = new Headers({
      'Content-Type': 'application/json'});

    return this.http.put('/api/bills/' + bill._id, JSON.stringify(bill), {
      headers: headers
    }).map((res) => res.json().bill);
  }

  deleteBill(id:String): Observable<string> {
    return this.http.delete('/api/bills/' + id)
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }


  /**
   * Handle HTTP error
   */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
