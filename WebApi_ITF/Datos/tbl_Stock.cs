//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class tbl_Stock
    {
        public int id_Stock { get; set; }
        public Nullable<int> id_Ciclo { get; set; }
        public Nullable<int> id_Producto { get; set; }
        public Nullable<int> id_Usuario { get; set; }
        public Nullable<decimal> cantidad_stock { get; set; }
        public string lote_stock { get; set; }
        public Nullable<System.DateTime> fecha_stock { get; set; }
        public string nombre_archivo_stock { get; set; }
        public Nullable<int> usuario_creacion { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
    }
}