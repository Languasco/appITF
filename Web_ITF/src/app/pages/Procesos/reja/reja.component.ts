
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';

import { combineLatest } from 'rxjs';  
import { ActividadService } from '../../../services/Mantenimientos/actividad.service';
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';
import { TargetService } from '../../../services/Procesos/target.service';
import { CategoriaService } from '../../../services/Mantenimientos/categoria.service';
import { EspecialidadService } from '../../../services/Mantenimientos/especialidad.service';
import { RejaService } from '../../../services/Procesos/reja.service';
import { TipoProductoService } from '../../../services/Mantenimientos/tipo-producto.service';

declare var $:any;

@Component({
  selector: 'app-reja',
  templateUrl: './reja.component.html',
  styleUrls: ['./reja.component.css']
})

export class RejaComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsDet: FormGroup;
 
  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  rejaPromocionalCab :any[]=[]; 
  filtrarMantenimiento = "";
 
  especialidades :any[]=[]; 
  estados :any[]=[]; 
  tipoProductos :any[]=[]; 

  idRejaCab_Global =0;

  idEstadoCabGlobal =0;
  descripcionEstadoGlobal = '';

  especialidadDet :any[]=[]; 
  productoDet :any[]=[]; 
  listProductoBuscar :any[]=[]; 
  filtrarProducto = '';
  
 
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private rejaService : RejaService, private  especialidadService :EspecialidadService, private actividadService :ActividadService , private tipoProductoService :TipoProductoService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormularioDet();
   this.getCargarCombos();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      especialidad : new FormControl('0'), 
      estado : new FormControl('0'),
     }) 
 }

 inicializarFormulario(){ 
  this.formParams= new FormGroup({
    descripcion: new FormControl(''), 
    fecha: new FormControl(new Date()),
  })  
 }

 

 inicializarFormularioDet(){ 
  this.formParamsDet= new FormGroup({
    idEspecialidad: new FormControl('0'), 
    Producto: new FormControl(''), 
    idTipoProducto: new FormControl('0'), 
    descMaterial : new FormControl(''), 
  })  
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.especialidadService.get_especialidades(), this.actividadService.get_estados(),  this.tipoProductoService.get_tipoProducto()  ])
  .subscribe( ([   _especialidades, _estados, _tipoProductos ])=>{
    this.especialidades = _especialidades;
    this.estados = _estados.filter((estado) => estado.grupo_estado =='tbl_Reja_Cab');
    this.tipoProductos = _tipoProductos;
    this.spinner.hide(); 
  })
}

 mostrarInformacion_reja(){  
  this.spinner.show();
  this.rejaService.get_mostrar_rejaPromocional( this.formParamsFiltro.value)
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {        
              this.rejaPromocionalCab = res.data; 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 }   

//-----  CARGA MASIVA ASIGNACION DE USUARIOS  -------

  cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
  }
  
  nuevo(){
    this.flag_modoEdicion = false;
    this.idRejaCab_Global= 0;
    this.idEstadoCabGlobal= 19;
    this.descripcionEstadoGlobal= 'Activo';
  
    this.especialidadDet = [];
    this.productoDet = [];
  
    this.inicializarFormulario();    
    setTimeout(()=>{ // 
      $('#txtDescripcion').removeClass('disabledForm');   
      $('#modal_mantenimiento').modal('show');  
    },0); 
  } 

  agregarEspecialidad(){
     if (this.formParamsDet.value.idEspecialidad  =='0' || this.formParamsDet.value.idEspecialidad  == 0 || this.formParamsDet.value.idEspecialidad == null) {
      this.alertasService.Swal_alert('error','Por favor seleccione primero una especialidad');
       return
     }
  
     if (this.verificarEspecialidadAgregada( this.formParamsDet.value.idEspecialidad ) ==true) {
      this.alertasService.Swal_alert('error', 'La especialidad ya se agregó, verifique ..');
      return;
    }
  
     //---- agregando la especialidad -----
     const { id_Especialidad, descripcion_especialidad } = this.especialidades.find( (esp) => esp.id_Especialidad ==  this.formParamsDet.value.idEspecialidad )
  
     const especialidad = {
       idEspecialidad : id_Especialidad,
       nombreEspecialidad : descripcion_especialidad
     }
    this.especialidadDet.push(especialidad);

    this.formParamsDet.patchValue({"idEspecialidad": '0'});
  
  }
  
  eliminarEspecialidad(item:any){    
    var index = this.especialidadDet.indexOf( item );
    this.especialidadDet.splice( index, 1 ); 
  }
  
  verificarEspecialidadAgregada(_idEspecialidad: number){  
    var flagRepetida=false;
    for (const obj of this.especialidadDet) {
      if (  obj.idEspecialidad == _idEspecialidad ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  cerrarModal_producto(){
    setTimeout(()=>{ // 
      $('#modal_producto').modal('hide');  
    },0); 
  }

  open_modalProducto(){
    this.inicializarFormularioDet();
    this.listProductoBuscar =[];
    this.filtrarProducto = '';
  
    setTimeout(()=>{ // 
      $('#modal_producto').modal('show');  
    },0); 
  } 

  buscarProductos(){  
    this.spinner.show();
    this.rejaService.get_buscar_productos( this.formParamsDet.value, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.listProductoBuscar = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }  

    
  validacionCheckMarcado(){    
    let CheckMarcado = false;
    CheckMarcado = this.funcionesglobalesService.verificarCheck_marcado(this.listProductoBuscar);
  
    if (CheckMarcado ==false) {
      this.alertasService.Swal_alert('error','Por favor debe marcar un producto de la Tabla');
      return false;
    }else{
      return true;
    }
  }

  anadirProductos(){   

    if (this.listProductoBuscar.length == 0) {
      this.alertasService.Swal_alert('error','No hay productos para añadir ..');
      return;
    }
  
    if (this.validacionCheckMarcado()==false){
      return;
    }
  
    const ProdMarcados = this.listProductoBuscar.filter((med)=> med.checkeado);
  
    if (!ProdMarcados) {
      return;
    }else{    
      let flagCantNull =false;
      for (const med of ProdMarcados) {
          if (!med.descripcion_material) {
            this.alertasService.Swal_alert('error','Es necesario la descripción del material');
            flagCantNull =true;
            break;
          }
      }
  
      if (flagCantNull) {
          return;
      }
    }
  
    for (const prod of ProdMarcados) {
        //---- verificando que no este agregado ----
      if (this.verificarProductoAgregada( prod.id_Producto ) ==true) {

      }else{
        this.productoDet.push(prod);
        this.alertasService.Swal_alert('success','Se añadieron los productos');
      }
    }
     this.cerrarModal_producto();   
    
  }

  verificarProductoAgregada(idProducto: number){  
    var flagRepetida=false;
    for (const obj of this.productoDet) {
      if (  obj.id_Producto == idProducto ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  eliminarProducto(item:any){    
    var index = this.productoDet.indexOf( item );
    this.productoDet.splice( index, 1 );
  }
  
  async saveUpdate_rejaPromocional(){    

    if (this.formParams.value.descripcion =='') {
      this.alertasService.Swal_alert('error','Por favor debe agregar una descripcion de la Reja Promocional');
      return 
    }

    if (this.especialidadDet.length <= 0) {
      this.alertasService.Swal_alert('error','Por favor debe agregar al menos una Especialidad');
      return 
    }   
    if (this.productoDet.length <= 0) {
      this.alertasService.Swal_alert('error','Por favor debe agregar al menos un Producto');
      return 
    } 

    const listEspecialidad = this.funcionesglobalesService.obtenerTodos_IdPrincipal(this.especialidadDet,'idEspecialidad')
 
    // const listProducto = this.productoDet.map( (product) =>{
    //    return { id_Producto : product.id_Producto, descripcion_Material : product.descripcion_material }
    // })  

    let listProducto :any =[];
    for (let obj of this.productoDet) {
      listProducto.push( String(obj.id_Producto) + '_' + String(obj.descripcion_material).trim() );
    }   
 
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();

    this.rejaService.set_insert_update_rejaPromocional( this.idRejaCab_Global, this.formParams.value.descripcion, listEspecialidad.join(), listProducto.join(), this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      Swal.close();    
      if (res.ok ==true) { 
        this.mostrarInformacion_reja();
        this.alertasService.Swal_Success('Proceso generado correctamente..');  
        this.cerrarModal();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })    
  } 


  editar_reja({ id_Reja_Cab,  descripcion, fecha, idEstado, descripcionEstado}){

    this.flag_modoEdicion = true;
    this.idRejaCab_Global= id_Reja_Cab;
    this.idEstadoCabGlobal= idEstado;
    this.descripcionEstadoGlobal= descripcionEstado;
  
    this.especialidadDet = [];
    this.productoDet = [];
  
    this.inicializarFormulario();  
    this.formParams.patchValue({ "descripcion" : descripcion, 'fecha' : fecha });  
     
    //----obteniendo los medicos detalle Solicitud ----
    this.detalleReja_especialidades();
    this.detalleReja_productos();
  
     setTimeout(()=>{ // 
      $('#txtDescripcion').addClass('disabledForm');   
      $('#modal_mantenimiento').modal('show');  
    },0);  
  
  } 

  
  detalleReja_especialidades(){ 
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.rejaService.get_detalleReja_especialidades(this.idRejaCab_Global, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
          Swal.close();    
            if (res.ok==true) {        
                this.especialidadDet = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }  

  detalleReja_productos(){ 
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.rejaService.get_detalleReja_productos(this.idRejaCab_Global, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
          Swal.close();    
            if (res.ok==true) {        
                this.productoDet = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }  




}
