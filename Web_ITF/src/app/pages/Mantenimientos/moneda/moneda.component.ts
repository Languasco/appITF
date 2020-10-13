
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { MonedaService } from '../../../services/Mantenimientos/moneda.service';

declare var $:any;
@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrls: ['./moneda.component.css']
})

export class MonedaComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  monedas :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private monedaService : MonedaService , private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
  //  $('.selectFiltros').select2({
  //   dropdownParent: $('#modal_mantenimiento')
  //  }); //initialize 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Moneda: new FormControl('0'), 
      codigo_moneda: new FormControl(''),
      descripcion_moneda: new FormControl(''), 
      simbolo_moneda: new FormControl(''), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){ 
      this.spinner.show();
      this.monedaService.get_mostrar_moneda(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.monedas = res.data; 
              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
 }

 nuevo(){
    this.flag_modoEdicion = false;
    this.inicializarFormulario();  
    setTimeout(()=>{ // 
      $('#txtcodigo').removeClass('disabledForm');
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Moneda == '' || this.formParams.value.id_Moneda == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id moneda, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.codigo_moneda == '' || this.formParams.value.codigo_moneda == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el codigo de la moneda');
    return 
  }

  if (this.formParams.value.descripcion_moneda == '' || this.formParams.value.descripcion_moneda == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion de la moneda');
    return 
  } 

  if (this.formParams.value.simbolo_moneda == '' || this.formParams.value.simbolo_moneda == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el simbolo');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const codMon  = await this.monedaService.get_verificar_codigoMoneda(this.formParams.value.codigo_moneda);
     if (codMon) {
      Swal.close();
      this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
      return;
     }    

     const  descMon  = await this.monedaService.get_verificar_descripcionMoneda(this.formParams.value.descripcion_moneda);
     if (descMon) {
      Swal.close();
      this.alertasService.Swal_alert('error','La descripcion ya se encuentra registrada, verifique..');
      return;
     }  
 

     this.monedaService.set_save_moneda(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Moneda" : Number(res.data[0].id_Moneda) });
         console.log(res.data[0])
         this.monedas.push(res.data[0]);
         this.cerrarModal();
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.monedaService.set_edit_moneda(this.formParams.value , this.formParams.value.id_Moneda).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {           

         for (const obj of this.monedas) {
           if (obj.id_Moneda == this.formParams.value.id_Moneda ) {
              obj.descripcion_moneda= this.formParams.value.descripcion_moneda ; 
              obj.simbolo_moneda= this.formParams.value.simbolo_moneda ; 
              obj.estado= this.formParams.value.estado ;
              obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";  
              break;
           }
         }
         this.cerrarModal();
         this.alertasService.Swal_Success('Se actualizó correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({ id_Moneda, codigo_moneda, descripcion_moneda, simbolo_moneda, estado  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Moneda" : id_Moneda,  "codigo_moneda" : codigo_moneda ,"descripcion_moneda" : descripcion_moneda, "simbolo_moneda" : simbolo_moneda, "estado" : estado, "usuario_creacion" : this.idUserGlobal });
   setTimeout(()=>{ // 
    $('#txtcodigo').addClass('disabledForm');
    $('#modal_mantenimiento').modal('show');  
  },0);  
 } 

 anular(objBD:any){

   if (objBD.estado ===0 || objBD.estado =='0') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.monedaService.set_anular_moneda(objBD.id_Moneda).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.monedas) {
             if (user.id_Moneda == objBD.id_Moneda ) {
                 user.estado = 0;
                 user.descripcion_estado =  "INACTIVO" ;
                 break;
             }
           }
           this.alertasService.Swal_Success('Se anulo correctamente..')  

         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
        
     }
   }) 

   
 }


}