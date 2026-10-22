# TP 08 - Endpoints persistentes de reservas de salas

## 1. Descripción del proyecto

Este proyecto corresponde al Trabajo Práctico 08 del curso de Desarrollo Back-end con Node.js.

El objetivo es migrar la gestión de reservas de salas a la base de datos de MongoDB, incorporando una API REST que permita crear, listar y consultar reservas mediante solicitudes HTTP entre el cliente y servidor.

Se conserva el sitio web HTML del trabajo práctico Nro 07 y se incorpora una API JSON. Tanto el sitio como la API deben utilizar la misma fuente de datos persistente.

### Objetivos

- Persistir las reservas en MongoDB Atlas.
- Implementar endpoints HTTP para la gestión de reservas.
- Separar las responsabilidades mediante una arquitectura por capas.
- Validar los datos recibidos por el servidor.
- Manejar errores y devolver respuestas HTTP apropiadas.
- Verificar la persistencia de los datos después de reiniciar el servidor.

## 2. Origen del proyecto

El proyecto parte de una copia funcional del Trabajo Práctico 07 individual.

Repositorio de origen:(https://github.com/ariannesystems/tp-07-salas-mongodb.git)

**Repositorio actual: (https://github.com/ariannesystems/tp-08-salas-http-mongodb.git)

### Principales modificaciones respecto del TP 07

- Migración de las operaciones de reservas a MongoDB.
- Incorporación de un servicio asíncrono de persistencia.
- Implementación de endpoints para listar, crear y consultar reservas.
- Incorporación del campo `estado`, cuyo valor predeterminado es `pendiente`.
- Separación entre las rutas del sitio HTML y las rutas de la API.
- Adaptación de los controladores para trabajar con operaciones asíncronas.
- Actualización del conteo de reservas para consultar la base de datos.
- Incorporación del manejo centralizado de errores.

## 3. Tecnologías y versiones

| Tecnología         | Versión         |
| ------------------ | --------------- |
| Node.js            | 24.19.0         |
| npm                | 11.17.0         |
| Express            | 5.2.1           |
| Mongoose           | 9.11.1          |
| MongoDB Atlas      | Clúster Free M0 |
| Postman            | 12.33.3         |
| Sistema de módulos | CommonJS        |

## 4. Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm instalados.
- Una cuenta de MongoDB Atlas.
- Un clúster de tipo Free M0.
- Acceso de red autorizado al clúster.
- Una base de datos denominada `reservas_salas_u8`.
- Una colección denominada `reservas`.
- Postman para probar la API.

## 5. Configuración de MongoDB Atlas

1. Ingresar a MongoDB Atlas.
2. Crear o seleccionar un clúster Free M0.
3. Configurar un usuario de base de datos con los permisos necesarios.
4. Autorizar la dirección IP desde la que se ejecutará la aplicación.
5. Obtener la cadena de conexión del clúster.
6. Configurar la URI de conexión en las variables de entorno.
7. Utilizar `reservas_salas_u8` como nombre de la base de datos.

La colección `reservas` almacenará los documentos creados por la aplicación.

No es necesario insertar datos de prueba automáticamente al iniciar el servidor. Las reservas deben crearse mediante el formulario o la API.

## 6. Variables de entorno

```dotenv
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<USUARIO>:<PASSWORD>@<CLUSTER>/reservas_salas_u8
```

**Seguridad:**

- No subir el archivo `.env` a GitHub.
- No publicar contraseñas ni URI reales de conexión.
- Incluir la plantilla `.env.example` sin credenciales.
- Mantener las variables sensibles fuera del código fuente.

## 7. Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/ariannesystems/tp-07-salas-mongodb.git
cd tp-08-salas-http-mongodb
```

Instalar las dependencias:

```bash
npm install
```

Crear y completar el archivo `.env` utilizando la plantilla.

Iniciar la aplicación:

```bash
node --env-file=.env src/index.js
```

La aplicación debe esperar a que la conexión con MongoDB se establezca antes de comenzar a escuchar solicitudes HTTP.

Si la conexión falla durante el arranque, el servidor no debe anunciar que está disponible.

## 8. Estructura del proyecto

La estructura debe reflejar las carpetas y los archivos realmente presentes en el repositorio.

```
└── 📁tp-08-salas-http-mongodb
    └── 📁public
        └── 📁css
            ├── estilos.css
        └── 📁img
            ├── reservas.svg
    └── 📁scripts
        ├── comprobar-conexion.js
        ├── crear-reserva.js
        ├── listar-reservas.js
        ├── validar-reserva.js
    └── 📁src
        └── 📁config
            ├── base-datos.js
            ├── entorno.js
        └── 📁controladores
            ├── reservas.js
        └── 📁middleware
            ├── errores.js
            ├── reservas.js
            ├── solicitudes.js
        └── 📁modelos
            ├── reservas.js
        └── 📁rutas
            ├── reservas-api.js
            ├── reservas.js
        └── 📁servicios
            ├── reservas-mongo.js
        ├── app.js
        ├── index.js
    └── 📁views
        └── 📁layouts
            ├── main.ejs
        └── 📁partials
            ├── encabezado.ejs
            ├── pie.ejs
        └── 📁reservas
            ├── detalle.ejs
            ├── lista.ejs
            ├── nueva.ejs
        ├── inicio.ejs
        ├── no-encontrado.ejs
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── eslint.config.js
    ├── package-lock.json
    ├── package.json
    └── README.md
```

### Responsabilidades por capa

- **Config:** configuración de la aplicación y conexión con MongoDB.
- **Modelos:** definición del esquema de las reservas y sus validaciones.
- **Servicios:** operaciones asíncronas de acceso a los datos.
- **Controladores:** recepción de solicitudes, coordinación de operaciones y generación de respuestas.
- **Rutas:** definición de los endpoints HTTP.
- **Middleware:** procesamiento de solicitudes y manejo centralizado de errores.
- **Scripts:** herramientas auxiliares del proyecto.

## 9. Modelo de reserva

El modelo conserva los seis campos del TP 07 y agrega el campo `estado`.

| Campo        | Tipo   | Validación                                                   |
| ------------ | ------ | ------------------------------------------------------------ |
| `estudiante` | String | Obligatorio y sin espacios externos                          |
| `email`      | String | Obligatorio, sin espacios externos y con `@`                 |
| `sala`       | String | Sala Norte, Sala Sur o Sala Multimedia                       |
| `fecha`      | String | Obligatorio y sin espacios externos                          |
| `turno`      | String | Mañana, Tarde o Noche                                        |
| `personas`   | Number | Entero entre 1 y 6                                           |
| `estado`     | String | `pendiente` o `confirmada`; valor predeterminado `pendiente` |

El identificador de MongoDB se representa en la API mediante el campo textual `id`, derivado del `ObjectId`.

El cliente no puede establecer el estado durante la creación de una reserva. En esta entrega no se implementa una operación para confirmar reservas.

## 10. Endpoints de la API

La API utiliza el prefijo `/api/reservas`.

| Método | Endpoint                          | Descripción                                | Resultado esperado |
| ------ | --------------------------------- | ------------------------------------------ | ------------------ |
| GET    | `/api/reservas`                   | Lista todas las reservas.                  | 200 OK             |
| GET    | `/api/reservas/:id`               | Consulta una reserva por su identificador. | 200 OK             |
| POST   | `/api/reservas`                   | Crea una reserva.                          | 201 Created        |
| GET    | `/api/reservas?sala=Sala%20Norte` | Filtra por coincidencia exacta de sala.    | 200 OK             |

### Códigos de respuesta

- `200`: consulta realizada correctamente.
- `201`: reserva creada correctamente; la respuesta incluye la cabecera `Location`.
- `400`: datos inválidos, JSON mal formado, identificador inválido o parámetro de sala repetido.
- `404`: identificador con formato válido que no corresponde a un documento existente.
- `500`: error inesperado durante una operación.

Las respuestas de la API deben ser JSON, incluidos los errores de rutas API desconocidas.

Una lista sin resultados debe devolver un arreglo vacío (`[]`), no un `404`.

La API de esta entrega no implementa los métodos `PUT`, `PATCH` ni `DELETE`.

## 11. Ejemplo de creación de una reserva

**Solicitud**

```http
POST /api/reservas
Content-Type: application/json
```

**Body (raw, JSON)**

```json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2
}
```

No enviar `estado` ni `_id` en el cuerpo de creación.

**Respuesta esperada:** `201 Created`.

```json
{
  "id": "<ID_GENERADO_POR_MONGODB>",
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-21",
  "turno": "Mañana",
  "personas": 2,
  "estado": "pendiente"
}
```

El identificador es ilustrativo. En la ejecución real debe aparecer el ID generado por MongoDB.

La respuesta también debe incluir la cabecera `Location`, con la dirección del recurso creado.

## 12. Pruebas de la API con Postman

Mantener el servidor activo durante las pruebas. En los ejemplos se utiliza el puerto `3000`.

### 12.1. Listar reservas

- Método: `GET`.
- URL: `http://localhost:3000/api/reservas`.
- Body: none.
- Resultado esperado: `200 OK` y un arreglo JSON.

Registrar la cantidad inicial de documentos.

### 12.2. Crear una reserva

- Método: `POST`.
- URL: `http://localhost:3000/api/reservas`.
- Body: raw, formato JSON.
- Cabecera: `Content-Type: application/json`.
- Resultado esperado: `201 Created`.

Registrar el identificador generado, la respuesta y la cabecera `Location`.

### 12.3. Consultar la reserva creada

- Método: `GET`.
- URL: utilizar la dirección recibida en `Location`.
- Body: none.
- Resultado esperado: `200 OK`.

Comprobar que el ID y los campos coinciden con los de la respuesta del POST.

### 12.4. Probar identificadores inválidos

Enviar:

```http
GET /api/reservas/1
```

Resultado esperado: `400 Bad Request`.

También se debe consultar un identificador con formato válido que no exista:

```http
GET /api/reservas/000000000000000000000000
```

Resultado esperado: `404 Not Found`, siempre que ese documento no exista.

### 12.5. Probar el filtro por sala

- Método: `GET`.
- URL: `http://localhost:3000/api/reservas?sala=Sala%20Norte`.
- Body: none.
- Resultado esperado: `200 OK` con las coincidencias exactas.

Repetir con una sala sin coincidencias y verificar que se devuelve `[]`.

En Postman, activar dos parámetros `sala` con valores diferentes para comprobar que el parámetro repetido se rechaza con `400 Bad Request`.

### 12.6. Probar entradas inválidas

Duplicar la solicitud POST y probar cada caso por separado:

- Estudiante vacío.
- Email sin `@`.
- Sala no permitida.
- Turno no permitido.
- Fecha vacía.
- Personas con valor `0`, `7`, `2.5` o `"abc"`.
- Personas con valor `true`, arreglo u objeto.
- Cuerpo ausente.
- JSON mal formado.

Resultado esperado: `400 Bad Request`, sin crear una reserva.

Probar también el envío de campos adicionales `estado` o `_id` junto con los seis campos válidos. La aplicación debe ignorarlos y crear la reserva con su propio identificador y el estado predeterminado `pendiente`.

## 13. Matriz de resultados

Completar esta tabla con los resultados realmente observados durante las pruebas. No marcar como aprobada una prueba que todavía no se haya realizado.

| Prueba                            | Resultado esperado                | Resultado observado |
| --------------------------------- | --------------------------------- | ------------------- |
| Listado inicial                   | 200 y arreglo                     | Pendiente           |
| Creación válida                   | 201 y Location                    | Pendiente           |
| Consulta por ID creado            | 200 y mismo recurso               | Pendiente           |
| Consulta tras reiniciar           | 200 y mismo ID                    | Pendiente           |
| ID `1`                            | 400                               | Pendiente           |
| ID válido inexistente             | 404                               | Pendiente           |
| Estudiante vacío                  | 400, sin aumento                  | Pendiente           |
| Email sin `@`                     | 400, sin aumento                  | Pendiente           |
| Sala o turno no permitido         | 400, sin aumento                  | Pendiente           |
| Fecha vacía                       | 400                               | Pendiente           |
| Personas inválidas                | 400                               | Pendiente           |
| Cuerpo ausente o JSON mal formado | 400 JSON                          | Pendiente           |
| Campos extra `estado` o `_id`     | No se asignan desde el cliente    | Pendiente           |
| Filtro por sala                   | Coincidencias exactas             | Pendiente           |
| Sala sin coincidencias            | 200 y `[]`                        | Pendiente           |
| Sala repetida                     | 400                               | Pendiente           |
| Listado repetido                  | Cantidad estable                  | Pendiente           |
| Formulario válido                 | Redirección 302                   | Pendiente           |
| Formulario inválido               | Respuesta 400 conservando valores | Pendiente           |
| Ruta `/estado`                    | Conteo obtenido desde MongoDB     | Pendiente           |
| URI ausente al arrancar           | El servidor no abre el puerto     | Pendiente           |

## 14. Prueba de persistencia después del reinicio

Para demostrar que MongoDB conserva los datos:

1. Consultar `GET /api/reservas` y registrar la cantidad inicial.
2. Crear una reserva mediante POST.
3. Guardar el ID y la cabecera `Location`.
4. Consultar la reserva por su ID y verificar sus datos.
5. Detener el servidor.
6. Volver a iniciar la aplicación con la misma configuración de MongoDB.
7. Consultar nuevamente el mismo ID mediante GET.
8. Comprobar que la reserva conserva el mismo identificador y los mismos datos.
9. Localizar la reserva desde el sitio HTML.
10. Inspeccionar la colección `reservas` en Atlas y comparar el `_id`.
11. Listar dos veces y comprobar que la cantidad de registros permanece estable.

No repetir el POST para demostrar persistencia, ya que eso crearía otra reserva.

**Resultado observado:** [Completar con el ID real, las cantidades antes y después del reinicio y la evidencia correspondiente].

## 15. Continuidad del sitio HTML

Verificar que las funcionalidades existentes continúan funcionando:

- Página de inicio.
- Estilos CSS y layout.
- Listado de reservas.
- Detalle de reserva, si existe en el proyecto.
- Formulario de creación.
- Ruta para páginas inexistentes.
- Endpoint `/estado`.

El listado, el detalle y el conteo deben utilizar los datos persistidos en MongoDB.

El formulario válido debe esperar a que se guarde la reserva y responder con una redirección `302`. El formulario inválido debe responder `400` y conservar los valores ingresados.

## 16. Manejo de errores y cierre del servidor

El proyecto debe distinguir los errores de validación, los recursos inexistentes y los fallos internos.

El middleware centralizado de errores debe registrarse después de las rutas y utilizar la firma de cuatro parámetros de Express.

Las respuestas de error no deben revelar trazas, contraseñas ni URI de conexión.

El servidor debe mantener la conexión con MongoDB durante su funcionamiento y realizar un cierre ordenado ante las señales `SIGINT` y `SIGTERM`.

Los errores de conexión o DNS durante el arranque deben impedir que el servidor empiece a escuchar.

## 17. Límites de validación

Las validaciones implementadas no garantizan:

- Que el email tenga un formato completo y válido.
- Que la fecha corresponda a una fecha real o futura.
- Que no existan reservas superpuestas.
- Que se controlen los cupos compartidos de una sala.
- Que no se creen reservas duplicadas.

La consigna no exige un índice único ni la implementación de estas reglas adicionales.

## 18. Cambios en la persistencia

En el TP 07, la aplicación utilizaba un objeto inicializado en memoria para gestionar las reservas.

En este TP 08, las operaciones de creación, listado y consulta se realizan mediante un servicio asíncrono conectado a MongoDB.

## 21. Conclusión

El trabajo práctico incorpora persistencia en MongoDB Atlas y una API JSON para gestionar las reservas de salas, manteniendo la continuidad del sitio HTML y separando las responsabilidades de la aplicación por capas.

La verificación final debe demostrar que las operaciones se realizan correctamente, que los datos permanecen después de reiniciar el servidor y que las entradas inválidas se rechazan sin modificar la colección.
