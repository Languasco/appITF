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
    public class tblTiposProductosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblTiposProductos
        public IQueryable<tbl_Tipos_Productos> Gettbl_Tipos_Productos()
        {
            return db.tbl_Tipos_Productos;
        }

        public object Gettbl_Tipos_Productos(int opcion, string filtro)
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
                        res.data = (from a in db.tbl_Tipos_Productos
                                    select new
                                    {
                                        a.id_Tipo_Producto,
                                        a.codigo_tipo_producto,
                                        a.descripcion_tipo_producto,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                    }
                    else
                    {
                        res.data = (from a in db.tbl_Tipos_Productos
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Tipo_Producto,
                                        a.codigo_tipo_producto,
                                        a.descripcion_tipo_producto,
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
                    int id_Tipo_Producto = Convert.ToInt32(parametros[0].ToString());

                    tbl_Tipos_Productos objReemplazar;
                    objReemplazar = db.tbl_Tipos_Productos.Where(u => u.id_Tipo_Producto == id_Tipo_Producto).FirstOrDefault<tbl_Tipos_Productos>();
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
                    string cod = parametros[0].ToString().ToUpper();

                    if (db.tbl_Tipos_Productos.Count(e => e.codigo_tipo_producto.ToUpper() == cod) > 0)
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
                    string desc = parametros[0].ToString().ToUpper();

                    if (db.tbl_Tipos_Productos.Count(e => e.descripcion_tipo_producto.ToUpper() == desc) > 0)
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
                    res.data = (from a in db.tbl_Tipos_Productos
                                where a.estado == 1
                                select new
                                {
                                    a.id_Tipo_Producto,
                                    a.codigo_tipo_producto,
                                    a.descripcion_tipo_producto,
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

        public object Posttbl_Tipos_Productos(tbl_Tipos_Productos tbl_Tipos_Productos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Tipos_Productos.fecha_creacion = DateTime.Now;
                db.tbl_Tipos_Productos.Add(tbl_Tipos_Productos);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Tipos_Productos
                            where a.id_Tipo_Producto == tbl_Tipos_Productos.id_Tipo_Producto
                            select new
                            {
                                a.id_Tipo_Producto,
                                a.codigo_tipo_producto,
                                a.descripcion_tipo_producto,
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

        public object Puttbl_Tipos_Productos(int id, tbl_Tipos_Productos tbl_Tipos_Productos)
        {
            Resultado res = new Resultado();

            tbl_Tipos_Productos objReemplazar;
            objReemplazar = db.tbl_Tipos_Productos.Where(u => u.id_Tipo_Producto == id).FirstOrDefault<tbl_Tipos_Productos>();

            objReemplazar.descripcion_tipo_producto = tbl_Tipos_Productos.descripcion_tipo_producto;
            objReemplazar.estado = tbl_Tipos_Productos.estado;

            objReemplazar.usuario_edicion = tbl_Tipos_Productos.usuario_creacion;
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


        // DELETE: api/tblTiposProductos/5
        [ResponseType(typeof(tbl_Tipos_Productos))]
        public IHttpActionResult Deletetbl_Tipos_Productos(int id)
        {
            tbl_Tipos_Productos tbl_Tipos_Productos = db.tbl_Tipos_Productos.Find(id);
            if (tbl_Tipos_Productos == null)
            {
                return NotFound();
            }

            db.tbl_Tipos_Productos.Remove(tbl_Tipos_Productos);
            db.SaveChanges();

            return Ok(tbl_Tipos_Productos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Tipos_ProductosExists(int id)
        {
            return db.tbl_Tipos_Productos.Count(e => e.id_Tipo_Producto == id) > 0;
        }
    }
}