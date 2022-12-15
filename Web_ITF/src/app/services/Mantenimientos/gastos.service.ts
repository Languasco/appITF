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
export class GastosService {

  URL = environment.URL_API;
  usuarios :any[]=[]; 
  conceptosGastos :any[]=[]; 
  tiposComprobantes:any[]=[]; 
  monedas:any[]=[]; 
  fechasCiclos : any[]=[]; 
 

  constructor(private http:HttpClient) { }  

  get_mostrar_conceptosGastos(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'Gastos' , {params: parametros});
  }

  set_save_conceptosGastos(objMantenimiento:any){
    return this.http.post(this.URL + 'Gastos/Posttbl_Conceptos_Gastos', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_conceptosGastos(objMantenimiento:any, idConceptosGastos :number){
    return this.http.put(this.URL + 'Gastos/Puttbl_Conceptos_Gastos/?id=' + idConceptosGastos , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_conceptosGastos(idConceptosGastos : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(idConceptosGastos));

    return this.http.get( this.URL + 'Gastos' , {params: parametros});
  }


  get_usuarios_Gastos(idUsuario:number){
    if (this.usuarios.length > 0) {
      return of( this.usuarios )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', String(idUsuario));
  
      return this.http.get( this.URL + 'Gastos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.usuarios = res.data;
                       return res.data;
                  }) );
    }
  }
  
  get_conceptos_Gastos(){
    if (this.conceptosGastos.length > 0) {
      return of( this.conceptosGastos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro','');
  
      return this.http.get( this.URL + 'Gastos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.conceptosGastos = res.data;
                       return res.data;
                  }) );
    }
  }

  get_tiposComprobantes_Gastos(){
    if (this.tiposComprobantes.length > 0) {
      return of( this.tiposComprobantes )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'Gastos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.tiposComprobantes = res.data;
                       return res.data;
                  }) );
    }
  }

  get_monedas_Gastos(){
    if (this.monedas.length > 0) {
      return of( this.monedas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '8');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'Gastos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.monedas = res.data;
                       return res.data;
                  }) );
    }
  }
  get_mostrar_Gastos(mesAnio:string, idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(mesAnio) + '|' +idUsuario);

    return this.http.get( this.URL + 'Gastos' , {params: parametros});
  }

  get_fechasCiclos(){
    if (this.fechasCiclos.length > 0) {
      return of( this.fechasCiclos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '11');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'Gastos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.fechasCiclos = res.data;
                       return res.data;
                  }) );
    }
  }


  get_consultarRucGasto(nroRuc:string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', String(nroRuc));

    return this.http.get( this.URL + 'Gastos' , {params: parametros});
  }

  set_save_Gastos(objMantenimiento:any){
    return this.http.post(this.URL + 'Gastos/Posttbl_Gastos', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_Gastos(objMantenimiento:any, idGastos :number){
    return this.http.put(this.URL + 'Gastos/Puttbl_Gastos/?id=' + idGastos , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anularGastos(idGastos : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro',  String(idGastos));

    return this.http.get( this.URL + 'Gastos' , {params: parametros});
  }  

  get_reporteGastos(mesAnio:string, idUsuario:number, TipoReporte:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', String(mesAnio) + '|' +idUsuario+ '|' +TipoReporte);

    return this.http.get( this.URL + 'Gastos' , {params: parametros});
  }

  get_verificarPresupuesto({ usuario_creacion, fecha_gastos, id_concepto_gastos, total }){

    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', usuario_creacion + '|' + fecha_gastos  + '|' + id_concepto_gastos   + '|' + total );

    return this.http.get( this.URL + 'Gastos' , {params: parametros}).toPromise();
  }

  get_descargarGrilla_Gastos(mesAnio:string, idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro', String(mesAnio) + '|' +idUsuario);

    return this.http.get( this.URL + 'Gastos' , {params: parametros});
  }

  
  get_fechasCiclos_Gastos(){
    if (this.fechasCiclos.length > 0) {
      return of( this.fechasCiclos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '14');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'Gastos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.fechasCiclos = res.data;
                       return res.data;
                  }) );
    }
  }



}
