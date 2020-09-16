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
export class ProfileService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_roles(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tbl_Perfil' , {params: parametros});
  }

  get_verificar_codigoRol(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tbl_Perfil' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionRol(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tbl_Perfil' , {params: parametros}).toPromise();
  }


  set_save_roles(objMantenimiento:any){
    return this.http.post(this.URL + 'tbl_Perfil', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_roles(objMantenimiento:any, id_perfil :number){
    return this.http.put(this.URL + 'tbl_Perfil/' + id_perfil , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_roles(id_perfil : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_perfil));

    return this.http.get( this.URL + 'tbl_Perfil' , {params: parametros});
  }

}
