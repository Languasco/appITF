using Datos;
using Entidades.Procesos;
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
    public class ProgramacionController : ApiController
    {

        private ITF_PERUEntities db = new ITF_PERUEntities();

        public object GetProgramacion(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            ProgramacionBL obj_negocios = new ProgramacionBL();

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    int idCiclo = Convert.ToInt32(parametros[1].ToString());
                    string medico = parametros[2].ToString();

                    int idCategoria = Convert.ToInt32(parametros[3].ToString());
                    int idEspecialidad = Convert.ToInt32(parametros[4].ToString());
                    int idResultado = Convert.ToInt32(parametros[5].ToString());
                    int idEstado = Convert.ToInt32(parametros[6].ToString());
                    
                    resul = obj_negocios.get_mostrarProgramaciones(idUsuario, idCiclo, medico, idCategoria, idEspecialidad, idResultado, idEstado);
                }
                else if (opcion == 2)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Resultados_Visitas
                                select new
                                {
                                    a.id_Resultado_Visita,
                                    a.descripcion_resultado_visita,
                                    a.estado
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3 )
                {
                    string[] parametros = filtro.Split('|');
                    int idProgCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_datosProgramacionCab(idProgCab);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idProgCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_datosProgramacionDet(idProgCab);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idMedico = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_datosMedico(idMedico);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idCiclo = Convert.ToInt32(parametros[0].ToString());
                    int idUser = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_datosProductos(idCiclo, idUser);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');
                    int idCiclo = Convert.ToInt32(parametros[0].ToString());
                    int idUser = Convert.ToInt32(parametros[1].ToString());
                    int idProducto = Convert.ToInt32(parametros[2].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_datosStock(idCiclo, idUser, idProducto);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 8)  ///----- usuaarios 
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                   res.ok = true;
                    res.data = obj_negocios.get_usuariosProgramacion(idUsuario);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 9)   
                {
                    string[] parametros = filtro.Split('|');
                    int idMedico = Convert.ToInt32(parametros[0].ToString());

                    //resul = obj_negocios.get_informacionPerfilMedico_Cab(idMedico);
                    res.ok = true;
                    res.data = obj_negocios.get_informacionPerfilMedico_Cab(idMedico);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)   
                {
                    string[] parametros = filtro.Split('|');
                    int idMedico = Convert.ToInt32(parametros[0].ToString());
                    string nombreProducto = parametros[1].ToString();

                    //resul = obj_negocios.get_informacionPerfilMedico_Det(idMedico,nombreProducto);

                    res.ok = true;
                    res.data = obj_negocios.get_informacionPerfilMedico_Det(idMedico, nombreProducto);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 11 )
                {
                    string[] parametros = filtro.Split('|');
                    int idEspecialidad = Convert.ToInt32(parametros[0].ToString());
 
                    res.ok = true;
                    res.data = obj_negocios.get_informacionRejaPromocional(idEspecialidad);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    int opcionModal = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.set_eliminarTemporales(opcionModal);
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
        

        [HttpPost]
            [Route("api/Programacion/set_guardandoDetalleProgramacion")]
            public object set_guardandoDetalleProgramacion(List<ProgramacionDet_E> List_Detalle, int idUsuario)
            {
                Resultado res = new Resultado();
                object resul = null;
                try
                {
                        ProgramacionBL obj_negocio = new ProgramacionBL();
                        res.ok = true;
                        res.data = obj_negocio.Set_almacenandoDetalle_programacion(List_Detalle, idUsuario);
                        res.totalpage = 0;

                        resul = res;
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
