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
export class FeriadoService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_feriado(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblFeriados' , {params: parametros});
  }

  get_verificar_feriado(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblFeriados' , {params: parametros}).toPromise();
  }

  set_save_feriado(objMantenimiento:any){
    return this.http.post(this.URL + 'tblFeriados', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_feriado(objMantenimiento:any, id_Feriado :number){
    return this.http.put(this.URL + 'tblFeriados/' + id_Feriado , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_feriado(id_Feriado : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Feriado));

    return this.http.get( this.URL + 'tblFeriados' , {params: parametros});
  }


}
