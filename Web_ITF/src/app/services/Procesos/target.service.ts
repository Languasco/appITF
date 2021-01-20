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

  get_mostrar_AltasBajasTarget({idUsuario, fecha_ini, fecha_fin, estado },opcionTarget:string, fechaIni:string, fechaFin:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(fechaIni) + '|' + String(fechaFin) + '|' + String(estado) + '|' + String(opcionTarget) );

    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

  get_buscarMedicos({medico, categoria, especialidad },opcionTarget:string, idUsuario: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', String(medico)  + '|' + String(categoria) + '|' + String(especialidad) + '|' + String(opcionTarget) + '|' + String(idUsuario) );

    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

 
  set_insert_update_altasBajas_Target( idTargetCab:number,  objTarget:string, opcionTarget:string, idUsuario:number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', String(idTargetCab)  + '|' + String(objTarget)  + '|' + String(opcionTarget) + '|' + String(idUsuario) );

    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

  get_altasBajas_detalleTarget(idTargetCab:number, opcionTarget:string, idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', String(idTargetCab) + '|' + String(opcionTarget) + '|' + String(idUsuario) );

   return this.http.get( this.URL + 'Target' , {params: parametros});
  }


    ///----APROBAR ALTAS BAJAS TARGET ----

    get_mostrar_AprobacionAltasBajasTarget({idUsuario, fecha_ini, fecha_fin, estado },opcionTarget:string, fechaIni:string, fechaFin:string,  idUsuario_logeado:number){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(fechaIni) + '|' + String(fechaFin) + '|' + String(estado) + '|' + String(opcionTarget)  + '|' + String(idUsuario_logeado)  );
  
      console.log(parametros)
      return this.http.get( this.URL + 'Target' , {params: parametros});
    }


    
  get_AprobacionaltasBajas_detalleTarget(idTargetCab:number, opcionTarget:string, idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', String(idTargetCab) + '|' + String(opcionTarget) + '|' + String(idUsuario) );

   return this.http.get( this.URL + 'Target' , {params: parametros});
  }
      
  set_AprobarRechazar_altasBajas_Target(idTargetDet:number, nroContactos :number, opcionTarget:string, opcion:string, idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', String(idTargetDet) + '|' + String(nroContactos)  + '|' + String(opcionTarget)+ '|' + String(opcion) + '|' + String(idUsuario)  );

   return this.http.get( this.URL + 'Target' , {params: parametros});
  }

  get_informacionMedico_Target(idMedico:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', String(idMedico));

   return this.http.get( this.URL + 'Target' , {params: parametros});
  }

   
  set_finalizar_aprobacionAltasBajas_Target( idTargetCab:number, opcionTarget:string, idUsuario:number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro', String(idTargetCab) + '|' + String(opcionTarget) + '|' + String(idUsuario) );

    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

      




 
}
