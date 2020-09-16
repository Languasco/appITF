using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Mantenimientos
{
    public class Actividades_E
    {
          public string id_actividad { get; set; }
          public string id_Ciclo { get; set; }
          public DateTime fecha_actividad { get; set; }
          public string fecha { get; set; }
        
          public string id_Duracion { get; set; }
          public string descripcionDuracion { get; set; }
          public string detalle_actividad { get; set; }
          public string estado { get; set; }
          public string descripcionEstado { get; set; }
          public string Aprobador { get; set; }
          public string observacion { get; set; }
          public string usuario { get; set; }
    }
}
