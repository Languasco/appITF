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
export class TipoProductoService {

  URL = environment.URL_API;
  tipoProductos :any[] =[];

  constructor(private http:HttpClient) { } 
  
  get_tipoProducto(){
    if (this.tipoProductos.length > 0) {
      return of( this.tipoProductos )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '5');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblTiposProductos' , {params: parametros})
                 .pipe(map((res:any)=>{

                        this.tipoProductos = res.data;
                       return res.data;
                  }) );
    }
  }
 

  get_mostrar_tipoProducto(idEstado:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado));

    return this.http.get( this.URL + 'tblTiposProductos' , {params: parametros});
  }

  get_verificar_codigoTipoProducto(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblTiposProductos' , {params: parametros}).toPromise();
  }

  get_verificar_descripcionTipoProducto(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblTiposProductos' , {params: parametros}).toPromise();
  }


  set_save_tipoProducto(objMantenimiento:any){
    return this.http.post(this.URL + 'tblTiposProductos', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_tipoProducto(objMantenimiento:any, id :number){
    return this.http.put(this.URL + 'tblTiposProductos/' + id , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_tipoProducto(id : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id));

    return this.http.get( this.URL + 'tblTiposProductos' , {params: parametros});
  }

}
