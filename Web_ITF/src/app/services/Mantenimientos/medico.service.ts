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
export class MedicoService {

  URL = environment.URL_API;
  profesiones :any[]=[]; 

  departamentos :any[]=[]; 
  provincias :any[]=[]; 
  distritos :any[]=[]; 

  constructor(private http:HttpClient) { } 
  
  get_profesiones(){
    if (this.profesiones.length > 0) {
      return of( this.profesiones )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblMedicos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.profesiones = res.data;
                       return res.data;
                  }) );
    }
  }

  get_departamentos(){
    if (this.departamentos.length > 0) {
      return of( this.departamentos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblMedicos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.departamentos = res.data;
                       return res.data;
                  }) );
    }
  }

  get_provincias(codDepartamento:string){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', codDepartamento);
  
      return this.http.get( this.URL + 'tblMedicos' , {params: parametros})
  }

  get_distritos(codDepartamento:string, codProvincia:string){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '8');
      parametros = parametros.append('filtro', codDepartamento + '|' + codProvincia);  
      return this.http.get( this.URL + 'tblMedicos' , {params: parametros})
  }


  get_mostrar_medicos({ cmp,medico, email,categoria , especialidad,profesional, idEstado  }){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(cmp) + '|' + medico  + '|' + email + '|' + categoria + '|' + especialidad + '|' + profesional + '|' + idEstado  );

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }

  get_verificar_codigoMedico(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionMedico(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros}).toPromise();
  }


  set_save_medico(objMantenimiento:any){
    return this.http.post(this.URL + 'tblMedicos', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_medico(objMantenimiento:any, idMedico :number){
    return this.http.put(this.URL + 'tblMedicos/' + idMedico , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_medico(idMedico : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(idMedico));

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }

  set_eliminar_medico(idMedico : number, idSolDet :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro',  String(idMedico) + '|' + idSolDet  );

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }

  // DIRECCIONES DE MEDICOS

  get_mostrar_direccionMedicos(idMedico:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', String(idMedico));

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }

  get_delete_direccionMedico(id_Medicos_Direccion:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', String(id_Medicos_Direccion));

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }

  set_save_direccionMedico(objMantenimiento:any){
    return this.http.post(this.URL + 'tblMedicosDireccion', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_direccionMedico(objMantenimiento:any, idMedicosDireccion :number){
    return this.http.put(this.URL + 'tblMedicosDireccion/' + idMedicosDireccion , JSON.stringify(objMantenimiento), httpOptions);
  }

  get_buscarDireccionMedico_id(idDireccion:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', String(idDireccion));

    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }


}
