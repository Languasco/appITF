using Negocio.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_ITF.Controllers.Procesos
{
    [EnableCors("*", "*", "*")]
    public class TargetController : ApiController
    {
        public object GetTarget(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    int idCategoria = Convert.ToInt32(parametros[1].ToString());
                    int idEspecialidad = Convert.ToInt32(parametros[2].ToString());
                    string medico = parametros[3].ToString();
                    int idEstado = Convert.ToInt32(parametros[4].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrarTarget(idUsuario, idCategoria, idEspecialidad, medico, idEstado);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    string opcionTarget = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Target_BL obj_negocio = new Target_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_grabar_ImportacionTarget(opcionTarget,idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());
                    string opcionTarget = parametros[4].ToString();

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrarAltasBajasTarget_cab(idUsuario, fechaIni, fechaFin, idEstado, opcionTarget);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    string medico = parametros[0].ToString();
                    int idCategoria = Convert.ToInt32(parametros[1].ToString());
                    int idEspecialidad = Convert.ToInt32(parametros[2].ToString());
                    string opcionTarget = parametros[3].ToString();
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrarAltasBajasTarget_medico(medico, idCategoria, idEspecialidad, opcionTarget, idUsuario);
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    int idTargetCab = Convert.ToInt32(parametros[0].ToString());
                    string detalleTarget = parametros[1].ToString();
                    string opcionTarget = parametros[2].ToString();
                    int idUsuario = Convert.ToInt32(parametros[3].ToString());

                    Target_BL obj_negocios = new Target_BL(); 

                    res.ok = true;
                    res.data = obj_negocios.Set_insert_update_AltasBajasTarget(idTargetCab, detalleTarget, opcionTarget, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idTargetCab = Convert.ToInt32(parametros[0].ToString());
                    string opcionTarget = parametros[1].ToString();
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_AltasBajas_detalleTarget(idTargetCab, opcionTarget, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                /// APROBAR ALTAS BAJAS TARGET 
                /// 
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());
                    string opcionTarget = parametros[4].ToString();
                    int idUsuariologeado = Convert.ToInt32(parametros[5].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrar_Aprobar_AltasBajasTarget_cab(idUsuario, fechaIni, fechaFin, idEstado, opcionTarget, idUsuariologeado);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');
                    int idTargetCab = Convert.ToInt32(parametros[0].ToString());
                    string opcionTarget = parametros[1].ToString();
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_AprobacionAltasBajas_detalleTarget(idTargetCab, opcionTarget, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');

                    int idTargetDet = Convert.ToInt32(parametros[0].ToString());
                    int nroContactos = Convert.ToInt32(parametros[1].ToString());
                    string opcionTarget = parametros[2].ToString();
                    string opcionEstado = parametros[3].ToString();
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    Target_BL obj_negocio = new Target_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_aprobarRechazar_altasBajas_target(idTargetDet, nroContactos, opcionTarget, opcionEstado, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idMedico = Convert.ToInt32(parametros[0].ToString());
 
                    Target_BL obj_negocios = new Target_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_informacionMedico_target(idMedico);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');

                    int idTargetCab = Convert.ToInt32(parametros[0].ToString());
                    string opcionTarget = parametros[1].ToString();
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    Target_BL obj_negocios = new Target_BL();

                    res.ok = true;
                    res.data = obj_negocios.Set_finalizar_aprobacion_AltasBajasTarget(idTargetCab, opcionTarget, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    int idCategoria = Convert.ToInt32(parametros[1].ToString());
                    int idEspecialidad = Convert.ToInt32(parametros[2].ToString());
                    string rucRazonSocial = parametros[3].ToString();
                    int idEstado = Convert.ToInt32(parametros[4].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrarTarget_boticasFarmacias(idUsuario, idCategoria, idEspecialidad, rucRazonSocial, idEstado);
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    string opcionTarget = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Target_BL obj_negocio = new Target_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_grabar_ImportacionTarget_boticasFarmacias(opcionTarget, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());
                    string opcionTarget = parametros[4].ToString();

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrarAltasBajasTarget_boticasFarmacias_cab(idUsuario, fechaIni, fechaFin, idEstado, opcionTarget);
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');

                    int idTargetCab = Convert.ToInt32(parametros[0].ToString());
                    string detalleTarget = parametros[1].ToString();
                    string opcionTarget = parametros[2].ToString();
                    int idUsuario = Convert.ToInt32(parametros[3].ToString());

                    Target_BL obj_negocios = new Target_BL();

                    res.ok = true;
                    res.data = obj_negocios.Set_insert_update_AltasBajasTarget_boticasFarmacias(idTargetCab, detalleTarget, opcionTarget, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
 
                    string rucRazonSocial = parametros[0].ToString();
                    string codigo_departamento = parametros[1].ToString();
                    string codigo_provincia = parametros[2].ToString();
                    string codigo_distrito = parametros[3].ToString();
                    string opcionTarget = parametros[4].ToString();
                    int idUsuario = Convert.ToInt32(parametros[5].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrarAltasBajasTarget_boticasFarmacias(rucRazonSocial, codigo_departamento, codigo_provincia, codigo_distrito, opcionTarget, idUsuario);
                }
                else if (opcion == 17)
                {
                    string[] parametros = filtro.Split('|');
                    int idTargetCab = Convert.ToInt32(parametros[0].ToString());
                    string opcionTarget = parametros[1].ToString();
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_AltasBajas_detalleTarget_boticasFarmacias(idTargetCab, opcionTarget, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());
                    string opcionTarget = parametros[4].ToString();
                    int idUsuariologeado = Convert.ToInt32(parametros[5].ToString());

                    Target_BL obj_negocios = new Target_BL();
                    resul = obj_negocios.get_mostrar_Aprobar_AltasBajasTarget_BoticasFarmacias(idUsuario, fechaIni, fechaFin, idEstado, opcionTarget, idUsuariologeado);
                }
                else if (opcion == 19)
                {
                    string[] parametros = filtro.Split('|');

                    int idTargetDet = Convert.ToInt32(parametros[0].ToString());
                    int nroContactos = Convert.ToInt32(parametros[1].ToString());
                    string opcionTarget = parametros[2].ToString();
                    string opcionEstado = parametros[3].ToString();
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());
                    int idTargetCab = Convert.ToInt32(parametros[5].ToString());

                    Target_BL obj_negocio = new Target_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_aprobarRechazar_AB_target_boticasFarmacias(idTargetDet, nroContactos, opcionTarget, opcionEstado, idUsuario, idTargetCab);
                    res.totalpage = 0;
                    resul = res;
                }

                else
                {
                    res.ok = false;
                    res.data = "Opcion seleccionada invalida";
                    res.totalpage = 0;
                    resul = res;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
                resul = res;
            }
            return resul;
        }
    }
}
