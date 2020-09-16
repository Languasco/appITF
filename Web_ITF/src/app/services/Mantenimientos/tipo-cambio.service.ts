import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
 
@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {

 
  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_tipoCambio(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }

  set_save_tipoCambio(objMantenimiento:any){
    return this.http.post(this.URL + 'tblUsuarios', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_tipoCambio(objMantenimiento:any, idUsuario :number){
    return this.http.put(this.URL + 'tblUsuarios/' + idUsuario , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_tipoCambio(idUsuario : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro',  String(idUsuario));

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }

}
