import { Injectable } from '@angular/core';

import {HttpClient} from "@angular/common/http";
import { Observable, ObservableLike } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Producto } from '../Interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private urlApi: string = environment.endpoint + "Rol/";

  constructor(private http: HttpClient) { }

  lista(): Observable<ResponseApi>{

    return this.http.get<ResponseApi>(`${this.urlApi}Lista`);

  }
}
