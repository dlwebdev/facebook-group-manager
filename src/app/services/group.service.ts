import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GroupService {

  constructor(private http: Http) { }

  getAllGroups() {
    return this.http.get('/api/groups')
      .map(res => res.json());
  }
}
