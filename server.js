const http = require("http");

const PORT = process.env.PORT || 10000;

const ALOJAMIENTOS = {
  malaga: [
    { id: 521198, nombre: "XPCE TEATRO SQUARE MODERNO APARTAMENTO EN CENTRO HISTORICO" },
    { id: 521199, nombre: "XPCE SOHO MALAGA APARTAMENTO REFORMADO EN BARRIO DE MODA" },
    { id: 521203, nombre: "XPCE GIBRALFARO GARDENS DESCANSO A POCOS MINUTOS DEL CENTRO" },
    { id: 535556, nombre: "XPCE CATHEDRAL" },
    { id: 548059, nombre: "XPCE MUELLE 1" },
    { id: 548068, nombre: "XPCE MUELLE 2" },
    { id: 548087, nombre: "XPCE MERCED SQUARE - PICASSO" },
    { id: 590645, nombre: "XPCE URBAN MALAGA SKYLINE" },
    { id: 591978, nombre: "XPCE CERVANTES THEATER" },
    { id: 602510, nombre: "XPCE LUXURY SUITE IN MALAGUETA BEACH" },
    { id: 615680, nombre: "XPCE URBAN 2 MALAGA SKYLINE" },
    { id: 623651, nombre: "XPCE URBAN 3 MALAGA SKYLINE" },
    { id: 623654, nombre: "XPCE URBAN 4 MALAGA SKYLINE" },
    { id: 630372, nombre: "XPCE URBAN 7 MALAGA SKYLINE" },
    { id: 630374, nombre: "XPCE URBAN 9 MALAGA SKYLINE" },
    { id: 632463, nombre: "XPCE URBAN 8 MALAGA SKYLINE" },
    { id: 632507, nombre: "XPCE URBAN 6 MALAGA SKYLINE" },
    { id: 634333, nombre: "XPCE SKY TOWER" },
    { id: 640453, nombre: "XPCE URBAN 10 MALAGA SKYLINE" },
    { id: 649795, nombre: "XPCE URBAN 12 MALAGA SKYLINE" },
    { id: 649814, nombre: "XPCE URBAN 13 MALAGA SKYLINE" },
    { id: 650562, nombre: "XPCE URBAN 14 MALAGA SKYLINE" },
    { id: 661317, nombre: "XPCE URBAN 15 MALAGA SKYLINE" },
    { id: 661321, nombre: "XPCE URBAN 16 MALAGA SKYLINE" },
    { id: 663256, nombre: "XPCE VICTORIA 1" },
    { id: 663261, nombre: "XPCE VICTORIA 2" },
    { id: 663267, nombre: "XPCE VICTORIA 3" },
    { id: 664911, nombre: "XPCE URBAN 17 MALAGA SKYLINE" },
    { id: 670104, nombre: "XPCE URBAN 11 MALAGA SKYLINE" },
    { id: 670115, nombre: "XPCE URBAN 18 MALAGA SKYLINE" },
    { id: 684975, nombre: "XPCE URBAN 19 MALAGA SKYLINE" },
    { id: 690911, nombre: "XPCE CAPUCHINOS" },
    { id: 702098, nombre: "XPCE URBAN 20 MALAGA SKYLINE" },
    { id: 704935, nombre: "XPCE SALAMANCA MARKET 1" },
    { id: 704952, nombre: "XPCE SALAMANCA MARKET 2" },
    { id: 704955, nombre: "XPCE SALAMANCA MARKET 3" },
    { id: 704958, nombre: "XPCE SALAMANCA MARKET 4" },
    { id: 730407, nombre: "XPCE ALCAZABILLA" },
    { id: 750387, nombre: "XPCE ANCHA DEL CARMEN" },
    { id: 765458, nombre: "XPCE URBAN 21 MALAGA SKYLINE" },
    { id: 806204, nombre: "XPCE CARRETERIAS" },
    { id: 814437, nombre: "XPCE URBAN 22 MALAGA SKYLINE" },
    { id: 824740, nombre: "XPCE CARMELITAS" }
  ],

  fuengirola: [
    { id: 742969, nombre: "XPCE JADE TOWER" }
  ],

  marbella: [
    { id: 521200, nombre: "XPCE MARINO 1 JUNTO AL MAR, PUERTO Y CASCO HISTORICO" },
    { id: 521201, nombre: "XPCE MARINO 2 JUNTO AL MAR, PUERTO Y CASCO HISTORICO" },
    { id: 521202, nombre: "XPCE DON CARLOS GARDENS PARAISO NATURAL JUNTO AL MAR" },
    { id: 545404, nombre: "XPCE RODEO BEACH" },
    { id: 548037, nombre: "XPCE LOS JAZMINES DE NUEVA ANDALUCIA" },
    { id: 561462, nombre: "XPCE VILLA ARTOLA BEACH" },
    { id: 649817, nombre: "XPCE GOLDEN BANUS PENTHOUSE - PARKING FREE" }
  ]
};


const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // Pagina de comprobacion de Render
    if (
      url.pathname === "/" &&
      !url.searchParams.get("zona")
    ) {
      return enviarJSON(res, 200, {
        ok: true,
        servicio: "disponibilidad-xpce",
        estado: "activo"
      });
    }

    if (
      url.pathname !== "/" &&
      url.pathname !== "/disponibilidad"
    ) {
      return enviarJSON(res, 404, {
        ok: false,
        error: "Ruta no encontrada"
      });
    }

    const zona = normalizar(
      url.searchParams.get("zona") || ""
    );

    const fechaEntrada = (
      url.searchParams.get("fecha_entrada") || ""
    ).trim();

    const fechaSalida = (
      url.searchParams.get("fecha_salida") || ""
    ).trim();


    // PARAMETROS OBLIGATORIOS

    if (!zona || !fechaEntrada || !fechaSalida) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "Faltan parametros",
        requeridos: [
          "zona",
          "fecha_entrada",
          "fecha_salida"
        ]
      });
    }


    // ZONA VALIDA

    if (!ALOJAMIENTOS[zona]) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "Zona no valida",
        zonas_permitidas: [
          "Malaga",
          "Fuengirola",
          "Marbella"
        ]
      });
    }


    if (!process.env.LODGIFY_API_KEY) {
      return enviarJSON(res, 500, {
        ok: false,
        error: "LODGIFY_API_KEY no configurada"
      });
    }


    const alojamientos = ALOJAMIENTOS[zona];

    const headers = {
      "X-ApiKey": process.env.LODGIFY_API_KEY,
      "Accept": "application/json"
    };


    const disponibles = [];
    const errores = [];

    /*
     * Consultamos como maximo 3 alojamientos simultaneamente.
     * En cuanto encontramos 3 disponibles, dejamos de consultar.
     */

    const TAMANO_GRUPO = 3;
    const MAX_RESULTADOS = 3;


    for (
      let i = 0;
      i < alojamientos.length;
      i += TAMANO_GRUPO
    ) {

      const grupo = alojamientos.slice(
        i,
        i + TAMANO_GRUPO
      );


      const resultados = await Promise.all(
        grupo.map(async (alojamiento) => {

          const endpoint =
            `https://api.lodgify.com/v2/availability/${alojamiento.id}` +
            `?start=${encodeURIComponent(fechaEntrada)}` +
            `&end=${encodeURIComponent(fechaSalida)}`;

          try {

            const response = await fetch(endpoint, {
              method: "GET",
              headers
            });


            if (!response.ok) {

              let detalle = "";

              try {
                detalle = await response.text();
              } catch {
                detalle = "";
              }

              errores.push({
                property_id: alojamiento.id,
                nombre: alojamiento.nombre,
                status: response.status,
                detalle
              });

              return null;
            }


            const data = await response.json();


            if (!estaDisponible(data)) {
              return null;
            }


            return {
              property_id: alojamiento.id,
              nombre: alojamiento.nombre
            };


          } catch (error) {

            errores.push({
              property_id: alojamiento.id,
              nombre: alojamiento.nombre,
              error: error.message
            });

            return null;
          }

        })
      );


      for (const resultado of resultados) {
        if (resultado) {
          disponibles.push(resultado);
        }
      }


      if (disponibles.length >= MAX_RESULTADOS) {
        break;
      }


      if (i + TAMANO_GRUPO < alojamientos.length) {
        await esperar(300);
      }
    }


    return enviarJSON(res, 200, {
      ok: true,
      zona: nombreZona(zona),
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
      total_disponibles: disponibles.length,
      disponibles: disponibles.slice(0, MAX_RESULTADOS),
      consultas_con_error: errores.length,
      errores
    });


  } catch (error) {

    return enviarJSON(res, 500, {
      ok: false,
      error: "Error interno",
      detalle: error.message
    });

  }
});


function estaDisponible(data) {

  if (!data) {
    return false;
  }

  let periodos = [];

  /*
   * Formato real comprobado en tu API:
   *
   * [
   *   {
   *     property_id: 742969,
   *     periods: [
   *       {
   *         start: "...",
   *         end: "...",
   *         available: 1
   *       }
   *     ]
   *   }
   * ]
   */

  if (Array.isArray(data)) {

    if (data.length === 0) {
      return false;
    }

    for (const item of data) {

      if (item && Array.isArray(item.periods)) {
        periodos.push(...item.periods);
      }

    }

  } else if (
    data &&
    Array.isArray(data.periods)
  ) {

    periodos = data.periods;

  }


  if (periodos.length === 0) {
    return false;
  }


  return periodos.every((periodo) => {

    if (periodo.closed_period === true) {
      return false;
    }

    if (typeof periodo.available === "number") {
      return periodo.available > 0;
    }

    if (typeof periodo.available === "boolean") {
      return periodo.available === true;
    }

    return false;
  });
}


function normalizar(texto) {

  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}


function nombreZona(zona) {

  if (zona === "malaga") {
    return "Malaga";
  }

  if (zona === "fuengirola") {
    return "Fuengirola";
  }

  if (zona === "marbella") {
    return "Marbella";
  }

  return zona;
}


function esperar(ms) {

  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


function enviarJSON(res, status, data) {

  res.writeHead(status, {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*"
  });

  res.end(
    JSON.stringify(data)
  );
}


server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Servidor disponibilidad-xpce activo en puerto ${PORT}`
  );
});
