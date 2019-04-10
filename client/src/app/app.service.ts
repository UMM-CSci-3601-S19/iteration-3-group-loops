import {Injectable} from "@angular/core";
import {environment} from '../environments/environment';
import 'rxjs/add/observable/of';


@Injectable()
export class AppService {
  constructor() {
  }

  public isSignedIn(): boolean {
    status = localStorage.getItem('isSignedIn');
    return (status == 'true');
  }
}
