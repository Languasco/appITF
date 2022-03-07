using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Mantenimientos
{
    public class Examen_E
    {
        public int  id_Examen_Rm_Cab { get; set; }
        public string descripcion { get; set; }
        public string fecha { get; set; }
        public string idEstado { get; set; }
        public string descripcionEstado { get; set; }
        public string tiempo_examen_rm { get; set; }

        public DateTime fecha_hora_inicio { get; set; }

    }
}
