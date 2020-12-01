 
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
export class RejaService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }  

  get_mostrar_rejaPromocional({especialidad, estado}){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(especialidad) + '|' + estado);

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros});
  }

  get_verificar_estadoProceso(idEstado:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', idEstado);

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros}).toPromise();
  }


  set_save_ciclo(objMantenimiento:any){
    return this.http.post(this.URL + 'RejaPromocional', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_ciclo(objMantenimiento:any, id_Ciclo :number){
    return this.http.put(this.URL + 'RejaPromocional/' + id_Ciclo , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_ciclo(id_Ciclo : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Ciclo));

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros});
  }

  get_buscar_productos({idTipoProducto, Producto}, iduser:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', String(idTipoProducto) + '|' + Producto  + '|' + iduser  );

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros});
  }


  set_insert_update_rejaPromocional( idRejaCab:number, descripcionReja:string, objEspecialidad:string, objProducto:string, idUsuario:number ){

    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(idRejaCab)  + '|' + String(descripcionReja)  + '|' + String(objEspecialidad) + '|' + String(objProducto) + '|' + String(idUsuario));

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros});
  }

  get_detalleReja_especialidades(idRejaCab : number, iduser:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', String(idRejaCab)    + '|' + iduser  );

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros});
  }

  get_detalleReja_productos(idRejaCab : number, iduser:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', String(idRejaCab)    + '|' + iduser  );

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros});
  }

  set_cerrarRejaPromocional(id_Reja_Cab : number, idUsuario:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro',  String(id_Reja_Cab)  + '|' + idUsuario  );

    return this.http.get( this.URL + 'RejaPromocional' , {params: parametros});
  }


}
