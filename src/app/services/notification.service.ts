import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class NotificationService {
  /**
   * Creates a new PollService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  getNotifications() {
    return this.http.get('/api/notifications')
      .map(res => res.json());
  }

  getUnreadNotifications() {
    return this.http.get('/api/notifications/unread')
      .map(res => res.json());
  }


  markAsRead(id: String): Observable<string[]> {
    let headers = new Headers({
      'Content-Type': 'application/json'});

    return this.http.put('/api/notifications/' + id, {
      headers: headers
    }).map((res) => res.json().notification);
  }

}
