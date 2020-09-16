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
export class EspecialidadService {

  URL = environment.URL_API;
  especialidades :any[]=[]; 

  constructor(private http:HttpClient) { }  

  get_especialidades(){
    if (this.especialidades.length > 0) {
      return of( this.especialidades )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblEspecialidades' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.especialidades = res.data;
                       return res.data;
                  }) );
    }
  }

  get_mostrar_especialidad(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblEspecialidades' , {params: parametros});
  }

  get_verificar_codigoespecialidad(codEsp:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codEsp);

    return this.http.get( this.URL + 'tblEspecialidades' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionespecialidad(descEsp:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descEsp);

    return this.http.get( this.URL + 'tblEspecialidades' , {params: parametros}).toPromise();
  }


  set_save_especialidad(objMantenimiento:any){
    return this.http.post(this.URL + 'tblEspecialidades', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_especialidad(objMantenimiento:any, id_especial :number){
    return this.http.put(this.URL + 'tblEspecialidades/' + id_especial , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_especialidad(id_especial : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_especial));

    return this.http.get( this.URL + 'tblEspecialidades' , {params: parametros});
  }

}
