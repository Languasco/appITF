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
    public class tblExamen_Rm_Det_UsuariosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblExamen_Rm_Det_Usuarios
        public IQueryable<tbl_Examen_Rm_Det_Usuarios> Gettbl_Examen_Rm_Det_Usuarios()
        {
            return db.tbl_Examen_Rm_Det_Usuarios;
        }

        // GET: api/tblExamen_Rm_Det_Usuarios/5
        [ResponseType(typeof(tbl_Examen_Rm_Det_Usuarios))]
        public IHttpActionResult Gettbl_Examen_Rm_Det_Usuarios(int id)
        {
            tbl_Examen_Rm_Det_Usuarios tbl_Examen_Rm_Det_Usuarios = db.tbl_Examen_Rm_Det_Usuarios.Find(id);
            if (tbl_Examen_Rm_Det_Usuarios == null)
            {
                return NotFound();
            }

            return Ok(tbl_Examen_Rm_Det_Usuarios);
        }

        // PUT: api/tblExamen_Rm_Det_Usuarios/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Puttbl_Examen_Rm_Det_Usuarios(int id, tbl_Examen_Rm_Det_Usuarios tbl_Examen_Rm_Det_Usuarios)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tbl_Examen_Rm_Det_Usuarios.id_Examen_RM_Det_Usuarios)
            {
                return BadRequest();
            }

            db.Entry(tbl_Examen_Rm_Det_Usuarios).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!tbl_Examen_Rm_Det_UsuariosExists(id))
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
         
        public object Posttbl_Examen_Rm_Det_Usuarios(tbl_Examen_Rm_Det_Usuarios tbl_Examen_Rm_Det_Usuarios)
        {
            Resultado res = new Resultado();
            try
            {
                db.tbl_Examen_Rm_Det_Usuarios.Add(tbl_Examen_Rm_Det_Usuarios);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Examen_Rm_Det_Usuarios.id_Examen_Rm_Cab;
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


        // DELETE: api/tblExamen_Rm_Det_Usuarios/5
        [ResponseType(typeof(tbl_Examen_Rm_Det_Usuarios))]
        public IHttpActionResult Deletetbl_Examen_Rm_Det_Usuarios(int id)
        {
            tbl_Examen_Rm_Det_Usuarios tbl_Examen_Rm_Det_Usuarios = db.tbl_Examen_Rm_Det_Usuarios.Find(id);
            if (tbl_Examen_Rm_Det_Usuarios == null)
            {
                return NotFound();
            }

            db.tbl_Examen_Rm_Det_Usuarios.Remove(tbl_Examen_Rm_Det_Usuarios);
            db.SaveChanges();

            return Ok(tbl_Examen_Rm_Det_Usuarios);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Examen_Rm_Det_UsuariosExists(int id)
        {
            return db.tbl_Examen_Rm_Det_Usuarios.Count(e => e.id_Examen_RM_Det_Usuarios == id) > 0;
        }
    }
}