﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos
{
    public class Programacion_E
    {
        public string id_Factura_Cab { get; set; }
        public int id_usuario { get; set; }

        public string cod_ref { get; set; }
        public string fecha_cancelacion { get; set; }
        public decimal saldo_pendiente { get; set; }
        public decimal importe_pagar { get; set; }

        public string fechaOperacion { get; set; }
        public string nroOperacion { get; set; }
        public string id_banco { get; set; }
    }

    public class ProgramacionCab_E
    {
        public int id_Programacion_cab { get; set; }
        public string nroVisitas { get; set; }
        public string datosMedico { get; set; }
        public string categoria { get; set; }
        public string fechaProgramacion { get; set; }
        public string horaProgramacion { get; set; }


        public string resultados { get; set; }
        public string cmpMedico { get; set; }
        public string especialidad { get; set; }
        public string fechaReporte { get; set; }
        public string horaReporte { get; set; }

        public string idEstado { get; set; }
        public string descripcionEstado { get; set; }

    }

}