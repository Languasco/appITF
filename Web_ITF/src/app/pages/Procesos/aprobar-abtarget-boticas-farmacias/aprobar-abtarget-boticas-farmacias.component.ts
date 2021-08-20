
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
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
import { ActivatedRoute } from '@angular/router';
import { MedicoService } from '../../../services/Mantenimientos/medico.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';

declare var $:any;

@Component({
  selector: 'app-aprobar-abtarget-boticas-farmacias',
  templateUrl: './aprobar-abtarget-boticas-farmacias.component.html',
  styleUrls: ['./aprobar-abtarget-boticas-farmacias.component.css']
})
export class AprobarABTargetBoticasFarmaciasComponent implements OnInit {

  formParamsFiltro : FormGroup;
  idUserGlobal :number = 0;
  UsuarioLoggeadoGlobal ="";
  id_TargetCab_Global :number = 0;

  idEstadoCabGlobal:number = 0;
  descripcionEstadoGlobal= "";
  flag_modoEdicion :boolean =false;

  targetCab :any[]=[]; 
  filtrarMantenimiento = "";
  usuarios :any[]=[]; 
  estados :any[]=[]; 
  // -------importaciones 
  flagImportar=false;
  filesExcel:InputFileI[] = [];
  importacion:any [] = [];
  opcionTarget='';
  tituloTarget='';
  targetDet:any [] = [];

    constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private targetService : TargetService, private uploadService : UploadService, private categoriaService :CategoriaService, private  especialidadService :EspecialidadService, private actividadService :ActividadService, private activatedRoute:ActivatedRoute , private medicoService :  MedicoService ) {     
  
      this.idUserGlobal = this.loginService.get_idUsuario();
      this.UsuarioLoggeadoGlobal = this.loginService.getSessionNombre();
  
      //---obtener el parametro que viene por la url
      this.activatedRoute.params.subscribe(params=>{
        this.opcionTarget = params['opcionTarget'];      
        if( this.opcionTarget =='A'){
          this.tituloTarget = 'APROBAR ALTA DE TARGET DE BOTICAS Y FARMACIAS';
        }else{
          this.tituloTarget = 'APROBAR BAJA DE TARGET DE BOTICAS Y FARMACIAS';
        }
      })
    }

  
    ngOnInit(): void {
      this.inicializarFormularioFiltro();
      this.getCargarCombos();
     
       setTimeout(()=>{ // 
          $('.selectFilter').select2();
          $('#cboUsuario_filtro').val(0).trigger('change.select2');
       },0); 
    }

    inicializarFormularioFiltro(){ 
      this.formParamsFiltro= new FormGroup({
        idUsuario : new FormControl('0'),
        fecha_ini : new FormControl(new Date()),
        fecha_fin : new FormControl(new Date()), 
        estado : new FormControl('0'),
       }) 
    }
      
   getCargarCombos(){ 
    this.spinner.show();
    combineLatest([ this.actividadService.get_usuarios(this.idUserGlobal), this.actividadService.get_estados()  ])
    .subscribe( ([ _usuarios, _estados ])=>{
      this.usuarios = _usuarios;
      this.estados = _estados.filter((estado) => estado.grupo_estado =='tbl_Target_Cab');  
      this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });  
      this.spinner.hide(); 
    })
   }
   
   mostrarInformacion(){   
    if (this.opcionTarget == '' || this.opcionTarget == null || this.opcionTarget == undefined) {
      this.alertasService.Swal_alert('error','No se cargo el tipo de Target, Actualice la pagina');
      return 
    }
  
    if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
      return 
    } 
    if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
      this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
      return 
    } 
    const fechaIni = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_ini);
    const fechaFin = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_fin);
  
    this.spinner.show();
    this.targetService.get_mostrar_AprobarRechazar_AB_Target_boticasFarmacias( this.formParamsFiltro.value, this.opcionTarget, fechaIni, fechaFin, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.targetCab = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
   }  
   
   async aprobarRechazar_altasBajas_target(opcion:string,objTarget:any ){ 

    console.log(objTarget);
 

    let nroContact =0;
    if(opcion =='A'){
  
      // if (objTarget.nrovisita == 0 || objTarget.nrovisita == '0') {
      //   this.alertasService.Swal_alert('error', objTarget.mensajeNrovisita);
      //   return;
      // }
      // if (!objTarget.nro_contactos) {
      //   this.alertasService.Swal_alert('error','Es necesario ingresar un número de contacto');
      //    return;
      // }
      // if ( Number(objTarget.nro_contactos) <=0 ) {
      //   this.alertasService.Swal_alert('error','Tiene que ingresar un valor positivo');
      //   return;
      // }
      nroContact = objTarget.numero_contactos_target_det;
    } 
  
    let mens = (opcion =='A') ? 'Esta seguro de Aprobar ?' : 'Esta seguro de Rechazar ?';
    let mensAlert = (opcion =='A') ? 'Aprobado correctamente ..' : 'Rechazado correctamente ..';
  
    this.alertasService.Swal_Question('Sistemas', mens)
    .then((result)=>{
      if(result.value){
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
        Swal.showLoading();
        this.targetService.set_AprobarRechazar_AB_Target_boticasFarmacias(objTarget.id_Target_Det, nroContact, this.opcionTarget, opcion, this.idUserGlobal , objTarget.id_Target_cab ).subscribe((res:RespuestaServer)=>{
          Swal.close(); 
          if (res.ok ==true) {   
  
            this.alertasService.Swal_alert('success',mensAlert);
            
            for (const target of this.targetDet) {
               if (target.id_Target_Det == objTarget.id_Target_Det ) {
                  if (opcion =='A') {
                    target.idEstado = 18;
                    target.descripcionEstado = 'Aprobada';
                  }else{
                    target.idEstado = 17;
                    target.descripcionEstado = 'Rechazada';
                  }             
               }
            }         
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
      }
    })
  
  } 
  


}
