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
export class SolicitudMedicoService {

  URL = environment.URL_API;
  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  duracionActividades :any[]=[]; 
  estados :any[]=[]; 

  constructor(private http:HttpClient) { }  

  get_mostrar_medicos({ idUsuario,fecha_ini ,fecha_fin,idEstado }, fechaIni :string,   fechaFin:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idUsuario) + '|' + fechaIni  + '|' + fechaFin + '|' + idEstado  );

    return this.http.get( this.URL + 'tblSolMedico_Cab' , {params: parametros});
  }

  set_save_solicitudMedicoCab(objMantenimiento:any){
    return this.http.post(this.URL + 'tblSolMedico_Cab', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_solicitudMedicoCab(objMantenimiento:any, id_Sol_Medico_cab :number){
    return this.http.put(this.URL + 'tblSolMedico_Cab/' + id_Sol_Medico_cab , JSON.stringify(objMantenimiento), httpOptions);
  }


  set_save_solicitudMedicoDet(objMantenimiento:any){
    return this.http.post(this.URL + 'tblSolMedico_Det', JSON.stringify(objMantenimiento), httpOptions);
  }

  get_solicitudMedicoDet(idSol_CabGlobal:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', String(idSol_CabGlobal) );

   return this.http.get( this.URL + 'tblSolMedico_Det' , {params: parametros});
  }

  set_enviarSolicitudMedico(idSol_CabGlobal:number, idUser:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', String(idSol_CabGlobal) + '|' + idUser );

    return this.http.get( this.URL + 'tblSolMedico_Cab' , {params: parametros});
  }

  set_descartarSolicitudCab(idSol_CabGlobal:number, idUser:number){

    console.log(idSol_CabGlobal + ' ' + idUser)
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', String(idSol_CabGlobal) + '|' + idUser );

    return this.http.get( this.URL + 'tblSolMedico_Cab' , {params: parametros});
  }


  get_verificar_nuevoMedico(identificadorMedico:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', identificadorMedico);

    return this.http.get( this.URL + 'tblSolMedico_Cab' , {params: parametros}).toPromise();
  }


  set_envioCorreoSolicitudMedico(idSol_CabGlobal:number, idUser:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', String(idSol_CabGlobal) + '|' + idUser );

    return this.http.get( this.URL + 'tblSolMedico_Cab' , {params: parametros});
  }


// -------------- APROBACION DE SOLCITUDES MEDICOS


  get_aprobarMostrar_medicos({ idUsuario,fecha_ini ,fecha_fin,idEstado } ,  fechaIni:string, fechaFin:string  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(idUsuario) + '|' + fechaIni  + '|' + fechaFin + '|' + idEstado  );
  
    return this.http.get( this.URL + 'tblSolMedico_Cab' , {params: parametros});
  }
  
  set_aprobarRechazar_medicos( id_Sol_Medico_det :number, descripcion : string , proceso: string, id_usuario :number  ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(id_Sol_Medico_det)  + '|' + String(descripcion) + '|' + String(proceso)  + '|' + String(id_usuario)  );
  
    console.log(parametros)
  
    return this.http.get( this.URL + 'tblSolMedico_Det' , {params: parametros});
  }




}
