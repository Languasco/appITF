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
using Negocio.Resultados;

namespace WebApi_ITF.Controllers.Procesos
{
    [EnableCors("*", "*", "*")]
    public class tblProgramacion_CabController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblProgramacion_Cab
        public IQueryable<tbl_Programacion_Cab> Gettbl_Programacion_Cab()
        {
            return db.tbl_Programacion_Cab;
        }

        // GET: api/tblProgramacion_Cab/5
        [ResponseType(typeof(tbl_Programacion_Cab))]
        public IHttpActionResult Gettbl_Programacion_Cab(int id)
        {
            tbl_Programacion_Cab tbl_Programacion_Cab = db.tbl_Programacion_Cab.Find(id);
            if (tbl_Programacion_Cab == null)
            {
                return NotFound();
            }

            return Ok(tbl_Programacion_Cab);
        }
 
        public object Puttbl_Programacion_Cab(int id, tbl_Programacion_Cab tbl_Programacion_Cab, DateTime horaProgramacion, DateTime? horaReporte = null )
        {
            Resultado res = new Resultado();

            tbl_Programacion_Cab objReemplazar;
            objReemplazar = db.tbl_Programacion_Cab.Where(u => u.id_Programacion_cab == id).FirstOrDefault<tbl_Programacion_Cab>();

            objReemplazar.id_Medicos_Direccion = tbl_Programacion_Cab.id_Medicos_Direccion;
            objReemplazar.fecha_programacion_programacion_cab = tbl_Programacion_Cab.fecha_programacion_programacion_cab;
            objReemplazar.hora_programacion_programacion_cab = horaProgramacion;


            objReemplazar.fecha_reporte_programacion_cab = tbl_Programacion_Cab.fecha_reporte_programacion_cab;
            objReemplazar.hora_reporte_programacion_cab = horaReporte;
            objReemplazar.id_resultado_visita = tbl_Programacion_Cab.id_resultado_visita;

            objReemplazar.visita_acompaniada_programacion_cab = tbl_Programacion_Cab.visita_acompaniada_programacion_cab;
            objReemplazar.datos_acompaniante_programacion_cab = tbl_Programacion_Cab.datos_acompaniante_programacion_cab;

            objReemplazar.estado_programacion_cab = tbl_Programacion_Cab.estado_programacion_cab;
            objReemplazar.comentarios = tbl_Programacion_Cab.comentarios;

            objReemplazar.usuario_edicion = tbl_Programacion_Cab.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
                res.ok = true;
                res.data = "OK";
                res.totalpage = 0;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
                res.totalpage = 0;
            }

            return res;
        }
               
        // POST: api/tblProgramacion_Cab
        [ResponseType(typeof(tbl_Programacion_Cab))]
        public IHttpActionResult Posttbl_Programacion_Cab(tbl_Programacion_Cab tbl_Programacion_Cab)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.tbl_Programacion_Cab.Add(tbl_Programacion_Cab);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tbl_Programacion_Cab.id_Programacion_cab }, tbl_Programacion_Cab);
        }

        // DELETE: api/tblProgramacion_Cab/5
        [ResponseType(typeof(tbl_Programacion_Cab))]
        public IHttpActionResult Deletetbl_Programacion_Cab(int id)
        {
            tbl_Programacion_Cab tbl_Programacion_Cab = db.tbl_Programacion_Cab.Find(id);
            if (tbl_Programacion_Cab == null)
            {
                return NotFound();
            }

            db.tbl_Programacion_Cab.Remove(tbl_Programacion_Cab);
            db.SaveChanges();

            return Ok(tbl_Programacion_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Programacion_CabExists(int id)
        {
            return db.tbl_Programacion_Cab.Count(e => e.id_Programacion_cab == id) > 0;
        }
    }
}