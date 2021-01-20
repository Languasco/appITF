using Entidades.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Procesos
{
    public class ProgramacionBL
    {
        public object get_mostrarProgramaciones(int idUsuario, int idCiclo, string medico, int idCategoria, int idEspecialidad, int idResultado, int idEstado)
        {
            Resultado res = new Resultado();
            List<ProgramacionCab_E> obj_List = new List<ProgramacionCab_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_CAB_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idCiclo", SqlDbType.Int).Value = idCiclo;
                        cmd.Parameters.Add("@medico", SqlDbType.VarChar).Value = medico;
                        cmd.Parameters.Add("@idCategoria", SqlDbType.Int).Value = idCategoria;

                        cmd.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        cmd.Parameters.Add("@idResultado", SqlDbType.Int).Value = idResultado;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;


                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                ProgramacionCab_E Entidad = new ProgramacionCab_E();

                                Entidad.id_Programacion_cab = Convert.ToInt32(dr["id_Programacion_cab"].ToString());
                                Entidad.nroVisitas = dr["nroVisitas"].ToString();
                                Entidad.id_Medico = dr["id_Medico"].ToString();
                                Entidad.datosMedico = dr["datosMedico"].ToString();

                                Entidad.categoria = dr["categoria"].ToString();
                                Entidad.fechaProgramacion = Convert.ToDateTime(dr["fechaProgramacion"].ToString());
                                Entidad.horaProgramacion = dr["horaProgramacion"].ToString();
                                Entidad.resultados = dr["resultados"].ToString();

                                Entidad.cmpMedico = dr["cmpMedico"].ToString();
                                Entidad.idEspecialidad = dr["idEspecialidad"].ToString();
                                Entidad.especialidad = dr["especialidad"].ToString();
 
                                Entidad.fechaReporte = Convert.ToDateTime(dr["fechaReporte"].ToString());
                                Entidad.horaReporte = dr["horaReporte"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.colorFondo = dr["colorFondo"].ToString();

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

        public string Set_almacenandoDetalle_programacion(List<ProgramacionDet_E> List_Detalle, int idUsuario)
        {
            string Resultado = null;
            int user = 0;

            DataTable dt_detalle = new DataTable();
            try
            {
                try
                {
                    PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(ProgramacionDet_E));
                    foreach (PropertyDescriptor prop in properties)
                    {
                        dt_detalle.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                    }

                    foreach (ProgramacionDet_E item in List_Detalle)
                    {
                        DataRow row = dt_detalle.NewRow();
                        foreach (PropertyDescriptor prop in properties)
                            row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                        dt_detalle.Rows.Add(row);
                    }
                }
                catch (Exception ex)
                {
                    Resultado = ex.Message;
                    return Resultado;
                }

                using (SqlConnection con = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    con.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_DELETE_TEMPORAL_DETALLE_PROGRAMACION", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    //guardando al informacion de la importacion
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(bdConexion.cadenaBDcx()))
                    {
                        bulkCopy.BatchSize = 500;
                        bulkCopy.NotifyAfter = 1000;
                        bulkCopy.DestinationTableName = "TEMPORAL_DETALLE_PROGRAMACION";
                        bulkCopy.WriteToServer(dt_detalle);
                    }

                    //----insertando tabla de cancelaciones ----
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_GRABAR_DETALLE", con))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = user;
                        cmd.ExecuteNonQuery();
                    }

                    Resultado = "OK";
                }
            }
            catch (Exception )
            {
                throw;
            }

            return Resultado;
        }

        public DataTable get_datosProgramacionCab(int idProgCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_CAB_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProgCab", SqlDbType.Int).Value = idProgCab;

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

        public DataTable get_datosProgramacionDet(int idProgCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_DET_EDICION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idProgCab", SqlDbType.Int).Value = idProgCab;

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

        public DataTable get_datosMedico(int idMedico)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_COMBO_MEDICO_DIRECCION", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;

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

        public DataTable get_datosProductos(int idCiclo, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_COMBO_PRODUCTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCiclo", SqlDbType.Int).Value = idCiclo;
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

        public DataTable get_datosStock(int idCiclo, int idUsuario, int idProducto)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_COMBO_LOTE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCiclo", SqlDbType.Int).Value = idCiclo;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;

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
        
        public DataTable get_usuariosProgramacion(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_COMBO_USUARIOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

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


        //public object get_informacionPerfilMedico_Cab(int idMedico)
        //{
        //    Resultado res = new Resultado();
        //    List<PerfilMedicoCab_E> obj_List = new List<PerfilMedicoCab_E>();
        //    try
        //    {
        //        using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
        //        {
        //            cn.Open();
        //            using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_PERFIL_MEDICO_AGRUPADO", cn))
        //            {
        //                cmd.CommandTimeout = 0;
        //                cmd.CommandType = CommandType.StoredProcedure;

        //                cmd.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;

        //                using (SqlDataReader dr = cmd.ExecuteReader())
        //                {
        //                    while (dr.Read())
        //                    {
        //                        PerfilMedicoCab_E Entidad = new PerfilMedicoCab_E();

        //                        Entidad.nombreMedico = dr["nombreMedico"].ToString();
        //                        Entidad.matricula = dr["matricula"].ToString();
        //                        Entidad.especialidad = dr["especialidad"].ToString();
        //                        Entidad.direccion = dr["direccion"].ToString();

        //                        Entidad.mercadoProducto = dr["mercadoProducto"].ToString();
        //                        Entidad.doceUltimosMeses = dr["doceUltimosMeses"].ToString();
        //                        Entidad.tresUltimosMeses = dr["tresUltimosMeses"].ToString();
        //                        Entidad.utilmoMes = dr["utilmoMes"].ToString();

        //                        obj_List.Add(Entidad);
        //                    }

        //                    res.ok = true;
        //                    res.data = obj_List;
        //                    res.totalpage = 0;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        res.ok = false;
        //        res.data = ex.Message;
        //        res.totalpage = 0;
        //    }
        //    return res;
        //}

        //public object get_informacionPerfilMedico_Det(int idMedico,string nombreProducto)
        //{
        //    Resultado res = new Resultado();
        //    List<PerfilMedicoCab_E> obj_List = new List<PerfilMedicoCab_E>();
        //    try
        //    {
        //        using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
        //        {
        //            cn.Open();
        //            using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_PERFIL_MEDICO_DETALLADO", cn))
        //            {
        //                cmd.CommandTimeout = 0;
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;
        //                cmd.Parameters.Add("@nombreProducto", SqlDbType.VarChar).Value = nombreProducto;

        //                using (SqlDataReader dr = cmd.ExecuteReader())
        //                {
        //                    while (dr.Read())
        //                    {
        //                        PerfilMedicoCab_E Entidad = new PerfilMedicoCab_E();

        //                        Entidad.mercadoProducto = dr["mercadoProducto"].ToString();
        //                        Entidad.doceUltimosMeses = dr["doceUltimosMeses"].ToString();
        //                        Entidad.tresUltimosMeses = dr["tresUltimosMeses"].ToString();
        //                        Entidad.utilmoMes = dr["utilmoMes"].ToString();

        //                        obj_List.Add(Entidad);
        //                    }

        //                    res.ok = true;
        //                    res.data = obj_List;
        //                    res.totalpage = 0;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        res.ok = false;
        //        res.data = ex.Message;
        //        res.totalpage = 0;
        //    }
        //    return res;
        //}



        public DataTable get_informacionPerfilMedico_Cab(int   idMedico)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_PERFIL_MEDICO_AGRUPADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;

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
               
        public DataTable get_informacionPerfilMedico_Det(int idMedico, string nombreProducto)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_PERFIL_MEDICO_DETALLADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;
                        cmd.Parameters.Add("@nombreProducto", SqlDbType.VarChar).Value = nombreProducto;

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

        public DataTable get_informacionRejaPromocional(int idEspecialidad )
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_REJA_PROMOCIONAL", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_especialidad", SqlDbType.Int).Value = idEspecialidad;
 

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
        
        public string set_eliminarTemporales(int opcionModal)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_PROGRAMACION_ELIMINAR_TEMPORALES_PERFILES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@opcionFormato", SqlDbType.Int).Value = opcionModal;
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


        public DataTable get_validacionVisita(int idMedico, string fechaProgram)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_VERIFICA_VISITA_MEDICO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_medico", SqlDbType.Int).Value = idMedico;
                        cmd.Parameters.Add("@fecha_reporte", SqlDbType.VarChar).Value = fechaProgram;

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


    }
}
