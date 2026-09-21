const http = require("http");

const PORT = process.env.PORT || 10000;

const ALOJAMIENTOS = {
  malaga: [
    { id: 521198, nombre: "XPCE TEATRO SQUARE MODERNO APARTAMENTO EN CENTRO HISTORICO", capacidad: 10 },
    { id: 521199, nombre: "XPCE SOHO MALAGA APARTAMENTO REFORMADO EN BARRIO DE MODA", capacidad: 5 },
    { id: 521203, nombre: "XPCE GIBRALFARO GARDENS DESCANSO A POCOS MINUTOS DEL CENTRO", capacidad: 6 },
    { id: 535556, nombre: "XPCE CATHEDRAL", capacidad: 5 },
    { id: 548059, nombre: "XPCE MUELLE 1", capacidad: 3 },
    { id: 548068, nombre: "XPCE MUELLE 2", capacidad: 3 },
    { id: 548087, nombre: "XPCE MERCED SQUARE - PICASSO", capacidad: 8 },
    { id: 590645, nombre: "XPCE URBAN MALAGA SKYLINE", capacidad: 4 },
    { id: 591978, nombre: "XPCE CERVANTES THEATER", capacidad: 4 },
    { id: 602510, nombre: "XPCE LUXURY SUITE IN MALAGUETA BEACH", capacidad: 3 },
    { id: 615680, nombre: "XPCE URBAN 2 MALAGA SKYLINE", capacidad: 3 },
    { id: 623651, nombre: "XPCE URBAN 3 MALAGA SKYLINE", capacidad: 4 },
    { id: 623654, nombre: "XPCE URBAN 4 MALAGA SKYLINE", capacidad: 5 },
    { id: 630372, nombre: "XPCE URBAN 7 MALAGA SKYLINE", capacidad: 5 },
    { id: 630374, nombre: "XPCE URBAN 9 MALAGA SKYLINE", capacidad: 5 },
    { id: 632463, nombre: "XPCE URBAN 8 MALAGA SKYLINE", capacidad: 2 },
    { id: 632507, nombre: "XPCE URBAN 6 MALAGA SKYLINE", capacidad: 6 },
    { id: 634333, nombre: "XPCE SKY TOWER", capacidad: 6 },
    { id: 640453, nombre: "XPCE URBAN 10 MALAGA SKYLINE", capacidad: 4 },
    { id: 649795, nombre: "XPCE URBAN 12 MALAGA SKYLINE", capacidad: 6 },
    { id: 649814, nombre: "XPCE URBAN 13 MALAGA SKYLINE", capacidad: 2 },
    { id: 650562, nombre: "XPCE URBAN 14 MALAGA SKYLINE", capacidad: 6 },
    { id: 661317, nombre: "XPCE URBAN 15 MALAGA SKYLINE", capacidad: 3 },
    { id: 661321, nombre: "XPCE URBAN 16 MALAGA SKYLINE", capacidad: 4 },
    { id: 663256, nombre: "XPCE VICTORIA 1", capacidad: 2 },
    { id: 663261, nombre: "XPCE VICTORIA 2", capacidad: 2 },
    { id: 663267, nombre: "XPCE VICTORIA 3", capacidad: 2 },
    { id: 664911, nombre: "XPCE URBAN 17 MALAGA SKYLINE", capacidad: 2 },
    { id: 670104, nombre: "XPCE URBAN 11 MALAGA SKYLINE", capacidad: 5 },
    { id: 670115, nombre: "XPCE URBAN 18 MALAGA SKYLINE", capacidad: 2 },
    { id: 684975, nombre: "XPCE URBAN 19 MALAGA SKYLINE", capacidad: 2 },
    { id: 690911, nombre: "XPCE CAPUCHINOS", capacidad: 2 },
    { id: 702098, nombre: "XPCE URBAN 20 MALAGA SKYLINE", capacidad: 2 },
    { id: 704935, nombre: "XPCE SALAMANCA MARKET 1", capacidad: 2 },
    { id: 704952, nombre: "XPCE SALAMANCA MARKET 2", capacidad: 4 },
    { id: 704955, nombre: "XPCE SALAMANCA MARKET 3", capacidad: 4 },
    { id: 704958, nombre: "XPCE SALAMANCA MARKET 4", capacidad: 4 },
    { id: 730407, nombre: "XPCE ALCAZABILLA", capacidad: 8 },
    { id: 750387, nombre: "XPCE ANCHA DEL CARMEN", capacidad: 4 },
    { id: 765458, nombre: "XPCE URBAN 21 MALAGA SKYLINE", capacidad: 2 },
    { id: 806204, nombre: "XPCE CARRETERIAS", capacidad: 6 },
    { id: 814437, nombre: "XPCE URBAN 22 MALAGA SKYLINE", capacidad: 2 },
    { id: 824740, nombre: "XPCE CARMELITAS", capacidad: 3 }
  ],

  fuengirola: [
    { id: 742969, nombre: "XPCE JADE TOWER", capacidad: 4 }
  ],

  marbella: [
    { id: 521200, nombre: "XPCE MARINO 1 JUNTO AL MAR, PUERTO Y CASCO HISTORICO", capacidad: 3 },
    { id: 521201, nombre: "XPCE MARINO 2 JUNTO AL MAR, PUERTO Y CASCO HISTORICO", capacidad: 3 },
    { id: 521202, nombre: "XPCE DON CARLOS GARDENS PARAISO NATURAL JUNTO AL MAR", capacidad: 5 },
    { id: 545404, nombre: "XPCE RODEO BEACH", capacidad: 5 },
    { id: 548037, nombre: "XPCE LOS JAZMINES DE NUEVA ANDALUCIA", capacidad: 5 },
    { id: 561462, nombre: "XPCE VILLA ARTOLA BEACH", capacidad: 10 },
    { id: 649817, nombre: "XPCE GOLDEN BANUS PENTHOUSE - PARKING FREE", capacidad: 5 }
  ]
};


const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

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

    const numeroHuespedes = Number(
      url.searchParams.get("numero_huespedes")
    );


    // PARAMETROS OBLIGATORIOS

    if (
      !zona ||
      !fechaEntrada ||
      !fechaSalida ||
      !numeroHuespedes
    ) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "Faltan parametros",
        requeridos: [
          "zona",
          "fecha_entrada",
          "fecha_salida",
          "numero_huespedes"
        ]
      });
    }


    // VALIDAR NUMERO DE HUESPEDES

    if (
      !Number.isInteger(numeroHuespedes) ||
      numeroHuespedes < 1
    ) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "numero_huespedes debe ser un numero entero mayor que 0"
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


    // FILTRAR PRIMERO POR CAPACIDAD

    const alojamientos = ALOJAMIENTOS[zona].filter(
      alojamiento => alojamiento.capacidad >= numeroHuespedes
    );


    // SI NINGUN APARTAMENTO ADMITE ESE NUMERO DE HUESPEDES

    if (alojamientos.length === 0) {
      return enviarJSON(res, 200, {
        ok: true,
        zona: nombreZona(zona),
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
        numero_huespedes: numeroHuespedes,
        total_disponibles: 0,
        disponibles: [],
        consultas_con_error: 0,
        errores: [],
        mensaje:
          "No hay alojamientos en esta zona con capacidad suficiente para el numero de huespedes indicado."
      });
    }


    const headers = {
      "X-ApiKey": process.env.LODGIFY_API_KEY,
      "Accept": "application/json"
    };


    const disponibles = [];
    const errores = [];

    const TAMANO_GRUPO = 3;
    const MAX_RESULTADOS = 3;


    // CONSULTAR DISPONIBILIDAD SOLO DE LOS APTOS CON CAPACIDAD SUFICIENTE

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
              nombre: alojamiento.nombre,
              capacidad: alojamiento.capacidad
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
      numero_huespedes: numeroHuespedes,
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
