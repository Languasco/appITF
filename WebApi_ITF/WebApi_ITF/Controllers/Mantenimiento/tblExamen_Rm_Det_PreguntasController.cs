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

namespace WebApi_ITF.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblExamen_Rm_Det_PreguntasController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblExamen_Rm_Det_Preguntas
        public IQueryable<tbl_Examen_Rm_Det_Preguntas> Gettbl_Examen_Rm_Det_Preguntas()
        {
            return db.tbl_Examen_Rm_Det_Preguntas;
        }

        // GET: api/tblExamen_Rm_Det_Preguntas/5
        [ResponseType(typeof(tbl_Examen_Rm_Det_Preguntas))]
        public IHttpActionResult Gettbl_Examen_Rm_Det_Preguntas(int id)
        {
            tbl_Examen_Rm_Det_Preguntas tbl_Examen_Rm_Det_Preguntas = db.tbl_Examen_Rm_Det_Preguntas.Find(id);
            if (tbl_Examen_Rm_Det_Preguntas == null)
            {
                return NotFound();
            }

            return Ok(tbl_Examen_Rm_Det_Preguntas);
        }

        // PUT: api/tblExamen_Rm_Det_Preguntas/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Examen_Rm_Det_Preguntas(int id, tbl_Examen_Rm_Det_Preguntas tbl_Examen_Rm_Det_Preguntas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Examen_Rm_Det_Preguntas.id_Examen_RM_Det_Preguntas)
            {
                return BadRequest();
            }

            db.Entry(tbl_Examen_Rm_Det_Preguntas).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Examen_Rm_Det_PreguntasExists(id))
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


        public object Posttbl_Examen_Rm_Det_Preguntas(tbl_Examen_Rm_Det_Preguntas tbl_Examen_Rm_Det_Preguntas)
        {
            Resultado res = new Resultado();
            try
            {
                db.tbl_Examen_Rm_Det_Preguntas.Add(tbl_Examen_Rm_Det_Preguntas);
                db.SaveChanges();

                res.ok = true;
                res.data = 0;
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




        // DELETE: api/tblExamen_Rm_Det_Preguntas/5
        [ResponseType(typeof(tbl_Examen_Rm_Det_Preguntas))]
        public IHttpActionResult Deletetbl_Examen_Rm_Det_Preguntas(int id)
        {
            tbl_Examen_Rm_Det_Preguntas tbl_Examen_Rm_Det_Preguntas = db.tbl_Examen_Rm_Det_Preguntas.Find(id);
            if (tbl_Examen_Rm_Det_Preguntas == null)
            {
                return NotFound();
            }

            db.tbl_Examen_Rm_Det_Preguntas.Remove(tbl_Examen_Rm_Det_Preguntas);
            db.SaveChanges();

            return Ok(tbl_Examen_Rm_Det_Preguntas);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Examen_Rm_Det_PreguntasExists(int id)
        {
            return db.tbl_Examen_Rm_Det_Preguntas.Count(e => e.id_Examen_RM_Det_Preguntas == id) > 0;
        }
    }
}