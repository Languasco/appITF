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
export class ExamenService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_examenes(fechaInicio :string, fechaFin :string , idEstado: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(fechaInicio) + '|'+ fechaFin + '|'+ idEstado);

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  get_mostrar_usuarios(){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', '');

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
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


  set_save_examenCab(objMantenimiento:any){
    return this.http.post(this.URL + 'tblExamen_Rm_Cab', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_examenCab(objMantenimiento:any, id_examenCab :number){
    return this.http.put(this.URL + 'tblExamen_Rm_Cab/' + id_examenCab , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_roles(id_perfil : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_perfil));

    return this.http.get( this.URL + 'tbl_Perfil' , {params: parametros});
  }

  set_save_examenUsuario(objMantenimiento:any){
    return this.http.post(this.URL + 'tblExamen_Rm_Det_Usuarios', JSON.stringify(objMantenimiento), httpOptions);
  }

  get_listarUsuariosExamen(id_ExamenCab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(id_ExamenCab));

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  set_eliminar_UsuariosExamen(id_Examen_RM_Det_Usuarios : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro',  String(id_Examen_RM_Det_Usuarios));

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  get_listarPreguntasExamen(id_ExamenCab : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', String(id_ExamenCab));

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  set_eliminar_PreguntaExamen(id_Examen_Rm_Cab : number, item_pregunta :number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro',  String(id_Examen_Rm_Cab)+ '|'+ item_pregunta);

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  get_EditarPreguntasExamen(id_Examen_Rm_Cab : number , item_pregunta : number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro', String(id_Examen_Rm_Cab)+ '|'+ item_pregunta);

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  set_eliminar_AlternativaPreguntaExamen(id_Examen_RM_Det_Preguntas : number ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro',  String(id_Examen_RM_Det_Preguntas));

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  set_save_examenPregunta(objMantenimiento:any){
    return this.http.post(this.URL + 'tblExamen_Rm_Det_Preguntas', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_cerrandoExamen(id_ExamenCab : number , id_usuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro',  String(id_ExamenCab) + '|' + id_usuario );

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  set_activandoExamen(id_ExamenCab : number , id_usuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '14');
    parametros = parametros.append('filtro',  String(id_ExamenCab) + '|' + id_usuario );

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }


  // -----  RESOLUCION DEL EXAMEN 

  get_mostrar_examen( idUsuario: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', String(idUsuario)  );

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  get_iniciar_examen(  id_Examen_Rm_Resolucion_Cab : number , id_Examen_Rm_Cab : number , calificacion : number,  idUsuario: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro', String(id_Examen_Rm_Resolucion_Cab) +'|'+ id_Examen_Rm_Cab  +'|'+ calificacion   +'|'+  idUsuario );

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  set_respuesta_examen(  id_Examen_Rm_Resolucion_Det : number , id_Examen_Rm_Resolucion_Cab : number,  id_Examen_RM_Det_Preguntas : number,   idUsuario: number, textoRespuesta : string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', String(id_Examen_Rm_Resolucion_Det) +'|'+ id_Examen_Rm_Resolucion_Cab  +'|'+ id_Examen_RM_Det_Preguntas   +'|'+  idUsuario +'|'+  textoRespuesta  );

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  set_tiempoConcluido_examen( id_Resolucion_Cab  : number,   idUsuario: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro', id_Resolucion_Cab  +'|'+  idUsuario );

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  get_listadoExamenes( idUsuario: number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', String(idUsuario));

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }
  get_listadoRepresentanteMedico( idExamen:number, idUsuario: number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '16');
    parametros = parametros.append('filtro', idExamen  +'|'+  idUsuario);

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }

  get_mostrar_examen_imprimir( idExamen: number , idRepresentanteMedico: number, idUsuario: number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '17');
    parametros = parametros.append('filtro', idExamen  +'|'+  idRepresentanteMedico +'|'+  idUsuario);

    return this.http.get( this.URL + 'tblExamen_Rm_Cab' , {params: parametros});
  }


}
