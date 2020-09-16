 

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
export class CategoriaService {

  URL = environment.URL_API;
  categorias :any[]=[]; 

  constructor(private http:HttpClient) { }  

  get_categorias(){
    if (this.categorias.length > 0) {
      return of( this.categorias )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblCategorias' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.categorias = res.data;
                       return res.data;
                  }) );
    }
  }
 

  get_mostrar_categoria(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblCategorias' , {params: parametros});
  }

  get_verificar_codigoCategoria(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblCategorias' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionCategoria(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblCategorias' , {params: parametros}).toPromise();
  }


  set_save_categoria(objMantenimiento:any){
    return this.http.post(this.URL + 'tblCategorias', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_categoria(objMantenimiento:any, id_Categoria :number){
    return this.http.put(this.URL + 'tblCategorias/' + id_Categoria , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_categoria(id_Categoria : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_Categoria));

    return this.http.get( this.URL + 'tblCategorias' , {params: parametros});
  }

}
