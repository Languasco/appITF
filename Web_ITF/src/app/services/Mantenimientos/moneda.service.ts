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
export class MonedaService {

 
  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_moneda(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblMonedas' , {params: parametros});
  }

  get_verificar_codigoMoneda(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblMonedas' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionMoneda(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblMonedas' , {params: parametros}).toPromise();
  }

  set_save_moneda(objMantenimiento:any){
    return this.http.post(this.URL + 'tblMonedas', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_moneda(objMantenimiento:any, id_Moneda :number){
    return this.http.put(this.URL + 'tblMonedas/' + id_Moneda , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_moneda(id_Moneda : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Moneda));

    return this.http.get( this.URL + 'tblMonedas' , {params: parametros});
  }


}
