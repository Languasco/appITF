using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Datos;
using Negocio.Mantenimientos;
using Negocio.Procesos;
using Negocio.Resultados;

namespace WebApi_ITF.Controllers.Procesos
{
    [EnableCors("*", "*", "*")]
    public class tblSolMedico_DetController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblSolMedico_Det
        public IQueryable<tbl_Sol_Medico_Det> Gettbl_Sol_Medico_Det()
        {
            return db.tbl_Sol_Medico_Det;
        }

        public object Gettbl_Sol_Medico_Det(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                     int idSolCab = Convert.ToInt32(parametros[0].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_solicitudDetalle(idSolCab);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idSolCab = Convert.ToInt32(parametros[0].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_aprobacionSolicitudDetalle(idSolCab);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int id_SolMedicodet = Convert.ToInt32(parametros[0].ToString());
                    string descripcion = parametros[1].ToString();
                    string proceso = parametros[2].ToString();
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();

                    res.ok = true;
                    res.data = obj_negocios.set_aprobarRechazar_medico(id_SolMedicodet, descripcion, proceso, id_usuario);
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

        // PUT: api/tblSolMedico_Det/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Sol_Medico_Det(int id, tbl_Sol_Medico_Det tbl_Sol_Medico_Det)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Sol_Medico_Det.id_Sol_Medico_Det)
            {
                return BadRequest();
            }

            db.Entry(tbl_Sol_Medico_Det).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Sol_Medico_DetExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }


        public object Posttbl_Sol_Medico_Det(tbl_Sol_Medico_Det tbl_Sol_Medico_Det)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Sol_Medico_Det.fecha_creacion = DateTime.Now;
                db.tbl_Sol_Medico_Det.Add(tbl_Sol_Medico_Det);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Sol_Medico_Det.id_Sol_Medico_Det;
                res.totalpage = 0;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }


        // DELETE: api/tblSolMedico_Det/5
        [ResponseType(typeof(tbl_Sol_Medico_Det))]
        public IHttpActionResult Deletetbl_Sol_Medico_Det(int id)
        {
            tbl_Sol_Medico_Det tbl_Sol_Medico_Det = db.tbl_Sol_Medico_Det.Find(id);
            if (tbl_Sol_Medico_Det == null)
            {
                return NotFound();
            }

            db.tbl_Sol_Medico_Det.Remove(tbl_Sol_Medico_Det);
            db.SaveChanges();

            return Ok(tbl_Sol_Medico_Det);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Sol_Medico_DetExists(int id)
        {
            return db.tbl_Sol_Medico_Det.Count(e => e.id_Sol_Medico_Det == id) > 0;
        }
    }
}