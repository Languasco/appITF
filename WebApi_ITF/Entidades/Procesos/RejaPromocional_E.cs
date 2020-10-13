using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos
{
    public class RejaPromocional_E
    {
        public int id_Reja_Cab { get; set; }
        public string especialidad { get; set; }
        public string descripcion { get; set; }
        public string fecha { get; set; }
        public int idEstado { get; set; }
        public string descripcionEstado { get; set; }
    }
    public class Reja_Producto_E
    {
        public bool checkeado { get; set; }
        public int id_Producto { get; set; }
        public string codigo_producto { get; set; }
        public string descripcion_producto { get; set; }
        public string descripcion_material { get; set; }
        
    }
}
