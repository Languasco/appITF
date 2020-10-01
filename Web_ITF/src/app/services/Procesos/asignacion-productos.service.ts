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
export class AsignacionProductosService {

  URL = environment.URL_API;
  usuarios :any[]=[]; 
  productos :any[]=[]; 
  ciclos :any[]=[]; 
  duracionActividades :any[]=[]; 
  estados :any[]=[]; 

  constructor(private http:HttpClient) { }  


  get_usuariosGeneral(idUsuario:number){
    if (this.usuarios.length > 0) {
      return of( this.usuarios )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', String(idUsuario));
  
      return this.http.get( this.URL + 'tblStock' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.usuarios = res.data;
                       return res.data;
                  }) );
    }
  }

  get_productosGeneral(){
    if (this.productos.length > 0) {
      return of( this.productos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblStock' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.productos = res.data;
                       return res.data;
                  }) );
    }
  }


  get_mostrar_asignacionProducto(idUsuario:number, idCiclo :number, producto:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + String(idCiclo) + '|' + String(producto)    );

    return this.http.get( this.URL + 'tblStock' , {params: parametros});
  }

  set_save_asignacionProducto(objMantenimiento:any){
    return this.http.post(this.URL + 'tblStock', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_asignacionProducto(objMantenimiento:any, id_Stock :number){
    return this.http.put(this.URL + 'tblStock/' + id_Stock , JSON.stringify(objMantenimiento), httpOptions);
  }

 



}
