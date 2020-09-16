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
    public class tblEspecialidadesController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblEspecialidades
        public IQueryable<tbl_Especialidades> Gettbl_Especialidades()
        {
            return db.tbl_Especialidades;
        }

        public object Gettbl_Especialidades(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;

                    if (idEstado == -1)
                    {
                        res.data = (from a in db.tbl_Especialidades
                                    select new
                                    {
                                        a.id_Especialidad,
                                        a.codigo_especialidad,
                                        a.descripcion_especialidad,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                    }
                    else
                    {
                        res.data = (from a in db.tbl_Especialidades
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Especialidad,
                                        a.codigo_especialidad,
                                        a.descripcion_especialidad,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                    }

                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Especialidad = Convert.ToInt32(parametros[0].ToString());

                    tbl_Especialidades objReemplazar;
                    objReemplazar = db.tbl_Especialidades.Where(u => u.id_Especialidad == id_Especialidad).FirstOrDefault<tbl_Especialidades>();
                    objReemplazar.estado = 0;

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
                    resul = res;

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    string codEsp = parametros[0].ToString().ToUpper();

                    if (db.tbl_Especialidades.Count(e => e.codigo_especialidad.ToUpper() == codEsp) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    string desEsp = parametros[0].ToString().ToUpper();

                    if (db.tbl_Especialidades.Count(e => e.descripcion_especialidad.ToUpper() == desEsp) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Especialidades
                                where a.estado == 1
                                select new
                                {
                                    a.id_Especialidad,
                                    a.codigo_especialidad,
                                    a.descripcion_especialidad,
                                }).ToList();
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

        public object Posttbl_Especialidades(tbl_Especialidades tbl_Especialidades)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Especialidades.fecha_creacion = DateTime.Now;
                db.tbl_Especialidades.Add(tbl_Especialidades);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Especialidades
                            where a.id_Especialidad == tbl_Especialidades.id_Especialidad
                            select new
                            {
                                a.id_Especialidad,
                                a.codigo_especialidad,
                                a.descripcion_especialidad,
                                a.estado,
                                descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                a.usuario_creacion
                            }).ToList();
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

        public object Puttbl_Especialidades(int id, tbl_Especialidades tbl_Especialidades)
        {
            Resultado res = new Resultado();

            tbl_Especialidades objReemplazar;
            objReemplazar = db.tbl_Especialidades.Where(u => u.id_Especialidad == id).FirstOrDefault<tbl_Especialidades>();

            objReemplazar.descripcion_especialidad = tbl_Especialidades.descripcion_especialidad;
            objReemplazar.estado = tbl_Especialidades.estado;

            objReemplazar.usuario_edicion = tbl_Especialidades.usuario_creacion;
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


        // DELETE: api/tblEspecialidades/5
        [ResponseType(typeof(tbl_Especialidades))]
        public IHttpActionResult Deletetbl_Especialidades(int id)
        {
            tbl_Especialidades tbl_Especialidades = db.tbl_Especialidades.Find(id);
            if (tbl_Especialidades == null)
            {
                return NotFound();
            }

            db.tbl_Especialidades.Remove(tbl_Especialidades);
            db.SaveChanges();

            return Ok(tbl_Especialidades);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_EspecialidadesExists(int id)
        {
            return db.tbl_Especialidades.Count(e => e.id_Especialidad == id) > 0;
        }
    }
}