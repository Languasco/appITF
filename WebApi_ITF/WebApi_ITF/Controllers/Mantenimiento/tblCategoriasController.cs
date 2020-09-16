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
    public class tblCategoriasController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblCategorias
        public IQueryable<tbl_Categorias> Gettbl_Categorias()
        {
            return db.tbl_Categorias;
        }

        public object Gettbl_Categorias(int opcion, string filtro)
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
                        res.data = (from a in db.tbl_Categorias
                                    select new
                                    {
                                        a.id_Categoria,
                                        a.codigo_categoria,
                                        a.descripcion_categoria,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                    }
                    else
                    {
                        res.data = (from a in db.tbl_Categorias
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Categoria,
                                        a.codigo_categoria,
                                        a.descripcion_categoria,
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
                    int id_Categoria = Convert.ToInt32(parametros[0].ToString());

                    tbl_Categorias objReemplazar;
                    objReemplazar = db.tbl_Categorias.Where(u => u.id_Categoria == id_Categoria).FirstOrDefault<tbl_Categorias>();
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
                    string codCat = parametros[0].ToString().ToUpper();

                    if (db.tbl_Categorias.Count(e => e.codigo_categoria.ToUpper() == codCat) > 0)
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
                    string desCat = parametros[0].ToString().ToUpper();

                    if (db.tbl_Categorias.Count(e => e.descripcion_categoria.ToUpper() == desCat) > 0)
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
                    res.data = (from a in db.tbl_Categorias
                                where a.estado == 1
                                select new
                                {
                                    a.id_Categoria,
                                    a.codigo_categoria,
                                    a.descripcion_categoria,

 

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

        public object Posttbl_Categorias(tbl_Categorias tbl_Categorias)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Categorias.fecha_creacion = DateTime.Now;
                db.tbl_Categorias.Add(tbl_Categorias);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Categorias
                            where a.id_Categoria == tbl_Categorias.id_Categoria
                            select new
                            {
                                a.id_Categoria,
                                a.codigo_categoria,
                                a.descripcion_categoria,
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

        public object Puttbl_Categorias(int id, tbl_Categorias tbl_Categorias)
        {
            Resultado res = new Resultado();

            tbl_Categorias objReemplazar;
            objReemplazar = db.tbl_Categorias.Where(u => u.id_Categoria == id).FirstOrDefault<tbl_Categorias>();

            objReemplazar.descripcion_categoria = tbl_Categorias.descripcion_categoria;
            objReemplazar.estado = tbl_Categorias.estado;

            objReemplazar.usuario_edicion = tbl_Categorias.usuario_creacion;
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

        // DELETE: api/tblCategorias/5
        [ResponseType(typeof(tbl_Categorias))]
        public IHttpActionResult Deletetbl_Categorias(int id)
        {
            tbl_Categorias tbl_Categorias = db.tbl_Categorias.Find(id);
            if (tbl_Categorias == null)
            {
                return NotFound();
            }

            db.tbl_Categorias.Remove(tbl_Categorias);
            db.SaveChanges();

            return Ok(tbl_Categorias);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_CategoriasExists(int id)
        {
            return db.tbl_Categorias.Count(e => e.id_Categoria == id) > 0;
        }
    }
}