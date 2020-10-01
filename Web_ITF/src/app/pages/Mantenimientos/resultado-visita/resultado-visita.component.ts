
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { ResultadoVisitaService } from '../../../services/Mantenimientos/resultado-visita.service';

declare var $:any;
@Component({
  selector: 'app-resultado-visita',
  templateUrl: './resultado-visita.component.html',
  styleUrls: ['./resultado-visita.component.css']
})

export class ResultadoVisitaComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  pordefectoresultadoGlobal = 0;

  flag_modoEdicion :boolean =false;

  visitas :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService,  private resultadoVisitaService : ResultadoVisitaService , private uploadService : UploadService ) {         
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
      id_Resultado_Visita: new FormControl('0'), 
      descripcion_resultado_visita: new FormControl(''), 
      por_defecto_resultado_visita: new FormControl(false),
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){
 
      this.spinner.show();
      this.resultadoVisitaService.get_mostrar_resultadoVisita(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.visitas = res.data; 
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
     if (this.formParams.value.id_Resultado_Visita == '' || this.formParams.value.id_Resultado_Visita == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id de resultado de visita, por favor actulize su página');
       return 
     }   
  }

  // if (this.formParams.value.codigo_perfil == '' || this.formParams.value.codigo_perfil == 0) {
  //   this.alertasService.Swal_alert('error','Por favor ingrese el codigo del rol');
  //   return 
  // }

  if (this.formParams.value.descripcion_resultado_visita == '' || this.formParams.value.descripcion_resultado_visita == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

    //  const  codRol  = await this.resultadoVisitaService.get_verificar_codigoRol(this.formParams.value.codigo_perfil);
    //  if (codRol) {
    //   Swal.close();
    //   this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
    //   return;
    //  }    

     const  desc  = await this.resultadoVisitaService.get_verificar_descripcionResultadoVisita(this.formParams.value.descripcion_resultado_visita);
     if (desc) {
      Swal.close();
      this.alertasService.Swal_alert('error','El resultado ya se encuentra registrada, verifique..');
      return;
     }   
 
    if (this.formParams.value.por_defecto_resultado_visita == true || this.formParams.value.por_defecto_resultado_visita == 1 ){ 
        const  valordefecto  = await this.resultadoVisitaService.get_verificar_porDefecto();
        if (valordefecto) {
        Swal.close();
        this.alertasService.Swal_alert('error','Existe actualmente un Resultado ya por  Defecto, verifique..');
        return;
        }          
    }

     this.resultadoVisitaService.set_save_resultadoVisita(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Resultado_Visita" : Number(res.data[0].id_Resultado_Visita) });
         console.log(res.data[0])
         this.visitas.push(res.data[0]);
         this.cerrarModal();
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

    const resPorDefecto = (this.formParams.value.por_defecto_resultado_visita) ? 1 : 0 ;
    if (this.pordefectoresultadoGlobal != resPorDefecto ) {
      if (this.formParams.value.por_defecto_resultado_visita == true || this.formParams.value.por_defecto_resultado_visita == 1 ){

        const  valordefecto  = await this.resultadoVisitaService.get_verificar_porDefecto();
        if (valordefecto) {
         Swal.close();
         this.alertasService.Swal_alert('error','Existe actualmente un Resultado ya por  Defecto, verifique..');
         return;
        }          
     }
    }

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.resultadoVisitaService.set_edit_resultadoVisita(this.formParams.value , this.formParams.value.id_Resultado_Visita).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  
         
         for (const obj of this.visitas) {
           if (obj.id_Resultado_Visita == this.formParams.value.id_Resultado_Visita ) {
              obj.descripcion_resultado_visita= this.formParams.value.descripcion_resultado_visita ; 
              obj.por_defecto_resultado_visita= (this.formParams.value.por_defecto_resultado_visita == true) ? 1:0;   
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

 editar({ id_Resultado_Visita, descripcion_resultado_visita, estado, por_defecto_resultado_visita  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Resultado_Visita" : id_Resultado_Visita ,"descripcion_resultado_visita" : descripcion_resultado_visita,  
                                 "por_defecto_resultado_visita" : (por_defecto_resultado_visita == 1) ? true: false , "estado" : estado, "usuario_creacion" : this.idUserGlobal });


   this.pordefectoresultadoGlobal = por_defecto_resultado_visita;
                                 
   setTimeout(()=>{ // 
    // $('#txtcodigo').addClass('disabledForm');
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
       this.resultadoVisitaService.set_anular_resultadoVisita(objBD.id_Resultado_Visita).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.visitas) {
             if (user.id_Resultado_Visita == objBD.id_Resultado_Visita ) {
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
