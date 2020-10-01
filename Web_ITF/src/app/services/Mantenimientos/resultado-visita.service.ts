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
export class ResultadoVisitaService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_resultadoVisita(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblResultadosVisitas' , {params: parametros});
  }

  // get_verificar_codigoRol(codRol:string){
  //   let parametros = new HttpParams();
  //   parametros = parametros.append('opcion', '3');
  //   parametros = parametros.append('filtro', codRol);

  //   return this.http.get( this.URL + 'tblResultadosVisitas' , {params: parametros}).toPromise();
  // }

  get_verificar_descripcionResultadoVisita(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblResultadosVisitas' , {params: parametros}).toPromise();
  }

  set_save_resultadoVisita(objMantenimiento:any){
   const resultadoBD = {
      id_Resultado_Visita: objMantenimiento.id_Resultado_Visita  , 
      descripcion_resultado_visita: objMantenimiento.descripcion_resultado_visita  , 
      por_defecto_resultado_visita: (objMantenimiento.por_defecto_resultado_visita == true) ? 1:0 , 
      estado : objMantenimiento.estado ,   
      usuario_creacion : objMantenimiento.usuario_creacion 
    }
    return this.http.post(this.URL + 'tblResultadosVisitas', JSON.stringify(resultadoBD), httpOptions);
  }

  set_edit_resultadoVisita(objMantenimiento:any, id_perfil :number){

    const resultadoBD = {
      id_Resultado_Visita: objMantenimiento.id_Resultado_Visita  , 
      descripcion_resultado_visita: objMantenimiento.descripcion_resultado_visita  , 
      por_defecto_resultado_visita: (objMantenimiento.por_defecto_resultado_visita == true) ? 1:0 , 
      estado : objMantenimiento.estado ,   
      usuario_creacion : objMantenimiento.usuario_creacion 
    }

    return this.http.put(this.URL + 'tblResultadosVisitas/' + id_perfil , JSON.stringify(resultadoBD), httpOptions);
  }

  set_anular_resultadoVisita(id_perfil : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_perfil));

    return this.http.get( this.URL + 'tblResultadosVisitas' , {params: parametros});
  }

  get_verificar_porDefecto(){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', 'vv');

    return this.http.get( this.URL + 'tblResultadosVisitas' , {params: parametros}).toPromise();
  }

}
