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
    public class Target_BL
    {

        public object get_mostrarTarget(int idUsuario, int idCategoria, int idEspecialidad, string medico, int idEstado)
        {
            Resultado res = new Resultado();
            List<Target_E> obj_List = new List<Target_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_TARGET_CAB_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idCategoria", SqlDbType.Int).Value = idCategoria;
                        cmd.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        cmd.Parameters.Add("@medico", SqlDbType.VarChar).Value = medico;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;


                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Target_E Entidad = new Target_E();
                                Entidad.usuario = dr["usuario"].ToString();
                                Entidad.identificador = dr["identificador"].ToString();
                                Entidad.codigo = dr["codigo"].ToString();

                                Entidad.medico = dr["medico"].ToString();
                                Entidad.categoria = dr["categoria"].ToString();
                                Entidad.especialidad = dr["especialidad"].ToString();
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
        
        public string set_grabar_ImportacionTarget(string opcionTarget, int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_TARGET_TEMPORAL_TARGET_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@opcion_target", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;

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

        public object get_mostrarAltasBajasTarget_cab(int idUsuario, string fechaIni, string fechaFin,int  idEstado, string opcionTarget)
        {
            Resultado res = new Resultado();
            List<Target_E> obj_List = new List<Target_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_CAB_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Target_E Entidad = new Target_E();
                                Entidad.usuario = dr["usuario"].ToString();
                                Entidad.identificador = dr["identificador"].ToString();
                                Entidad.codigo = dr["codigo"].ToString();

                                Entidad.medico = dr["medico"].ToString();
                                Entidad.categoria = dr["categoria"].ToString();
                                Entidad.especialidad = dr["especialidad"].ToString();
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


    }
}
