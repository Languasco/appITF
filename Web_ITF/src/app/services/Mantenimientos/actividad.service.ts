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
export class ActividadService {

  URL = environment.URL_API;
  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  duracionActividades :any[]=[]; 
  estados :any[]=[]; 

  constructor(private http:HttpClient) { }  


  get_usuarios(idUsuario:number){
    if (this.usuarios.length > 0) {
      return of( this.usuarios )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', String(idUsuario));
  
      return this.http.get( this.URL + 'tblActividades' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.usuarios = res.data;
                       return res.data;
                  }) );
    }
  }

  get_ciclos(){
    if (this.ciclos.length > 0) {
      return of( this.ciclos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblActividades' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.ciclos = res.data;
                       return res.data;
                  }) );
    }
  }

  get_duracionActividades(){
    if (this.duracionActividades.length > 0) {
      return of( this.duracionActividades )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblActividades' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.duracionActividades = res.data;
                       return res.data;
                  }) );
    }
  }
  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '6');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblActividades' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.estados = res.data;
                       return res.data;
                  }) );
    }
  }


  get_mostrar_actividad(idUsuario:number, idCiclo :number, idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(idCiclo) + '|' + String(idEstado)    );

    return this.http.get( this.URL + 'tblActividades' , {params: parametros});
  }

  get_verificar_codigoRol(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblActividades' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionRol(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblActividades' , {params: parametros}).toPromise();
  }


  set_save_actividad(objMantenimiento:any){
    return this.http.post(this.URL + 'tblActividades', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_actividad(objMantenimiento:any, id_actividad :number){
    return this.http.put(this.URL + 'tblActividades/' + id_actividad , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_actividad(id_actividad : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_actividad));

    return this.http.get( this.URL + 'tblActividades' , {params: parametros});
  }

}
