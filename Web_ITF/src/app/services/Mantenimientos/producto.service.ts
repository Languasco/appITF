 


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
export class ProductoService {

  URL = environment.URL_API;
  stocks :any[] =[];
  constructor(private http:HttpClient) { }  


    
  get_controlStock(){
    if (this.stocks.length > 0) {
      return of( this.stocks )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '4');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblProductos' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.stocks = res.data;
                       return res.data;
                  }) );
    }
  }


  get_mostrar_producto({ Producto,TipoProducto,idEstado }){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(Producto) +'|'+ Number(TipoProducto)  +'|'+ Number(idEstado));
    return this.http.get( this.URL + 'tblProductos' , {params: parametros});
  }

  get_verificar_codigoProd(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblProductos' , {params: parametros}).toPromise();
  }

  get_verificar_abreviaturaProd(descRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', descRol);

    return this.http.get( this.URL + 'tblProductos' , {params: parametros}).toPromise();
  }


  set_save_producto(objMantenimiento:any){
    return this.http.post(this.URL + 'tblProductos', JSON.stringify(objMantenimiento), httpOptions);
  }

  set_edit_producto(objMantenimiento:any, id_perfil :number){
    return this.http.put(this.URL + 'tblProductos/' + id_perfil , JSON.stringify(objMantenimiento), httpOptions);
  }

  set_anular_producto(id_perfil : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro',  String(id_perfil));

    return this.http.get( this.URL + 'tblProductos' , {params: parametros});
  }

}
