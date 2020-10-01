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
        public object Gettbl_Stock(int opcion, string filtro)
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
