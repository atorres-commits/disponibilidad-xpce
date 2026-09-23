const http = require("http");
const URBAN_DATA = require("./urban_data.json");
const MALAGA_DATA = require("./malaga_data.json");
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

        // --------------------------------------------------
    // INFORMACION METEOROLOGICA
    // --------------------------------------------------

    if (url.pathname === "/tiempo") {

      if (req.method !== "GET") {
        return enviarJSON(res, 405, {
          ok: false,
          error: "Metodo no permitido. Utiliza GET."
        });
      }

      return await procesarTiempo(url, res);
    }    

    // --------------------------------------------------
// VERIFICAR RESERVA DE HUESPED
// --------------------------------------------------

if (url.pathname === "/verificar-reserva") {

  if (req.method !== "GET") {
    return enviarJSON(res, 405, {
      ok: false,
      error: "Metodo no permitido. Utiliza GET."
    });
  }

  return await procesarVerificarReserva(url, res);
}
    // --------------------------------------------------
// VERIFICAR ACCESO DE ADMINISTRADOR
// --------------------------------------------------

if (url.pathname === "/verificar-administrador") {
  if (req.method !== "GET") {
    return enviarJSON(res, 405, {
      ok: false,
      autorizado: false,
      error: "Metodo no permitido. Utiliza GET."
    });
  }

  return procesarVerificarAdministrador(url, res);
}// --------------------------------------------------
// INFORMACION ESTRUCTURADA DE ALOJAMIENTOS MALAGA
// --------------------------------------------------

if (url.pathname === "/informacion-alojamiento-malaga") {

  if (req.method !== "GET") {
    return enviarJSON(res, 405, {
      ok: false,
      error: "Metodo no permitido. Utiliza GET."
    });
  }

  const alojamiento = String(
    url.searchParams.get("alojamiento") || ""
  ).trim();

  if (!alojamiento) {
    return enviarJSON(res, 400, {
      ok: false,
      error: "Falta el alojamiento"
    });
  }

  const buscado = normalizar(alojamiento)
    .replace(/^xpce\s+/, "")
    .trim();

  const listaMalaga = Array.isArray(MALAGA_DATA)
    ? MALAGA_DATA
    : (Array.isArray(MALAGA_DATA.malaga)
        ? MALAGA_DATA.malaga
        : []);

  const coincidencias = listaMalaga.filter((ficha) => {

    const nombre = normalizar(
      ficha.nombre || ""
    )
      .replace(/^xpce\s+/, "")
      .trim();

    const alias = normalizar(
      ficha.alias_voz || ""
    ).trim();

    return (
      nombre === buscado ||
      alias === buscado ||
      nombre.includes(buscado) ||
      buscado.includes(nombre) ||
      alias.includes(buscado) ||
      buscado.includes(alias)
    );
  });

  if (coincidencias.length === 0) {
    return enviarJSON(res, 404, {
      ok: false,
      encontrado: false,
      error: "Alojamiento no encontrado"
    });
  }

  if (coincidencias.length > 1) {
    return enviarJSON(res, 409, {
      ok: false,
      encontrado: false,
      error: "Alojamiento ambiguo",
      opciones: coincidencias.map(
        (ficha) => ficha.alias_voz || ficha.nombre
      )
    });
  }

  return enviarJSON(res, 200, {
    ok: true,
    encontrado: true,
    alojamiento: coincidencias[0]
  });
}
   // --------------------------------------------------
// INFORMACION ESTRUCTURADA DE ALOJAMIENTO URBAN
// --------------------------------------------------

if (url.pathname === "/informacion-alojamiento") {
  if (req.method !== "GET") {
    return enviarJSON(res, 405, {
      ok: false,
      error: "Metodo no permitido. Utiliza GET."
    });
  }

  const alojamiento = String(
    url.searchParams.get("alojamiento") || ""
  ).trim();

  if (!alojamiento) {
    return enviarJSON(res, 400, {
      ok: false,
      error: "Falta el alojamiento"
    });
  }

  const buscado = normalizar(alojamiento)
    .replace(/^xpce /, "")
    .trim();

  const coincidencias = URBAN_DATA.urban.filter((ficha) => {
    const nombre = normalizar(ficha.nombre || "")
      .replace(/^xpce /, "")
      .trim();

    return nombre === buscado ||
           nombre.includes(buscado) ||
           buscado.includes(nombre);
  });

  if (coincidencias.length === 0) {
    return enviarJSON(res, 404, {
      ok: false,
      encontrado: false,
      error: "Alojamiento no encontrado"
    });
  }

  if (coincidencias.length > 1) {
    return enviarJSON(res, 409, {
      ok: false,
      encontrado: false,
      error: "Alojamiento ambiguo",
      opciones: coincidencias.map(
        (ficha) => ficha.nombre
      )
    });
  }

  return enviarJSON(res, 200, {
    ok: true,
    encontrado: true,
    alojamiento: coincidencias[0]
  });
} // --------------------------------------------------
    // SOLICITUD DE CONTACTO PARA RESERVA
    // --------------------------------------------------

    if (url.pathname === "/solicitud-reserva") {

      if (req.method === "OPTIONS") {
        res.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        });

        return res.end();
      }

      if (req.method !== "POST") {
        return enviarJSON(res, 405, {
          ok: false,
          error: "Metodo no permitido. Utiliza POST."
        });
      }

      return await procesarSolicitudReserva(req, res);
    }
        // --------------------------------------------------
    // CONSULTAR UN ALOJAMIENTO CONCRETO
    // --------------------------------------------------

    if (url.pathname === "/alojamiento") {

      if (req.method !== "GET") {
        return enviarJSON(res, 405, {
          ok: false,
          error: "Metodo no permitido. Utiliza GET."
        });
      }

      return await procesarAlojamientoConcreto(url, res);
    }

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


    if (
      !Number.isInteger(numeroHuespedes) ||
      numeroHuespedes < 1
    ) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "numero_huespedes debe ser un numero entero mayor que 0"
      });
    }


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


    // FILTRAR POR CAPACIDAD

    const alojamientos = ALOJAMIENTOS[zona].filter(
      alojamiento =>
        alojamiento.capacidad >= numeroHuespedes
    );


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


    // --------------------------------------------------
    // BUSCAR DISPONIBILIDAD
    // --------------------------------------------------

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
                etapa: "disponibilidad",
                status: response.status,
                detalle
              });

              return null;
            }


            const data = await response.json();

            const resultadoDisponibilidad =
              obtenerDisponibilidad(data);


            if (!resultadoDisponibilidad.disponible) {
              return null;
            }


            return {
              property_id: alojamiento.id,
              nombre: alojamiento.nombre,
              capacidad: alojamiento.capacidad,
              room_type_id:
                resultadoDisponibilidad.room_type_id
            };


          } catch (error) {

            errores.push({
              property_id: alojamiento.id,
              nombre: alojamiento.nombre,
              etapa: "disponibilidad",
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


    const opcionesDisponibles =
      disponibles.slice(0, MAX_RESULTADOS);


    // --------------------------------------------------
    // OBTENER PRECIO REAL DE LODGIFY
    // --------------------------------------------------

    const opcionesConPrecio = await Promise.all(

      opcionesDisponibles.map(
        async (alojamiento) => {

          try {

            if (!alojamiento.room_type_id) {

              errores.push({
                property_id: alojamiento.property_id,
                nombre: alojamiento.nombre,
                etapa: "presupuesto",
                error: "No se pudo obtener room_type_id"
              });

              return {
                ...alojamiento,
                precio_total: null,
                limpieza: null,
                moneda: "EUR"
              };
            }


            const quoteUrl = new URL(
              `https://api.lodgify.com/v2/quote/${alojamiento.property_id}`
            );

            quoteUrl.searchParams.set(
              "arrival",
              fechaEntrada
            );

            quoteUrl.searchParams.set(
              "departure",
              fechaSalida
            );

            quoteUrl.searchParams.set(
              "roomTypes[0].id",
              String(alojamiento.room_type_id)
            );

            quoteUrl.searchParams.set(
              "roomTypes[0].people",
              String(numeroHuespedes)
            );


            const quoteResponse = await fetch(
              quoteUrl.toString(),
              {
                method: "GET",
                headers
              }
            );


            if (!quoteResponse.ok) {

              let detalle = "";

              try {
                detalle =
                  await quoteResponse.text();
              } catch {
                detalle = "";
              }


              errores.push({
                property_id:
                  alojamiento.property_id,
                nombre:
                  alojamiento.nombre,
                etapa: "presupuesto",
                status:
                  quoteResponse.status,
                detalle
              });


              return {
                ...alojamiento,
                precio_total: null,
                limpieza: null,
                moneda: "EUR"
              };
            }


            const quoteData =
              await quoteResponse.json();


            const presupuesto =
              extraerPresupuesto(quoteData);


            return {
              property_id:
                alojamiento.property_id,

              nombre:
                alojamiento.nombre,

              capacidad:
                alojamiento.capacidad,

              precio_total:
                presupuesto.precio_total,

              limpieza:
                presupuesto.limpieza,

              moneda:
                presupuesto.moneda
            };


          } catch (error) {

            errores.push({
              property_id:
                alojamiento.property_id,
              nombre:
                alojamiento.nombre,
              etapa: "presupuesto",
              error: error.message
            });


            return {
              ...alojamiento,
              precio_total: null,
              limpieza: null,
              moneda: "EUR"
            };
          }

        }
      )
    );


    // --------------------------------------------------
    // RESPUESTA FINAL
    // --------------------------------------------------

    return enviarJSON(res, 200, {

      ok: true,

      zona:
        nombreZona(zona),

      fecha_entrada:
        fechaEntrada,

      fecha_salida:
        fechaSalida,

      numero_huespedes:
        numeroHuespedes,

      total_disponibles:
        opcionesConPrecio.length,

      disponibles:
        opcionesConPrecio,

      consultas_con_error:
        errores.length,

      errores:
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
// --------------------------------------------------
// CONSULTAR ALOJAMIENTO CONCRETO
// --------------------------------------------------

async function procesarAlojamientoConcreto(url, res) {

  try {

    const nombreSolicitado = (
      url.searchParams.get("alojamiento") || ""
    ).trim();

    const fechaEntrada = (
      url.searchParams.get("fecha_entrada") || ""
    ).trim();

    const fechaSalida = (
      url.searchParams.get("fecha_salida") || ""
    ).trim();

    const numeroHuespedes = Number(
      url.searchParams.get("numero_huespedes")
    );


    if (
      !nombreSolicitado ||
      !fechaEntrada ||
      !fechaSalida ||
      !numeroHuespedes
    ) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "Faltan parametros",
        requeridos: [
          "alojamiento",
          "fecha_entrada",
          "fecha_salida",
          "numero_huespedes"
        ]
      });
    }


    if (
      !Number.isInteger(numeroHuespedes) ||
      numeroHuespedes < 1
    ) {
      return enviarJSON(res, 400, {
        ok: false,
        error:
          "numero_huespedes debe ser un numero entero mayor que 0"
      });
    }


    if (!process.env.LODGIFY_API_KEY) {
      return enviarJSON(res, 500, {
        ok: false,
        error: "LODGIFY_API_KEY no configurada"
      });
    }


    const coincidencias =
      buscarAlojamientoPorNombre(nombreSolicitado);


    if (coincidencias.length === 0) {
      return enviarJSON(res, 404, {
        ok: false,
        error: "Alojamiento no encontrado",
        alojamiento_solicitado: nombreSolicitado
      });
    }


    if (coincidencias.length > 1) {
      return enviarJSON(res, 409, {
        ok: false,
        error:
          "El nombre coincide con varios alojamientos",
        opciones:
          coincidencias.map(item => item.nombre)
      });
    }


    const alojamiento = coincidencias[0];


    // CAPACIDAD

    if (alojamiento.capacidad < numeroHuespedes) {
      return enviarJSON(res, 200, {
        ok: true,
        nombre: alojamiento.nombre,
        zona: nombreZona(alojamiento.zona),
        capacidad: alojamiento.capacidad,
        numero_huespedes: numeroHuespedes,
        disponible: false,
        motivo: "capacidad_insuficiente",
        mensaje:
          `El alojamiento tiene capacidad maxima para ${alojamiento.capacidad} huespedes.`
      });
    }


    const headers = {
      "X-ApiKey": process.env.LODGIFY_API_KEY,
      "Accept": "application/json"
    };


    // DISPONIBILIDAD REAL

    const availabilityUrl =
      `https://api.lodgify.com/v2/availability/${alojamiento.id}` +
      `?start=${encodeURIComponent(fechaEntrada)}` +
      `&end=${encodeURIComponent(fechaSalida)}`;


    const availabilityResponse = await fetch(
      availabilityUrl,
      {
        method: "GET",
        headers
      }
    );


    if (!availabilityResponse.ok) {

      const detalle =
        await availabilityResponse.text();

      return enviarJSON(res, 502, {
        ok: false,
        error:
          "No se pudo consultar la disponibilidad en Lodgify",
        status:
          availabilityResponse.status,
        detalle
      });
    }


    const availabilityData =
      await availabilityResponse.json();


    const resultadoDisponibilidad =
      obtenerDisponibilidad(availabilityData);


    if (!resultadoDisponibilidad.disponible) {

      return enviarJSON(res, 200, {
        ok: true,
        nombre: alojamiento.nombre,
        zona: nombreZona(alojamiento.zona),
        capacidad: alojamiento.capacidad,
        numero_huespedes: numeroHuespedes,
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
        disponible: false,
        motivo: "sin_disponibilidad",
        mensaje:
          "El alojamiento tiene capacidad suficiente, pero no esta disponible para las fechas solicitadas."
      });
    }


    if (!resultadoDisponibilidad.room_type_id) {
      return enviarJSON(res, 502, {
        ok: false,
        error:
          "No se pudo obtener el room_type_id del alojamiento"
      });
    }


    // PRECIO REAL

    const quoteUrl = new URL(
      `https://api.lodgify.com/v2/quote/${alojamiento.id}`
    );


    quoteUrl.searchParams.set(
      "arrival",
      fechaEntrada
    );

    quoteUrl.searchParams.set(
      "departure",
      fechaSalida
    );

    quoteUrl.searchParams.set(
      "roomTypes[0].id",
      String(resultadoDisponibilidad.room_type_id)
    );

    quoteUrl.searchParams.set(
      "roomTypes[0].people",
      String(numeroHuespedes)
    );


    const quoteResponse = await fetch(
      quoteUrl.toString(),
      {
        method: "GET",
        headers
      }
    );


    if (!quoteResponse.ok) {

      const detalle =
        await quoteResponse.text();

      return enviarJSON(res, 502, {
        ok: false,
        error:
          "El alojamiento esta disponible pero no se pudo obtener el presupuesto",
        status: quoteResponse.status,
        detalle
      });
    }


    const quoteData =
      await quoteResponse.json();


    const presupuesto =
      extraerPresupuesto(quoteData);


    return enviarJSON(res, 200, {

      ok: true,

      nombre:
        alojamiento.nombre,

      zona:
        nombreZona(alojamiento.zona),

      capacidad:
        alojamiento.capacidad,

      numero_huespedes:
        numeroHuespedes,

      fecha_entrada:
        fechaEntrada,

      fecha_salida:
        fechaSalida,

      disponible:
        true,

      precio_total:
        presupuesto.precio_total,

      limpieza:
        presupuesto.limpieza,

      moneda:
        presupuesto.moneda
    });


  } catch (error) {

    return enviarJSON(res, 500, {
      ok: false,
      error:
        "Error al consultar el alojamiento",
      detalle:
        error.message
    });
  }
}


// --------------------------------------------------
// BUSCAR ALOJAMIENTO POR NOMBRE
// --------------------------------------------------

function buscarAlojamientoPorNombre(nombre) {

  const buscadoOriginal =
    normalizar(nombre);

  const buscado =
    buscadoOriginal.replace(/^xpce\s+/, "");

  const todos = [];


  for (
    const [zona, alojamientos] of
    Object.entries(ALOJAMIENTOS)
  ) {

    for (const alojamiento of alojamientos) {

      todos.push({
        ...alojamiento,
        zona
      });
    }
  }


  const exactos =
    todos.filter((alojamiento) => {

      const nombreNormal =
        normalizar(alojamiento.nombre);

      const nombreSinXpce =
        nombreNormal.replace(/^xpce\s+/, "");

      return (
        nombreNormal === buscadoOriginal ||
        nombreSinXpce === buscado
      );
    });


  if (exactos.length > 0) {
    return exactos;
  }


  return todos.filter((alojamiento) => {

    const nombreNormal =
      normalizar(alojamiento.nombre);

    const nombreSinXpce =
      nombreNormal.replace(/^xpce\s+/, "");

    return (
      nombreNormal.includes(buscadoOriginal) ||
      nombreSinXpce.includes(buscado)
    );
  });
}
// --------------------------------------------------
// INFORMACION METEOROLOGICA
// --------------------------------------------------

async function procesarTiempo(url, res) {

  try {

    if (!process.env.WEATHER_API_KEY) {
      return enviarJSON(res, 500, {
        ok: false,
        error: "WEATHER_API_KEY no configurada"
      });
    }

    const zonaSolicitada = (
      url.searchParams.get("zona") || ""
    ).trim();

    const zona = normalizar(zonaSolicitada);

    const LOCALIDADES_TIEMPO = {
      malaga: "Malaga, Spain",
      fuengirola: "Fuengirola, Spain",
      marbella: "Marbella, Spain"
    };

    if (!LOCALIDADES_TIEMPO[zona]) {
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

    const weatherUrl = new URL(
      "https://api.weatherapi.com/v1/forecast.json"
    );

    weatherUrl.searchParams.set(
      "key",
      process.env.WEATHER_API_KEY
    );

    weatherUrl.searchParams.set(
      "q",
      LOCALIDADES_TIEMPO[zona]
    );

    weatherUrl.searchParams.set(
      "days",
      "3"
    );

    weatherUrl.searchParams.set(
      "aqi",
      "no"
    );

    weatherUrl.searchParams.set(
      "alerts",
      "no"
    );

    weatherUrl.searchParams.set(
      "lang",
      "es"
    );

    const response = await fetch(
      weatherUrl.toString()
    );

    if (!response.ok) {

      const detalle = await response.text();

      return enviarJSON(res, 502, {
        ok: false,
        error:
          "No se pudo consultar la informacion meteorologica",
        status:
          response.status,
        detalle
      });
    }

    const data = await response.json();

    const actual = data.current || {};

    const previsiones =
      data.forecast &&
      Array.isArray(data.forecast.forecastday)
        ? data.forecast.forecastday
        : [];

    const dias = previsiones.map((item) => ({
      fecha:
        item.date,

      temperatura_maxima_c:
        item.day.maxtemp_c,

      temperatura_minima_c:
        item.day.mintemp_c,

      temperatura_media_c:
        item.day.avgtemp_c,

      estado:
        item.day.condition
          ? item.day.condition.text
          : null,

      probabilidad_lluvia:
        item.day.daily_chance_of_rain,

      precipitacion_mm:
        item.day.totalprecip_mm,

      viento_maximo_kmh:
        item.day.maxwind_kph
    }));

    return enviarJSON(res, 200, {

      ok: true,

      zona:
        nombreZona(zona),

      ubicacion:
        data.location
          ? data.location.name
          : nombreZona(zona),

      actualizado:
        actual.last_updated || null,

      actual: {
        temperatura_c:
          actual.temp_c,

        sensacion_termica_c:
          actual.feelslike_c,

        estado:
          actual.condition
            ? actual.condition.text
            : null,

        humedad:
          actual.humidity,

        viento_kmh:
          actual.wind_kph,

        direccion_viento:
          actual.wind_dir,

        precipitacion_mm:
          actual.precip_mm
      },

      previsión:
        dias
    });

  } catch (error) {

    return enviarJSON(res, 500, {
      ok: false,
      error:
        "Error al consultar el tiempo",
      detalle:
        error.message
    });
  }
}
// --------------------------------------------------
// INTERPRETAR DISPONIBILIDAD
// --------------------------------------------------

function obtenerDisponibilidad(data) {

  if (!data) {
    return {
      disponible: false,
      room_type_id: null
    };
  }


  if (!Array.isArray(data)) {

    return {
      disponible: false,
      room_type_id: null
    };
  }


  for (const item of data) {

    if (
      !item ||
      !Array.isArray(item.periods)
    ) {
      continue;
    }


    const periodos = item.periods;


    if (periodos.length === 0) {
      continue;
    }


    const disponible =
      periodos.every((periodo) => {

        if (
          periodo.closed_period === true
        ) {
          return false;
        }

        if (
          typeof periodo.available === "number"
        ) {
          return periodo.available > 0;
        }

        if (
          typeof periodo.available === "boolean"
        ) {
          return periodo.available === true;
        }

        return false;
      });


    if (disponible) {

      return {
        disponible: true,
        room_type_id:
          item.room_type_id || null
      };

    }
  }


  return {
    disponible: false,
    room_type_id: null
  };
}


// --------------------------------------------------
// EXTRAER PRECIO TOTAL Y LIMPIEZA
// --------------------------------------------------

function extraerPresupuesto(data) {

  let precioTotal = null;
  let limpieza = 0;
  let moneda = "EUR";


  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {

    return {
      precio_total: null,
      limpieza: null,
      moneda
    };
  }


  const quote = data[0];


  if (
    typeof quote.total_including_vat === "number"
  ) {
    precioTotal =
      quote.total_including_vat;
  }


  if (quote.currency_code) {
    moneda =
      quote.currency_code;
  }


  if (
    Array.isArray(quote.room_types)
  ) {

    for (
      const roomType of quote.room_types
    ) {

      if (
        !Array.isArray(roomType.price_types)
      ) {
        continue;
      }


      for (
        const priceType of roomType.price_types
      ) {

        if (
          !Array.isArray(priceType.prices)
        ) {
          continue;
        }


        for (
          const price of priceType.prices
        ) {

          const descripcion =
            normalizar(
              price.description || ""
            );


          if (
            descripcion.includes("limpieza") ||
            descripcion.includes("cleaning")
          ) {

            if (
              typeof price.amount === "number"
            ) {
              limpieza +=
                price.amount;
            }

          }
        }
      }
    }
  }


  return {
    precio_total:
      precioTotal,

    limpieza:
      limpieza,

    moneda:
      moneda
  };
}


// --------------------------------------------------
// SOLICITUD DE CONTACTO PARA RESERVA - RESEND
// --------------------------------------------------

async function procesarSolicitudReserva(req, res) {

  try {

    if (!process.env.RESEND_API_KEY) {
      return enviarJSON(res, 500, {
        ok: false,
        error: "RESEND_API_KEY no configurada"
      });
    }

    const body = await leerJSON(req);

    const nombreCompleto = String(
      body.nombre_completo || ""
    ).trim();

    const email = String(
      body.email || ""
    ).trim();

    const telefono = normalizarTelefono(
  body.telefono
);

    const alojamiento = String(
      body.alojamiento || ""
    ).trim();

    const fechaEntrada = String(
      body.fecha_entrada || ""
    ).trim();

    const fechaSalida = String(
      body.fecha_salida || ""
    ).trim();

    const numeroHuespedes = Number(
      body.numero_huespedes
    );

    const precioTotal = Number(
      body.precio_total
    );

    const faltan = [];

    if (!nombreCompleto) faltan.push("nombre_completo");
    if (!email) faltan.push("email");
    if (!telefono) faltan.push("telefono");
    if (!alojamiento) faltan.push("alojamiento");
    if (!fechaEntrada) faltan.push("fecha_entrada");
    if (!fechaSalida) faltan.push("fecha_salida");

    if (
      !Number.isInteger(numeroHuespedes) ||
      numeroHuespedes < 1
    ) {
      faltan.push("numero_huespedes");
    }

    if (
      !Number.isFinite(precioTotal) ||
      precioTotal < 0
    ) {
      faltan.push("precio_total");
    }

    if (faltan.length > 0) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "Faltan datos obligatorios o no son validos",
        campos: faltan
      });
    }
    function normalizarTelefono(valor) {

  if (Array.isArray(valor)) {
    valor = valor.join("");
  }

  let telefono = String(valor || "").trim();

  telefono = telefono
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .replace(/[()\-]/g, "");

  // Si ARSYS añade un 0 delante de un número español de 9 cifras,
  // eliminamos únicamente ese cero inicial.
  if (/^0[6789]\d{8}$/.test(telefono)) {
    telefono = telefono.substring(1);
  }

  return telefono;
}

    if (!emailValido(email)) {
      return enviarJSON(res, 400, {
        ok: false,
        error: "Direccion de correo electronico no valida"
      });
    }

    const asunto =
      `Solicitud de reserva - ${alojamiento} - ${nombreCompleto}`;

    const texto = [
      "Nueva solicitud de contacto para tramitar una reserva",
      "",
      `Cliente: ${nombreCompleto}`,
      `Email: ${email}`,
      `Telefono: ${telefono}`,
      "",
      `Alojamiento: ${alojamiento}`,
      `Fecha de entrada: ${fechaEntrada}`,
      `Fecha de salida: ${fechaSalida}`,
      `Numero de huespedes: ${numeroHuespedes}`,
      `Precio total informado: ${precioTotal.toFixed(2)} EUR`,
      "",
      "El cliente ha solicitado que el equipo de Xperience Malaga Apartments contacte con el para ayudarle a tramitar la reserva."
    ].join("\n");

    const html = `
      <h2>Nueva solicitud de contacto para reserva</h2>
      <p><strong>Cliente:</strong> ${escaparHTML(nombreCompleto)}</p>
      <p><strong>Email:</strong> ${escaparHTML(email)}</p>
      <p><strong>Telefono:</strong> ${escaparHTML(telefono)}</p>
      <hr>
      <p><strong>Alojamiento:</strong> ${escaparHTML(alojamiento)}</p>
      <p><strong>Fecha de entrada:</strong> ${escaparHTML(fechaEntrada)}</p>
      <p><strong>Fecha de salida:</strong> ${escaparHTML(fechaSalida)}</p>
      <p><strong>Numero de huespedes:</strong> ${numeroHuespedes}</p>
      <p><strong>Precio total informado:</strong> ${precioTotal.toFixed(2)} EUR</p>
      <hr>
      <p>El cliente ha solicitado que el equipo de Xperience Malaga Apartments contacte con el para ayudarle a tramitar la reserva.</p>
    `;

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Xperience Malaga Apartments <hola@xpce.es>",
          to: [
            "hola@xpce.es",
            "atorres@xpce.es"
          ],
          reply_to: email,
          subject: asunto,
          text: texto,
          html
        })
      }
    );

    const resendTexto = await resendResponse.text();

    let resendData = null;

    try {
      resendData = resendTexto
        ? JSON.parse(resendTexto)
        : {};
    } catch {
      resendData = {
        raw: resendTexto
      };
    }

    if (!resendResponse.ok) {
      return enviarJSON(res, 502, {
        ok: false,
        error: "Resend no pudo enviar el correo",
        status: resendResponse.status,
        detalle: resendData
      });
    }

    return enviarJSON(res, 200, {
      ok: true,
      mensaje: "Solicitud enviada correctamente",
      email_id:
        resendData && resendData.id
          ? resendData.id
          : null
    });

  } catch (error) {

    return enviarJSON(res, 500, {
      ok: false,
      error: "No se pudo enviar la solicitud de reserva",
      detalle: error.message
    });
  }
}


function leerJSON(req) {

  return new Promise((resolve, reject) => {

    let contenido = "";

    req.on("data", (chunk) => {
      contenido += chunk;

      if (contenido.length > 100000) {
        reject(new Error("Solicitud demasiado grande"));
        req.destroy();
      }
    });

    req.on("end", () => {

      try {
        resolve(
          contenido ? JSON.parse(contenido) : {}
        );
      } catch {
        reject(new Error("JSON no valido"));
      }
    });

    req.on("error", reject);
  });
}


function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function escaparHTML(valor) {

  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// --------------------------------------------------
// NORMALIZAR TEXTO
// --------------------------------------------------

function normalizar(texto) {

  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}


// --------------------------------------------------
// NOMBRE DE ZONA
// --------------------------------------------------

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


// --------------------------------------------------
// ESPERAR
// --------------------------------------------------

function esperar(ms) {

  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


// --------------------------------------------------
// RESPUESTA JSON
// --------------------------------------------------
// --------------------------------------------------
// VERIFICAR RESERVA DE HUESPED
// --------------------------------------------------

function normalizarNombreReserva(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function procesarVerificarReserva(url, res) {

  try {

    const nombreCliente = (
      url.searchParams.get("nombre_cliente") || ""
    ).trim();

    const fechaEntrada = (
      url.searchParams.get("fecha_entrada") || ""
    ).trim();

    const fechaSalida = (
      url.searchParams.get("fecha_salida") || ""
    ).trim();

    if (!nombreCliente || !fechaEntrada || !fechaSalida) {
      return enviarJSON(res, 400, {
        ok: false,
        reserva_verificada: false,
        error: "Faltan parametros",
        requeridos: [
          "nombre_cliente",
          "fecha_entrada",
          "fecha_salida"
        ]
      });
    }

    if (!process.env.LODGIFY_API_KEY) {
      return enviarJSON(res, 500, {
        ok: false,
        reserva_verificada: false,
        error: "LODGIFY_API_KEY no configurada"
      });
    }

    const lodgifyUrl = new URL(
      "https://api.lodgify.com/v2/reservations/bookings"
    );

    lodgifyUrl.searchParams.set("page", "1");
    lodgifyUrl.searchParams.set("size", "50");
    lodgifyUrl.searchParams.set("stayFilter", "ArrivalDate");
    lodgifyUrl.searchParams.set(
      "stayFilterDate",
      fechaEntrada
    );

    const response = await fetch(
      lodgifyUrl.toString(),
      {
        method: "GET",
        headers: {
          "X-ApiKey":
            process.env.LODGIFY_API_KEY,
          "Accept":
            "application/json"
        }
      }
    );

    if (!response.ok) {

      const detalle =
        await response.text();

      return enviarJSON(res, 502, {
        ok: false,
        reserva_verificada: false,
        error:
          "No se pudo consultar Lodgify",
        status:
          response.status,
        detalle
      });
    }

    const data = await response.json();

    const reservas =
      Array.isArray(data.items)
        ? data.items
        : [];

    const nombreBuscado =
      normalizarNombreReserva(
        nombreCliente
      );

    const coincidencias =
      reservas.filter((reserva) => {

        const nombreReserva =
          normalizarNombreReserva(
            reserva.guest &&
            reserva.guest.name
          );

        return (
          reserva.status === "Booked" &&
          reserva.arrival === fechaEntrada &&
          reserva.departure === fechaSalida &&
          nombreReserva === nombreBuscado
        );
      });

    if (coincidencias.length === 0) {
      return enviarJSON(res, 200, {
        ok: true,
        reserva_verificada: false,
        motivo: "sin_coincidencia"
      });
    }

    if (coincidencias.length > 1) {
      return enviarJSON(res, 200, {
        ok: true,
        reserva_verificada: false,
        motivo: "coincidencia_ambigua"
      });
    }

    const reserva =
      coincidencias[0];

    let alojamientoEncontrado = null;
    let zonaEncontrada = null;

    for (
      const [zona, alojamientos]
      of Object.entries(ALOJAMIENTOS)
    ) {

      const encontrado =
        alojamientos.find(
          (alojamiento) =>
            Number(alojamiento.id) ===
            Number(reserva.property_id)
        );

      if (encontrado) {
        alojamientoEncontrado =
          encontrado;
        zonaEncontrada =
          zona;
        break;
      }
    }

    if (!alojamientoEncontrado) {
      return enviarJSON(res, 200, {
        ok: true,
        reserva_verificada: false,
        motivo:
          "alojamiento_no_identificado"
      });
    }

    return enviarJSON(res, 200, {
      ok: true,
      reserva_verificada: true,
      nombre_cliente:
        reserva.guest.name,
      fecha_entrada:
        reserva.arrival,
      fecha_salida:
        reserva.departure,
      alojamiento:
        alojamientoEncontrado.nombre,
      zona:
        nombreZona(zonaEncontrada)
    });

  } catch (error) {

    return enviarJSON(res, 500, {
      ok: false,
      reserva_verificada: false,
      error:
        "Error al verificar la reserva",
      detalle:
        error.message
    });
  }
}
// --------------------------------------------------
// VERIFICAR ACCESO DE ADMINISTRADOR
// --------------------------------------------------

function procesarVerificarAdministrador(url, res) {

  try {

    if (!process.env.ADMIN_ACCESS_KEY) {
      return enviarJSON(res, 500, {
        ok: false,
        autorizado: false,
        error: "ADMIN_ACCESS_KEY no configurada"
      });
    }

    const clave = String(
      url.searchParams.get("clave") || ""
    ).trim();

    if (!clave) {
      return enviarJSON(res, 400, {
        ok: false,
        autorizado: false,
        error: "Falta la clave"
      });
    }

    if (clave !== process.env.ADMIN_ACCESS_KEY) {
      return enviarJSON(res, 200, {
        ok: true,
        autorizado: false
      });
    }

    return enviarJSON(res, 200, {
      ok: true,
      autorizado: true
    });

  } catch (error) {

    return enviarJSON(res, 500, {
      ok: false,
      autorizado: false,
      error: "Error al verificar administrador",
      detalle: error.message
    });
  }
}
function enviarJSON(res, status, data) {

  res.writeHead(status, {
    "Content-Type":
      "application/json; charset=UTF-8",

    "Access-Control-Allow-Origin":
      "*"
  });


  res.end(
    JSON.stringify(data)
  );
}


// --------------------------------------------------
// INICIAR SERVIDOR
// --------------------------------------------------

server.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Servidor disponibilidad-xpce activo en puerto ${PORT}`
    );

  }
);
