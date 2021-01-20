 


import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class CumpleaniosService {

  URL = environment.URL_API;
  usuarios :any[]=[]; 
  meses :any[]=[]; 
 

  constructor(private http:HttpClient) { }  

  get_usuarios(idUsuario:number){
    if (this.usuarios.length > 0) {
      return of( this.usuarios )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', String(idUsuario));
  
      return this.http.get( this.URL + 'Reportes' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.usuarios = res.data;
                       return res.data;
                  }) );
    }
  }

  get_meses(){
    if (this.meses.length > 0) {
      return of( this.meses )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'Reportes' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.meses = res.data;
                       return res.data;
                  }) );
    }
  }
 
  get_mostrar_cumpleanios(idUsuario:number, idCiclo :number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(idCiclo) );

    return this.http.get( this.URL + 'Reportes' , {params: parametros});
  }
 



}
