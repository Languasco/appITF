 
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class CicloService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_ciclo(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblCiclos' , {params: parametros});
  }

  get_verificar_codigoRol(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblCiclos' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionRol(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblCiclos' , {params: parametros}).toPromise();
  }


  set_save_ciclo(objMantenimiento:any){
    return this.http.post(this.URL + 'tblCiclos', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_ciclo(objMantenimiento:any, id_Ciclo :number){
    return this.http.put(this.URL + 'tblCiclos/' + id_Ciclo , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_ciclo(id_Ciclo : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Ciclo));

    return this.http.get( this.URL + 'tblCiclos' , {params: parametros});
  }

}
