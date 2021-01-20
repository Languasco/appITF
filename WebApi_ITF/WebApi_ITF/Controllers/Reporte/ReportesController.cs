using Datos;
using Negocio.Reportes;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_ITF.Controllers.Reporte
{
    [EnableCors("*", "*", "*")]
    public class ReportesController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        public object GetReportes(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
 
                if (opcion == 1)  ///----- usuaarios 
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Reportes_BL obj_negocios = new Reportes_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_usuariosCumpleanios(idUsuario);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 2 )   
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Mes
                                select new
                                {
                                    a.id_Mes,
                                    a.nombre,
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3 )  ///----- usuaarios 
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    int idMes = Convert.ToInt32(parametros[1].ToString());

                    Reportes_BL obj_negocios = new Reportes_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_mostrarCumpleanieros(idUsuario, idMes);
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
