﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Datos
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class ITF_PERUEntities : DbContext
    {
        public ITF_PERUEntities()
            : base("name=ITF_PERUEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<tbl_Accesos_Evento> tbl_Accesos_Evento { get; set; }
        public virtual DbSet<tbl_Categorias> tbl_Categorias { get; set; }
        public virtual DbSet<tbl_Control_Stock> tbl_Control_Stock { get; set; }
        public virtual DbSet<tbl_Definicion_Opciones> tbl_Definicion_Opciones { get; set; }
        public virtual DbSet<tbl_Duracion_Actividades> tbl_Duracion_Actividades { get; set; }
        public virtual DbSet<tbl_Especialidades> tbl_Especialidades { get; set; }
        public virtual DbSet<tbl_Estados> tbl_Estados { get; set; }
        public virtual DbSet<tbl_Evento> tbl_Evento { get; set; }
        public virtual DbSet<tbl_Feriados> tbl_Feriados { get; set; }
        public virtual DbSet<tbl_Identificador_Medico> tbl_Identificador_Medico { get; set; }
        public virtual DbSet<tbl_Monedas> tbl_Monedas { get; set; }
        public virtual DbSet<tbl_Perfil_Accesos> tbl_Perfil_Accesos { get; set; }
        public virtual DbSet<tbl_Productos> tbl_Productos { get; set; }
        public virtual DbSet<tbl_Resultados_Visitas> tbl_Resultados_Visitas { get; set; }
        public virtual DbSet<tbl_Sol_Medico_Cab> tbl_Sol_Medico_Cab { get; set; }
        public virtual DbSet<tbl_Sol_Medico_Det> tbl_Sol_Medico_Det { get; set; }
        public virtual DbSet<tbl_Stock> tbl_Stock { get; set; }
        public virtual DbSet<tbl_Tipos_Productos> tbl_Tipos_Productos { get; set; }
        public virtual DbSet<tbl_Ubigeo> tbl_Ubigeo { get; set; }
        public virtual DbSet<tbl_Usuarios> tbl_Usuarios { get; set; }
        public virtual DbSet<tbl_Medicos_Direccion> tbl_Medicos_Direccion { get; set; }
        public virtual DbSet<tbl_Programacion_Det> tbl_Programacion_Det { get; set; }
        public virtual DbSet<tbl_Sol_Medico_Direccion> tbl_Sol_Medico_Direccion { get; set; }
        public virtual DbSet<tbl_Actividades> tbl_Actividades { get; set; }
        public virtual DbSet<tbl_Ciclos> tbl_Ciclos { get; set; }
        public virtual DbSet<tbl_Perfil> tbl_Perfil { get; set; }
        public virtual DbSet<tbl_Mes> tbl_Mes { get; set; }
        public virtual DbSet<tbl_Medicos> tbl_Medicos { get; set; }
        public virtual DbSet<tbl_Programacion_Cab> tbl_Programacion_Cab { get; set; }
        public virtual DbSet<tbl_Empresa> tbl_Empresa { get; set; }
    }
}
