 


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
export class SolicitudDireccionService {

  URL = environment.URL_API;
  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  duracionActividades :any[]=[]; 
  estados :any[]=[]; 

  constructor(private http:HttpClient) { }  

   get_mostrarSolicitudesDireccionesCab(idUsuario:number, idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(idEstado)    );

    return this.http.get( this.URL + 'tblSolMedicoDireccion' , {params: parametros});
  }
 
  set_save_solicitudDireccionCab(objSolDet:any){
    return this.http.post(this.URL + 'tblSolMedicoDireccion', JSON.stringify(objSolDet), httpOptions);
  }

  set_edit_solicitudDireccionCab(objSolicitud:any, idSolMedico_Direccion :number){
    return this.http.put(this.URL + 'tblSolMedicoDireccion/' + idSolMedico_Direccion , JSON.stringify(objSolicitud), httpOptions);
  }

  get_buscarMedicos({categoria, especialidad, medico }, idMedico : number, idUsuario:number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', String(categoria)  + '|' + String(especialidad)   + '|' + String(medico) + '|' + String(idMedico) + '|' + String(idUsuario) );

    return this.http.get( this.URL + 'tblSolMedicoDireccion' , {params: parametros});
  }

    
  set_aprobarRechazar_direcciones( id_Sol_Medico_det :number, descripcion : string , proceso: string, id_usuario :number  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(id_Sol_Medico_det)  + '|' + String(descripcion) + '|' + String(proceso)  + '|' + String(id_usuario)  );
  
    console.log(parametros)
 
    return this.http.get( this.URL + 'tblSolMedicoDireccion' , {params: parametros});
  }



}
