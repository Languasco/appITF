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
using Negocio.Resultados;

namespace WebApi_ITF.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblProductosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblProductos
        public IQueryable<tbl_Productos> Gettbl_Productos()
        {
            return db.tbl_Productos;
        }


        public object Gettbl_Productos(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    string producto =  parametros[0].ToString();
                    int tipoProducto = Convert.ToInt32(parametros[1].ToString());
                    int idEstado = Convert.ToInt32(parametros[2].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.get_productos(producto, tipoProducto, idEstado);

                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Producto = Convert.ToInt32(parametros[0].ToString());

                    tbl_Productos objReemplazar;
                    objReemplazar = db.tbl_Productos.Where(u => u.id_Producto == id_Producto).FirstOrDefault<tbl_Productos>();
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
                    string codProd = parametros[0].ToString().ToUpper();

                    if (db.tbl_Productos.Count(e => e.codigo_producto.ToUpper() == codProd) > 0)
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
                    res.ok = true;
                    res.data = (from a in db.tbl_Control_Stock
                                select new
                                {
                                    a.id_Control_Stock,
                                    a.descripcion_control_stock
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

        public object Posttbl_Productos(tbl_Productos tbl_Productos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Productos.fecha_creacion = DateTime.Now;
                db.tbl_Productos.Add(tbl_Productos);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Productos
                            join b in db.tbl_Tipos_Productos on a.id_Tipo_Produto equals b.id_Tipo_Producto
                            where a.id_Producto == tbl_Productos.id_Producto
                            select new
                            {
                                a.id_Producto,
                                a.codigo_producto,
                                a.descripcion_producto,
                                a.abreviatura_producto,
                                a.id_Tipo_Produto,
                                descripcionTipoProducto = b.codigo_tipo_producto,
                                a.id_Control_Stock,
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

        public object Puttbl_Productos(int id, tbl_Productos tbl_Productos)
        {
            Resultado res = new Resultado();

            tbl_Productos objReemplazar;
            objReemplazar = db.tbl_Productos.Where(u => u.id_Producto == id).FirstOrDefault<tbl_Productos>();

            objReemplazar.descripcion_producto = tbl_Productos.descripcion_producto;
            objReemplazar.abreviatura_producto = tbl_Productos.abreviatura_producto;
            objReemplazar.id_Tipo_Produto = tbl_Productos.id_Tipo_Produto;
            objReemplazar.id_Control_Stock = tbl_Productos.id_Control_Stock;
            objReemplazar.estado = tbl_Productos.estado;

            objReemplazar.usuario_edicion = tbl_Productos.usuario_creacion;
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


        // DELETE: api/tblProductos/5
        [ResponseType(typeof(tbl_Productos))]
        public IHttpActionResult Deletetbl_Productos(int id)
        {
            tbl_Productos tbl_Productos = db.tbl_Productos.Find(id);
            if (tbl_Productos == null)
            {
                return NotFound();
            }

            db.tbl_Productos.Remove(tbl_Productos);
            db.SaveChanges();

            return Ok(tbl_Productos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ProductosExists(int id)
        {
            return db.tbl_Productos.Count(e => e.id_Producto == id) > 0;
        }
    }
}