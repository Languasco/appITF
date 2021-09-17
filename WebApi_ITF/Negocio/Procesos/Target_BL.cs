using Entidades.Procesos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Mail;
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
                                Entidad.descripcion_tipo_visita = dr["descripcion_tipo_visita"].ToString();

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
            List<AltasBajasTarget_E> obj_List = new List<AltasBajasTarget_E>();
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
                                AltasBajasTarget_E Entidad = new AltasBajasTarget_E();


                                Entidad.id_Target_cab = Convert.ToInt32(dr["id_Target_cab"].ToString());
                                Entidad.usuario = dr["usuario"].ToString();
                                Entidad.fechaSol = dr["fechaSol"].ToString();
                                Entidad.textoSol = dr["textoSol"].ToString();

                                Entidad.aprobadorRechazador = dr["aprobadorRechazador"].ToString();
                                Entidad.fechaRespuesta =Convert.ToDateTime(dr["fechaRespuesta"].ToString());
                                Entidad.textoRespuesta = dr["textoRespuesta"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
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
        
        public object get_mostrarAltasBajasTarget_medico(string medico, int idCategoria, int idEspecialidad, string opcionTarget, int idUsuario)
        {
            Resultado res = new Resultado();
            List<AltasBajasTarget_Medico_E> obj_List = new List<AltasBajasTarget_Medico_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_BUSCAR_MEDICO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@medico", SqlDbType.VarChar).Value = medico;
                        cmd.Parameters.Add("@idCategoria", SqlDbType.Int).Value = idCategoria;
                        cmd.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AltasBajasTarget_Medico_E Entidad = new AltasBajasTarget_Medico_E();

                                Entidad.checkeado = false;
                                Entidad.id_Medico = Convert.ToInt32(dr["id_Medico"].ToString());
                                Entidad.cmp_medico = dr["cmp_medico"].ToString();
                                Entidad.nombres_medico = dr["nombres_medico"].ToString();
                                Entidad.apellido_paterno_medico = dr["apellido_paterno_medico"].ToString();

                                Entidad.apellido_materno_medico = dr["apellido_materno_medico"].ToString(); 
                                Entidad.codigo_categoria = dr["codigo_categoria"].ToString();
                                Entidad.codigo_especialidad = dr["codigo_especialidad"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();
                                
                                Entidad.visitadoPor = dr["visitadoPor"].ToString();
                                
                                Entidad.nro_contactos = dr["nro_contactos"].ToString();
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
               
        public string Set_insert_update_AltasBajasTarget(int idTargetCab, string detalleTarget, string opcionTarget,int idUsuario)
        {
            string resultado = "";
            int idNewTarget_bd = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_INSERT_UPDATE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@detalleTarget", SqlDbType.VarChar).Value = detalleTarget;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idNewTarget_bd", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        idNewTarget_bd = Convert.ToInt32(cmd.Parameters["@idNewTarget_bd"].Value);

                        if (idTargetCab ==0 )
                        {
                            set_envioCorreo_altasBajas_target(idTargetCab, opcionTarget, idUsuario);
                        }

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


        public void set_envioCorreo_altasBajas_target(int idTargetCab,string opcionTarget, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_altasBajas_target(idTargetCab, opcionTarget, idusuario);

                if (dt_detalleMail.Rows.Count > 0)
                {
                    if (dt_detalleMail.Rows[0]["destinatario"].ToString().Length > 0)
                    {
                        var message = new MailMessage();
                        message.From = new MailAddress(dt_detalleMail.Rows[0]["remitente"].ToString());
                        message.To.Add(new MailAddress(dt_detalleMail.Rows[0]["destinatario"].ToString()));
                        message.Subject = dt_detalleMail.Rows[0]["asunto"].ToString();
                        message.Body = dt_detalleMail.Rows[0]["cuerpoMensaje"].ToString();
                        message.IsBodyHtml = true;
                        message.Priority = MailPriority.Normal;

                        //---agregando la copia del correo 
                        if (dt_detalleMail.Rows[0]["copiaDestinatario"].ToString().Length > 0)
                        {
                            message.CC.Add(new MailAddress(dt_detalleMail.Rows[0]["copiaDestinatario"].ToString()));
                        }
                        using (var smtp = new SmtpClient())
                        {
                            smtp.EnableSsl = true;
                            smtp.UseDefaultCredentials = false;

                            var credential = new NetworkCredential(dt_detalleMail.Rows[0]["remitente"].ToString(), dt_detalleMail.Rows[0]["remitentePass"].ToString());
                            smtp.Credentials = credential;
                            smtp.Host = "smtp.gmail.com";
                            smtp.Port = 587;
                            smtp.Send(message);
                        }
                    }
                    else
                    {
                        throw new System.ArgumentException("Error al envio de correo no hay correo de destinatario");
                    }
                }
                else
                {
                    throw new System.ArgumentException("Error al envio de correo no hay informacion para enviar");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_datosEnviosCorreo_altasBajas_target(int idTargetCab, string opcionTarget , int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;

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
        
        public DataTable get_AltasBajas_detalleTarget(int idTargetCab, string opcionTarget, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_DET_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
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
        
        //----- APROBACION ALTAS BAJAS TARGET -----------
        
        public object get_mostrar_Aprobar_AltasBajasTarget_cab(int idUsuario, string fechaIni, string fechaFin, int idEstado, string opcionTarget, int idUsuariologeado)
        {
            Resultado res = new Resultado();
            List<AltasBajasTarget_E> obj_List = new List<AltasBajasTarget_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ALTA_BAJA_TARGET_CAB_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idUsuario_logueado", SqlDbType.Int).Value = idUsuariologeado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AltasBajasTarget_E Entidad = new AltasBajasTarget_E();


                                Entidad.id_Target_cab = Convert.ToInt32(dr["id_Target_cab"].ToString());
                                Entidad.usuario = dr["usuario"].ToString();
                                Entidad.fechaSol = dr["fechaSol"].ToString();
                                Entidad.textoSol = dr["textoSol"].ToString();

                                Entidad.aprobadorRechazador = dr["aprobadorRechazador"].ToString();
                                Entidad.fechaRespuesta = Convert.ToDateTime(dr["fechaRespuesta"].ToString());
                                Entidad.textoRespuesta = dr["textoRespuesta"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
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

        public DataTable get_AprobacionAltasBajas_detalleTarget(int idTargetCab, string opcionTarget, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ALTA_BAJA_TARGET_DET_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
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

        public string set_aprobarRechazar_altasBajas_target(int idTargetDet,int  nroContactos,string opcionTarget,string opcionEstado, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_RECHAZAR_ALTA_BAJA_TARGET", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetDet", SqlDbType.Int).Value = idTargetDet;
                        cmd.Parameters.Add("@nroContactos", SqlDbType.Int).Value = nroContactos;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@opcionEstado", SqlDbType.VarChar).Value = opcionEstado;
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

        public DataTable get_informacionMedico_target(int idMedico )
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_M_LISTA_APROBACION_ALTAS_BAJAS_INFORMACION_MEDICO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_Medico", SqlDbType.Int).Value = idMedico; 

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

        public string Set_finalizar_aprobacion_AltasBajasTarget(int idTargetCab, string opcionTarget, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ALTA_BAJA_TARGET_CERRAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.ExecuteNonQuery();

                        set_envioCorreo_aprobacion_AltasBajas_target(idTargetCab, opcionTarget, idUsuario);

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


        public void set_envioCorreo_aprobacion_AltasBajas_target(int idTargetCab, string opcionTarget, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_aprobacion_AltasBajas_target(idTargetCab, opcionTarget, idusuario);

                if (dt_detalleMail.Rows.Count > 0)
                {
                    if (dt_detalleMail.Rows[0]["destinatario"].ToString().Length > 0)
                    {
                        var message = new MailMessage();
                        message.From = new MailAddress(dt_detalleMail.Rows[0]["remitente"].ToString());
                        message.To.Add(new MailAddress(dt_detalleMail.Rows[0]["destinatario"].ToString()));
                        message.Subject = dt_detalleMail.Rows[0]["asunto"].ToString();
                        message.Body = dt_detalleMail.Rows[0]["cuerpoMensaje"].ToString();
                        message.IsBodyHtml = true;
                        message.Priority = MailPriority.Normal;

                        //---agregando la copia del correo 
                        if (dt_detalleMail.Rows[0]["copiaDestinatario"].ToString().Length > 0)
                        {
                            message.CC.Add(new MailAddress(dt_detalleMail.Rows[0]["copiaDestinatario"].ToString()));
                        }
                        using (var smtp = new SmtpClient())
                        {
                            smtp.EnableSsl = true;
                            smtp.UseDefaultCredentials = false;

                            var credential = new NetworkCredential(dt_detalleMail.Rows[0]["remitente"].ToString(), dt_detalleMail.Rows[0]["remitentePass"].ToString());
                            smtp.Credentials = credential;
                            smtp.Host = "smtp.gmail.com";
                            smtp.Port = 587;
                            smtp.Send(message);
                        }
                    }
                    else
                    {
                        throw new System.ArgumentException("Error al envio de correo no hay correo de destinatario");
                    }
                }
                else
                {
                    throw new System.ArgumentException("Error al envio de correo no hay informacion para enviar");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public DataTable get_datosEnviosCorreo_aprobacion_AltasBajas_target(int idTargetCab, string opcionTarget, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ALTA_BAJA_TARGET_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;

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

        public object get_mostrarTarget_boticasFarmacias(int idUsuario, int idCategoria, int idEspecialidad, string rucRazonSocial, int idEstado)
        {
            Resultado res = new Resultado();
            List<Target_E> obj_List = new List<Target_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_TARGET_CAB_BYF_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idCategoria", SqlDbType.Int).Value = idCategoria;
                        cmd.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        cmd.Parameters.Add("@medico", SqlDbType.VarChar).Value = rucRazonSocial;
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
                                Entidad.descripcion_tipo_visita = dr["descripcion_tipo_visita"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();

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

        public string set_grabar_ImportacionTarget_boticasFarmacias(string opcionTarget, int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_TARGET_TEMPORAL_TARGET_BYF_GRABAR", cn))
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

        public object get_mostrarAltasBajasTarget_boticasFarmacias_cab(int idUsuario, string fechaIni, string fechaFin, int idEstado, string opcionTarget)
        {
            Resultado res = new Resultado();
            List<AltasBajasTarget_E> obj_List = new List<AltasBajasTarget_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_CAB_BYF_LISTAR", cn))
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
                                AltasBajasTarget_E Entidad = new AltasBajasTarget_E();


                                Entidad.id_Target_cab = Convert.ToInt32(dr["id_Target_cab"].ToString());
                                Entidad.usuario = dr["usuario"].ToString();
                                Entidad.fechaSol = dr["fechaSol"].ToString();
                                Entidad.textoSol = dr["textoSol"].ToString();

                                Entidad.aprobadorRechazador = dr["aprobadorRechazador"].ToString();
                                Entidad.fechaRespuesta = Convert.ToDateTime(dr["fechaRespuesta"].ToString());
                                Entidad.textoRespuesta = dr["textoRespuesta"].ToString();
                                Entidad.idEstado = dr["idEstado"].ToString();
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


        public string Set_insert_update_AltasBajasTarget_boticasFarmacias(int idTargetCab, string detalleTarget, string opcionTarget, int idUsuario)
        {
            string resultado = "";
            int idNewTarget_bd = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_BYF_INSERT_UPDATE", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@detalleTarget", SqlDbType.VarChar).Value = detalleTarget;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idNewTarget_bd", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.ExecuteNonQuery();
                        idNewTarget_bd = Convert.ToInt32(cmd.Parameters["@idNewTarget_bd"].Value);

                        if (idTargetCab == 0)
                        {
                            set_envioCorreo_altasBajas_target_boticasFarmacias(idTargetCab, opcionTarget, idUsuario);
                        }

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

        public object get_mostrarAltasBajasTarget_boticasFarmacias(string rucRazonSocial, string codigo_departamento, string codigo_provincia, string codigo_distrito, string opcionTarget, int  idUsuario)
        {
            Resultado res = new Resultado();
            List<AltasBajasTarget_Medico_E> obj_List = new List<AltasBajasTarget_Medico_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_BYF_BUSCAR_MEDICO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@medico", SqlDbType.VarChar).Value = rucRazonSocial;

                        cmd.Parameters.Add("@cod_dpto", SqlDbType.VarChar).Value = codigo_departamento;
                        cmd.Parameters.Add("@cod_prov", SqlDbType.VarChar).Value = codigo_provincia;
                        cmd.Parameters.Add("@cod_dis", SqlDbType.VarChar).Value = codigo_distrito;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AltasBajasTarget_Medico_E Entidad = new AltasBajasTarget_Medico_E();

                                Entidad.checkeado = false;
                                Entidad.id_Medico = Convert.ToInt32(dr["id_Medico"].ToString());
                                Entidad.cmp_medico = dr["cmp_medico"].ToString();
                                Entidad.nombres_medico = dr["nombres_medico"].ToString();
 
                                Entidad.codigo_categoria = dr["codigo_categoria"].ToString();
                                Entidad.codigo_especialidad = dr["codigo_especialidad"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();

                                Entidad.visitadoPor = dr["visitadoPor"].ToString();

                                Entidad.nro_contactos = dr["nro_contactos"].ToString();
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


        public DataTable get_datosEnviosCorreo_altasBajas_target_boticasFarmacias(int idTargetCab, string opcionTarget, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_BYF_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;

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


        public void set_envioCorreo_altasBajas_target_boticasFarmacias(int idTargetCab, string opcionTarget, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_altasBajas_target_boticasFarmacias(idTargetCab, opcionTarget, idusuario);

                if (dt_detalleMail.Rows.Count > 0)
                {
                    if (dt_detalleMail.Rows[0]["destinatario"].ToString().Length > 0)
                    {
                        var message = new MailMessage();
                        message.From = new MailAddress(dt_detalleMail.Rows[0]["remitente"].ToString());
                        message.To.Add(new MailAddress(dt_detalleMail.Rows[0]["destinatario"].ToString()));
                        message.Subject = dt_detalleMail.Rows[0]["asunto"].ToString();
                        message.Body = dt_detalleMail.Rows[0]["cuerpoMensaje"].ToString();
                        message.IsBodyHtml = true;
                        message.Priority = MailPriority.Normal;

                        //---agregando la copia del correo 
                        if (dt_detalleMail.Rows[0]["copiaDestinatario"].ToString().Length > 0)
                        {
                            message.CC.Add(new MailAddress(dt_detalleMail.Rows[0]["copiaDestinatario"].ToString()));
                        }
                        using (var smtp = new SmtpClient())
                        {
                            smtp.EnableSsl = true;
                            smtp.UseDefaultCredentials = false;

                            var credential = new NetworkCredential(dt_detalleMail.Rows[0]["remitente"].ToString(), dt_detalleMail.Rows[0]["remitentePass"].ToString());
                            smtp.Credentials = credential;
                            smtp.Host = "smtp.gmail.com";
                            smtp.Port = 587;
                            smtp.Send(message);
                        }
                    }
                    else
                    {
                        throw new System.ArgumentException("Error al envio de correo no hay correo de destinatario");
                    }
                }
                else
                {
                    throw new System.ArgumentException("Error al envio de correo no hay informacion para enviar");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_AltasBajas_detalleTarget_boticasFarmacias(int idTargetCab, string opcionTarget, int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ALTA_BAJA_TARGET_BYF_DET_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
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


        public object get_mostrar_Aprobar_AltasBajasTarget_BoticasFarmacias(int idUsuario, string fechaIni, string fechaFin, int idEstado, string opcionTarget, int idUsuariologeado)
        {
            Resultado res = new Resultado();
            List<AltasBajasTarget_E> obj_List = new List<AltasBajasTarget_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ALTA_BAJA_TARGET_CAB_BYF_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idUsuario_logueado", SqlDbType.Int).Value = idUsuariologeado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AltasBajasTarget_E Entidad = new AltasBajasTarget_E();

                                Entidad.id_Target_cab = Convert.ToInt32(dr["id_Target_cab"].ToString());
                                Entidad.id_Target_Det = Convert.ToInt32(dr["id_Target_Det"].ToString());

                                Entidad.usuario = dr["usuario"].ToString();
                                Entidad.fechaSol = dr["fechaSol"].ToString();
                                Entidad.textoSol = dr["textoSol"].ToString();

                                Entidad.aprobadorRechazador = dr["aprobadorRechazador"].ToString();
                                Entidad.fechaRespuesta = Convert.ToDateTime(dr["fechaRespuesta"].ToString());
                                Entidad.textoRespuesta = dr["textoRespuesta"].ToString();

                                Entidad.idEstado = dr["idEstado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();

                                Entidad.ruc = dr["ruc"].ToString();
                                Entidad.razon_social = dr["razon_social"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();
                                Entidad.numero_contactos_target_det = dr["numero_contactos_target_det"].ToString();

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

        public string set_aprobarRechazar_AB_target_boticasFarmacias(int idTargetDet, int nroContactos, string opcionTarget, string opcionEstado, int idUsuario, int idTargetCab , string observacion)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_RECHAZAR_ALTA_BAJA_TARGET_BYF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetDet", SqlDbType.Int).Value = idTargetDet;
                        cmd.Parameters.Add("@nroContactos", SqlDbType.Int).Value = nroContactos;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@opcionEstado", SqlDbType.VarChar).Value = opcionEstado;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@observacion", SqlDbType.VarChar).Value = observacion;

                        cmd.ExecuteNonQuery();

                        if (opcionTarget == "A")
                        {
                            set_envioCorreo_aprobar_Alta_target_boticasFarmacias(idTargetCab, opcionTarget, idUsuario);
                        }

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


        public DataTable get_datosEnviosCorreo_aprobacion_Altas_target_boticasFarmacias(int idTargetCab, string opcionTarget, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ALTA_BAJA_TARGET_ENVIAR_CORREO_BYF", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idTargetCab", SqlDbType.Int).Value = idTargetCab;
                        cmd.Parameters.Add("@opcionTarget", SqlDbType.VarChar).Value = opcionTarget;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;

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



        public void set_envioCorreo_aprobar_Alta_target_boticasFarmacias(int idTargetCab, string opcionTarget, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_aprobacion_Altas_target_boticasFarmacias(idTargetCab, opcionTarget, idusuario);

                if (dt_detalleMail.Rows.Count > 0)
                {
                    if (dt_detalleMail.Rows[0]["destinatario"].ToString().Length > 0)
                    {
                        var message = new MailMessage();
                        message.From = new MailAddress(dt_detalleMail.Rows[0]["remitente"].ToString());
                        message.To.Add(new MailAddress(dt_detalleMail.Rows[0]["destinatario"].ToString()));
                        message.Subject = dt_detalleMail.Rows[0]["asunto"].ToString();
                        message.Body = dt_detalleMail.Rows[0]["cuerpoMensaje"].ToString();
                        message.IsBodyHtml = true;
                        message.Priority = MailPriority.Normal;

                        //---agregando la copia del correo 
                        if (dt_detalleMail.Rows[0]["copiaDestinatario"].ToString().Length > 0)
                        {
                            message.CC.Add(new MailAddress(dt_detalleMail.Rows[0]["copiaDestinatario"].ToString()));
                        }
                        using (var smtp = new SmtpClient())
                        {
                            smtp.EnableSsl = true;
                            smtp.UseDefaultCredentials = false;

                            var credential = new NetworkCredential(dt_detalleMail.Rows[0]["remitente"].ToString(), dt_detalleMail.Rows[0]["remitentePass"].ToString());
                            smtp.Credentials = credential;
                            smtp.Host = "smtp.gmail.com";
                            smtp.Port = 587;
                            smtp.Send(message);
                        }
                    }
                    else
                    {
                        throw new System.ArgumentException("Error al envio de correo no hay correo de destinatario");
                    }
                }
                else
                {
                    throw new System.ArgumentException("Error al envio de correo no hay informacion para enviar");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }



    }
}
