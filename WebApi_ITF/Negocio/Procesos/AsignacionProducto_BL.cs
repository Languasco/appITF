using Entidades.Procesos;
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
    public class AsignacionProducto_BL
    {
        public object get_asignacionProducto_Cab(int idUsuario, int  idCiclo, string producto)
        {
            Resultado res = new Resultado();
            List<AsignacionProducto_E> obj_List = new List<AsignacionProducto_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ASIGNACION_PRODUCTO_CAB_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idCiclo", SqlDbType.Int).Value = idCiclo;
                        cmd.Parameters.Add("@producto", SqlDbType.VarChar).Value = producto;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AsignacionProducto_E Entidad = new AsignacionProducto_E();

                                Entidad.id_Stock = Convert.ToInt32(dr["id_Stock"].ToString());
                                Entidad.id_Ciclo = dr["id_Ciclo"].ToString();
                                Entidad.descripcionCiclo = dr["descripcionCiclo"].ToString();
                                Entidad.id_Usuario = dr["id_Usuario"].ToString();

                                Entidad.codigoUsuario = dr["codigoUsuario"].ToString();
                                Entidad.descripcionUsuario = dr["descripcionUsuario"].ToString();
                                Entidad.id_Producto = dr["id_Producto"].ToString();
                                Entidad.codigoProducto = dr["codigoProducto"].ToString();

                                Entidad.descripcionProducto = dr["descripcionProducto"].ToString();
                                Entidad.cantidad_stock = dr["cantidad_stock"].ToString();
                                Entidad.lote_stock = dr["lote_stock"].ToString();
                                Entidad.fecha_stock = Convert.ToDateTime(dr["fecha_stock"].ToString());

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

               

    }
}
