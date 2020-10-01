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
export class TargetService {

  URL = environment.URL_API;
  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  duracionActividades :any[]=[]; 
  estados :any[]=[]; 



  // this.formParamsFiltro= new FormGroup({
  //   idUsuario : new FormControl('0'),
  //   categoria : new FormControl('0'),
  //   especialidad : new FormControl('0'),
  //   medico : new FormControl(''),
  //   estado : new FormControl('0'),
  //  }) 

  constructor(private http:HttpClient) { }  

   get_mostrar_target({idUsuario, categoria, especialidad,medico, estado }){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(categoria) + '|' + String(especialidad) + '|' + String(medico) + '|' + String(estado) );

    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

  set_save_asignacionProducto(objMantenimiento:any){
    return this.http.post(this.URL + 'Target', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_asignacionProducto(objMantenimiento:any, id_Stock :number){
    return this.http.put(this.URL + 'Target/' + id_Stock , JSON.stringify(objMantenimiento), httpOptions);
  }


  ///----ALTAS BAJAS TARGET ----

  get_mostrar_AltasBajasTarget({idUsuario, fecha_ini, fecha_fin, estado },opcionTarget:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(fecha_ini) + '|' + String(fecha_fin) + '|' + String(estado) + '|' + String(opcionTarget) );

    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

 



}
