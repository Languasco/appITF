using Datos;
using Entidades.Mantenimientos;
using Negocio.Mantenimientos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_ITF.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class BoticasFarmaciasController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        [HttpPost]
        [Route("api/BoticasFarmacias/PostBoticasFarmacia")]
        public object PostBoticasFarmacia(BoticasFarmacias_E objMantenimiento)
        {
            Resultado res = new Resultado();
            try
            {
                Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                res.ok = true;
                res.data = obj_negocios.set_save_update_boticasFarmacias(objMantenimiento);
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }
 
        [HttpPost]
        [Route("api/BoticasFarmacias/PostSolicitudBoticasFarmacia")]
        public object PostSolicitudBoticasFarmacia(SolicitudesBoticasFarmacias_E objMantenimiento)
        {
            Resultado res = new Resultado();
            try
            {
                Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                res.ok = true;
                res.data = obj_negocios.set_save_update_SolicitudesBoticasFarmacias(objMantenimiento);
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }



    }
}
