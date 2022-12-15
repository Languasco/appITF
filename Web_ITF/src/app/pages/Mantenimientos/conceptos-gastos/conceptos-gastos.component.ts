
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { MonedaService } from '../../../services/Mantenimientos/moneda.service';
import { GastosService } from 'src/app/services/Mantenimientos/gastos.service';

declare var $:any;

@Component({
  selector: 'app-conceptos-gastos',
  templateUrl: './conceptos-gastos.component.html',
  styleUrls: ['./conceptos-gastos.component.css']
})
 

export class ConceptosGastosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  conceptosGastos :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, 
    private funcionesglobalesService : FuncionesglobalesService, private monedaService : MonedaService , private gastosService : GastosService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_conceptos_gastos: new FormControl('0'), 
      descripcion_conceptos_gastos: new FormControl(''),
      cuenta_contable: new FormControl(''), 
      requiere_imagen: new FormControl(false), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){ 
      this.spinner.show();
      this.gastosService.get_mostrar_conceptosGastos(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.conceptosGastos = res.data; 
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
      // $('#txtcodigo').removeClass('disabledForm');
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_conceptos_gastos == '' || this.formParams.value.id_conceptos_gastos == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id moneda, por favor actulize su página');
       return 
     }   
  } 

  if (this.formParams.value.descripcion_conceptos_gastos == '' || this.formParams.value.descripcion_conceptos_gastos == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion');
    return 
  } 

  if (this.formParams.value.cuenta_contable == '' || this.formParams.value.cuenta_contable == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la cuenta contable');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

    //  const codMon  = await this.monedaService.get_verificar_codigoMoneda(this.formParams.value.codigo_moneda);
    //  if (codMon) {
    //   Swal.close();
    //   this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
    //   return;
    //  }    

    //  const  descMon  = await this.monedaService.get_verificar_descripcionMoneda(this.formParams.value.descripcion_conceptos_gastos);
    //  if (descMon) {
    //   Swal.close();
    //   this.alertasService.Swal_alert('error','La descripcion ya se encuentra registrada, verifique..');
    //   return;
    //  }   

     this.gastosService.set_save_conceptosGastos( {...this.formParams.value, requiere_imagen : (this.formParams.value.requiere_imagen) ? 1 : 0 }).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.mostrarInformacion();
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
     this.gastosService.set_edit_conceptosGastos({...this.formParams.value, requiere_imagen : (this.formParams.value.requiere_imagen) ? 1 : 0 } , this.formParams.value.id_conceptos_gastos).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {           

         for (const obj of this.conceptosGastos) {
           if (obj.id_conceptos_gastos == this.formParams.value.id_conceptos_gastos ) {
              obj.descripcion_conceptos_gastos= this.formParams.value.descripcion_conceptos_gastos ; 
              obj.cuenta_contable= this.formParams.value.cuenta_contable ; 
              obj.requiere_imagen=  (this.formParams.value.requiere_imagen)? 1 : 0; 
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

 editar({ id_conceptos_gastos, descripcion_conceptos_gastos, cuenta_contable, requiere_imagen, estado  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_conceptos_gastos" : id_conceptos_gastos,  "descripcion_conceptos_gastos" : descripcion_conceptos_gastos, "cuenta_contable" : cuenta_contable, requiere_imagen : (requiere_imagen==1)? true: false , "estado" : estado, "usuario_creacion" : this.idUserGlobal });
   setTimeout(()=>{ // 
    // $('#txtcodigo').addClass('disabledForm');
    $('#modal_mantenimiento').modal('show');  
  },0);  
 } 

 anular(objBD:any){

   if (objBD.estado ===2 || objBD.estado =='2') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.gastosService.set_anular_conceptosGastos(objBD.id_conceptos_gastos).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.conceptosGastos) {
             if (user.id_conceptos_gastos == objBD.id_conceptos_gastos ) {
                 user.estado = 0;
                 user.descripcion_estado =  "Inactivo" ;
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