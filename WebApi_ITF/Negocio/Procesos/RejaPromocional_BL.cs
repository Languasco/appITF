using Entidades.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Procesos
{
    public class RejaPromocional_BL
    {

        public object get_mostrarRejaPromocionalCab(int idEspecialidad , int idEstado)
        {
            Resultado res = new Resultado();
            List<RejaPromocional_E> obj_List = new List<RejaPromocional_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_REJA_CAB_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                RejaPromocional_E Entidad = new RejaPromocional_E();

                                Entidad.id_Reja_Cab = Convert.ToInt32( dr["id_Reja_Cab"].ToString()) ;
                                Entidad.especialidad = dr["especialidad"].ToString();
                                Entidad.descripcion = dr["descripcion"].ToString();
                                Entidad.fecha = dr["fecha"].ToString();
                                Entidad.idEstado = Convert.ToInt32(dr["idEstado"].ToString());
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }
        
        public object get_mostrarProductos_reja(int idTipoProducto, string producto, int idUsuario)
        {
            Resultado res = new Resultado();
            List<Reja_Producto_E> obj_List = new List<Reja_Producto_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_REJA_BUSCAR_PRODUCTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idTipoProducto", SqlDbType.Int).Value = idTipoProducto;
                        cmd.Parameters.Add("@producto", SqlDbType.VarChar).Value = producto;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Reja_Producto_E Entidad = new Reja_Producto_E();

                                Entidad.checkeado = false;
                                Entidad.id_Producto = Convert.ToInt32(dr["id_Producto"].ToString());
                                Entidad.codigo_producto = dr["codigo_producto"].ToString();
                                Entidad.descripcion_producto = dr["descripcion_producto"].ToString();
                                Entidad.descripcion_material = "";

                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }
        
        public string Set_insert_update_rejaPromocional(int idRejaCab,string  descripcionReja, string objEspecialidad, string objProducto, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_REJA_INSERT_UPDATE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idRejaCab", SqlDbType.Int).Value = idRejaCab;
                        cmd.Parameters.Add("@descripcionReja", SqlDbType.VarChar).Value = descripcionReja;
                        cmd.Parameters.Add("@objEspecialidad", SqlDbType.VarChar).Value = objEspecialidad;
                        cmd.Parameters.Add("@objProducto", SqlDbType.VarChar).Value = objProducto;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.ExecuteNonQuery(); 

                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        public DataTable get_detalleReja_especialidades(int idTargetCab , int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_REJA_DETALLE_ESPECIALIDADES_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_detalleReja_productos(int idTargetCab , int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_REJA_DETALLE_PRODUCTOS_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public string set_cerrarRejaPromocional(int idRejaCab, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_REJA_CERRAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idRejaCab", SqlDbType.Int).Value = idRejaCab;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.ExecuteNonQuery();

                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }


    }
}
