using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos
{
    public class AsignacionProducto_E
    {
        public int id_Stock { get; set; }
        public string id_Ciclo { get; set; }
        public string descripcionCiclo { get; set; }
        public string id_Usuario { get; set; }
        public string codigoUsuario { get; set; }
        public string descripcionUsuario { get; set; }
        public string id_Producto { get; set; }
        public string codigoProducto { get; set; }
        public string descripcionProducto { get; set; }
        public string cantidad_stock { get; set; }
        public string lote_stock { get; set; }
        public DateTime fecha_stock { get; set; }
    }
}
