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
    public class tbl_PerfilController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tbl_Perfil
        public IQueryable<tbl_Perfil> Gettbl_Perfil()
        {
            return db.tbl_Perfil;
        }


        public object Gettbl_Perfil(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado =  Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;

                    if (idEstado == -1)
                    {
                        res.data = (from a in db.tbl_Perfil
                                    select new
                                    {
                                        a.id_perfil,
                                        a.codigo_perfil,
                                        a.descripcion_perfil,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion

                                    }).ToList();
                    }
                    else {
                        res.data = (from a in db.tbl_Perfil
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_perfil,
                                        a.codigo_perfil,
                                        a.descripcion_perfil,
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
                    int idPerfil = Convert.ToInt32(parametros[0].ToString());

                    tbl_Perfil objReemplazar;
                    objReemplazar = db.tbl_Perfil.Where(u => u.id_perfil == idPerfil).FirstOrDefault<tbl_Perfil>();
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
                    string codigoRol = parametros[0].ToString();

                    if (db.tbl_Perfil.Count(e => e.codigo_perfil == codigoRol) > 0)
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
                    string nombreRol = parametros[0].ToString().ToUpper();

                    if (db.tbl_Perfil.Count(e => e.descripcion_perfil.ToUpper() == nombreRol) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
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

        public object Posttbl_Perfil(tbl_Perfil tbl_Perfil)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Perfil.fecha_creacion = DateTime.Now;
                db.tbl_Perfil.Add(tbl_Perfil);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Perfil
                            where a.id_perfil == tbl_Perfil.id_perfil
                            select new
                            {
                                a.id_perfil,
                                a.codigo_perfil,
                                a.descripcion_perfil,
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

        public object Puttbl_Perfil(int id, tbl_Perfil tbl_Perfil)
        {
            Resultado res = new Resultado();

            tbl_Perfil objReemplazar;
            objReemplazar = db.tbl_Perfil.Where(u => u.id_perfil == id).FirstOrDefault<tbl_Perfil>();

            objReemplazar.descripcion_perfil = tbl_Perfil.descripcion_perfil;
            objReemplazar.estado = tbl_Perfil.estado;

            objReemplazar.usuario_edicion = tbl_Perfil.usuario_creacion;
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
        

        // DELETE: api/tbl_Perfil/5
        [ResponseType(typeof(tbl_Perfil))]
        public IHttpActionResult Deletetbl_Perfil(int id)
        {
            tbl_Perfil tbl_Perfil = db.tbl_Perfil.Find(id);
            if (tbl_Perfil == null)
            {
                return NotFound();
            }

            db.tbl_Perfil.Remove(tbl_Perfil);
            db.SaveChanges();

            return Ok(tbl_Perfil);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_PerfilExists(int id)
        {
            return db.tbl_Perfil.Count(e => e.id_perfil == id) > 0;
        }
    }
}