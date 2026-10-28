# Boca Players

Aplicación web educativa para consultar perfiles de jugadores relacionados con
Boca Juniors. La API REST está hecha con Laravel y SQLite; la interfaz usa
Next.js con TypeScript y App Router, e incluye una PWA instalable con una
pantalla básica sin conexión.

> Proyecto personal educativo e independiente; no es una aplicación oficial
> del Club Atlético Boca Juniors. No se utilizan su escudo ni sus marcas
> oficiales.

## Tecnologías

- PHP 8.3, Laravel 13 y Composer.
- SQLite mediante PDO; no hace falta instalar un servidor de base de datos.
- Node.js 22, npm, Next.js 16, React 19 y TypeScript.
- Service Worker y Web App Manifest para instalación y funcionamiento offline
  básico.
- Git para control de versiones.

## Requisitos previos

- Windows, PowerShell y Visual Studio Code.
- PHP 8.3 o superior, con las extensiones `pdo_sqlite` y `sqlite3`.
- Composer 2.9 o compatible.
- Node.js 22 y npm 10 o compatible.
- Git.

Laragon puede proporcionar PHP y Composer. La base de datos de desarrollo es un
archivo SQLite local; no se necesita iniciar MySQL.

## Instalación y ejecución

Los comandos siguientes suponen que PowerShell se abre en la carpeta raíz
`Boca Players`.

### 1. Instalar y preparar la API

```powershell
Set-Location '.\api'
composer install
Copy-Item '.env.example' '.env'
php artisan key:generate
if (-not (Test-Path '.\database\database.sqlite')) {
    New-Item -ItemType File '.\database\database.sqlite' | Out-Null
}
php artisan migrate --seed
```

Laravel usa SQLite a partir de `DB_CONNECTION=sqlite`; si `DB_DATABASE` no se
define, el proyecto utiliza `api/database/database.sqlite`. `migrate --seed`
crea las tablas y carga los cinco registros de ejemplo. El seeder es
re-ejecutable y actualiza los registros por nombre.

Para revisar o reiniciar toda la base local desde cero, se puede usar:

```powershell
php artisan migrate:fresh --seed
```

**Atención:** `migrate:fresh` elimina las tablas y sus datos antes de volver a
crearlas.

En una terminal de PowerShell que permanecerá abierta, iniciar la API:

```powershell
Set-Location 'C:\Users\arque\Desktop\Boca Players\api'
php artisan serve --host 127.0.0.1 --port 8000
```

La API estará disponible en `http://127.0.0.1:8000/api`.

### 2. Instalar y ejecutar el frontend

En una segunda terminal:

```powershell
Set-Location 'C:\Users\arque\Desktop\Boca Players\web'
npm ci
Copy-Item '.env.example' '.env.local'
npm run dev
```

`web/.env.local` debe contener:

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Abrir `http://127.0.0.1:3000` en el navegador. Para el funcionamiento normal,
mantener abiertas ambas terminales: una ejecuta Laravel y la otra Next.js. Si
la página deja de cargar, comprobar que los dos servidores sigan activos.

`NEXT_PUBLIC_API_URL` es una URL pública, no una credencial. No guardar secretos
ni tokens en variables `NEXT_PUBLIC_*`: esos valores se incorporan al frontend.
En otra máquina o entorno, actualizar esta variable con la URL real de la API.

### 3. Iniciar después de la primera instalación

En dos terminales independientes:

```powershell
Set-Location 'C:\Users\arque\Desktop\Boca Players\api'
php artisan serve --host 127.0.0.1 --port 8000
```

```powershell
Set-Location 'C:\Users\arque\Desktop\Boca Players\web'
npm run dev
```

### 4. Comprobar la PWA

El modo offline se comprobó con el build de producción. Con Laravel ejecutándose,
abrir una terminal adicional:

```powershell
Set-Location 'C:\Users\arque\Desktop\Boca Players\web'
npm run build
npm run start
```

Abrir `http://127.0.0.1:3000` con conexión y esperar a que el Service Worker se
active. En Chrome, instalar desde el icono de instalación de la barra de
direcciones o desde el menú del navegador, bajo **Guardar y compartir** →
**Instalar página como aplicación**. La instalación agrega la aplicación al
sistema; no descarga un juego ni un archivo ejecutable.

Para comprobar la pantalla offline, abrir las herramientas del navegador
(`F12`), ir a **Network**, activar **Offline** y navegar a otra ruta o recargar.
Se debe mostrar la pantalla **“Estas sin conexión.”**. Volver a seleccionar
**No throttling** para recuperar la red. El primer acceso y la precarga de
`offline.html` requieren conexión.

El registro de Service Worker requiere un contexto seguro: HTTPS en producción
o `localhost`/`127.0.0.1` en desarrollo. La caché intencionalmente solo guarda
la pantalla estática `/offline.html`; no almacena respuestas de la API ni
errores HTTP.

## Modelo y API

El recurso `Jugador` usa los mismos campos en SQLite, Laravel y el JSON:

| Campo | Tipo | Requerido |
|---|---|---:|
| `id` | entero autoincremental | Sí |
| `nombre` | texto | Sí |
| `numero_camiseta` | entero | Sí |
| `posicion` | texto | Sí |
| `nacionalidad` | texto | Sí |
| `titular` | booleano | Sí |
| `fecha_nacimiento` | fecha `YYYY-MM-DD` | Sí |

Rutas registradas con `Route::apiResource('jugadores', ...)`:

| Método | Endpoint | Uso | Código esperado |
|---|---|---|---:|
| `GET` | `/api/jugadores` | Listar jugadores | 200 |
| `GET` | `/api/jugadores/{id}` | Consultar un jugador | 200; 404 si no existe |
| `POST` | `/api/jugadores` | Crear jugador | 201; 422 si la validación falla |
| `PUT` | `/api/jugadores/{id}` | Reemplazar campos del jugador | 200; 404 si no existe; 422 si la validación falla |
| `PATCH` | `/api/jugadores/{id}` | Actualizar algunos campos | 200; 404 si no existe; 422 si la validación falla |
| `DELETE` | `/api/jugadores/{id}` | Eliminar jugador | 200; 404 si no existe |

### Ejemplo de consulta

```http
GET http://127.0.0.1:8000/api/jugadores/1
Accept: application/json
```

Respuesta JSON (campos principales):

```json
{
  "id": 1,
  "nombre": "Juan Román Riquelme",
  "numero_camiseta": 10,
  "posicion": "Mediocampista",
  "nacionalidad": "Argentina",
  "titular": true,
  "fecha_nacimiento": "1978-06-24"
}
```

Laravel también incluye `created_at` y `updated_at` en sus respuestas.

### Ejemplo de creación

```http
POST http://127.0.0.1:8000/api/jugadores
Content-Type: application/json
Accept: application/json
```

```json
{
  "nombre": "Jugador de prueba",
  "numero_camiseta": 99,
  "posicion": "Delantero",
  "nacionalidad": "Argentina",
  "titular": false,
  "fecha_nacimiento": "2000-01-01"
}
```

La creación correcta devuelve `201 Created` y el objeto creado. Si faltan campos
o no cumplen la validación, Laravel devuelve `422 Unprocessable Content` con un
objeto `message` y errores por campo, por ejemplo:

```json
{
  "message": "The nombre field is required.",
  "errors": {
    "nombre": ["The nombre field is required."]
  }
}
```

Un identificador inexistente devuelve HTTP `404 Not Found` con una respuesta
JSON. El texto técnico del mensaje puede variar según el entorno.

## Pruebas del API en Thunder Client

Para cada solicitud de escritura, elegir **Body → JSON** y enviar
`Content-Type: application/json` y `Accept: application/json`. El campo
**Obtenido** registra el código observado al comprobar la API localmente; se
pueden repetir las mismas solicitudes en Thunder Client.

| Método | Endpoint o cuerpo | Código esperado | Código obtenido |
|---|---|---:|---:|
| `GET` | `/api/jugadores` | 200 | 200 |
| `GET` | `/api/jugadores/1` | 200 | 200 |
| `GET` | `/api/jugadores/999999` | 404 | 404 |
| `POST` | `/api/jugadores`, cuerpo completo válido | 201 | 201 |
| `PATCH` | `/api/jugadores/{id}`, `{"numero_camiseta":98}` | 200 | 200 |
| `POST` | `/api/jugadores`, cuerpo inválido `{"nombre":""}` | 422 | 422 |
| `DELETE` | `/api/jugadores/{id}` después de crearla | 200 | 200 |

La comprobación de creación, actualización y eliminación usó un registro
temporal y lo eliminó al terminar. Los códigos de esta tabla corresponden a
peticiones HTTP ejecutadas contra la API local; no se afirma que Thunder Client
se haya ejecutado en esta sesión.

## Informe teórico

### 1. Diferencia entre 404 y 422

`404 Not Found` indica que no existe el recurso solicitado; por ejemplo,
`GET /api/jugadores/999999` busca un jugador inexistente.<br>
`422 Unprocessable Content` indica que la petición llegó, pero sus datos no
superan la validación.<br>
Por ejemplo, crear un jugador sin `nombre` devuelve 422 y un detalle de los
campos inválidos.

### 2. HTTP en redes compartidas y Service Worker

Con HTTP sin cifrar, alguien con acceso a la red podría leer o modificar las
solicitudes, respuestas y datos transmitidos, como perfiles y cambios enviados
a la API.<br>
HTTPS cifra la comunicación y ayuda a verificar el servidor.<br>
Los Service Workers pueden interceptar y responder solicitudes, por lo que los
navegadores los restringen a contextos seguros: HTTPS o localhost para
desarrollo.

### 3. Fetch desde Server Component y CORS

Un `fetch` ejecutado en un Server Component se hace desde el servidor de Next,
no desde el navegador del visitante, por lo que no está sujeto a la política
CORS del navegador.<br>
En este proyecto, el listado y el detalle se consultan desde Server Components;
por eso el origen navegador-API no requiere CORS para esas solicitudes.<br>
CORS podría ser necesario si un Client Component hiciera `fetch` directamente
desde el navegador a una API publicada en un origen distinto.

### 4. Google Play y TWA

Una PWA no necesita publicarse en Google Play: se puede instalar directamente
desde un navegador compatible.<br>
Si se quisiera distribuirla en Play Store en Android, una Trusted Web Activity
(TWA) permitiría presentar el sitio web como una aplicación Android a pantalla
completa.<br>
Una TWA no convierte la PWA en requisito de Play Store; es una alternativa de
distribución que requiere configuración y verificación adicionales.

### 5. Lo más difícil y cómo se resolvió

**Pendiente para completar por la estudiante:** describir qué fue lo más difícil
durante el proyecto y qué pasos propios se siguieron para resolverlo.

## GitHub y seguridad

- El repositorio raíz debe incluir `api/`, `web/` y este `README.md`.
- El `.gitignore` de la raíz excluye entornos, credenciales, `vendor/`,
  `node_modules/` y artefactos de compilación.
- No publicar `.env`, `.env.local`, claves, tokens, `vendor/` ni
  `node_modules/`. Compartir únicamente los archivos de ejemplo de entorno.
- Antes de publicar, revisar que `APP_DEBUG=false` en el servidor de producción
  y configurar HTTPS.
- El análisis de dependencias de npm del 22 de octubre de 2026 encontró un
  advisory de severidad alta para la dependencia transitiva `braces@3.0.3`
  (CVE-2026-93687 / GHSA-vfj7-8cjw-p6xm). No había una versión corregida
  publicada al comprobar el registro. La solución automática sugerida por npm
  implicaba bajar `eslint-config-next` de la versión 16 a la 14; no se aplicó
  una degradación mayor potencialmente incompatible. Revisar el advisory antes
  de desplegar y actualizar cuando haya una solución compatible.
- En producción, la API y el frontend deben publicarse con HTTPS y configurarse
  con sus URLs reales.
- Para publicar el proyecto, crear primero un repositorio GitHub vacío. Luego,
  desde la raíz del proyecto. **Antes de ejecutar esos comandos**, unificar el
  repositorio: `create-next-app` inicializó Git dentro de `web/`, mientras que
  todavía no hay un repositorio en la raíz. No agregar `web/` como un
  repositorio anidado; confirmar primero si se desea eliminar solo el historial
  Git local generado en `web/.git` o conservar/importar ese historial.

```powershell
git init
git add README.md .gitignore api web
git status
git commit -m "Preparar entrega inicial de Boca Players"
git branch -M main
git remote add origin <URL_DEL_REPOSITORIO_GITHUB>
git push -u origin main
```

No ejecutar `git push` hasta revisar el resultado de `git status` y confirmar que
no se incluyan archivos locales, secretos ni carpetas de dependencias.

## Limitaciones y pendientes

- Los jugadores del seeder son ejemplos históricos. Se deben verificar con una
  fuente confiable las camisetas, posiciones, titularidad y fechas antes de
  presentar los datos como definitivos.
- La pantalla offline sirve de respaldo estático; el listado, los perfiles y las
  consultas a Laravel necesitan conectividad.
- Los favoritos se guardan solo en el estado de la sesión de la interfaz; no
  persisten al cerrar o recargar la página.
- No hay autenticación ni autorización: los endpoints CRUD son públicos para
  este prototipo local.
- El análisis de dependencias pendiente se detalla en **GitHub y seguridad**.
- La respuesta personal de la pregunta 5 del informe teórico queda pendiente
  para que la complete la estudiante.

## Despliegue gratuito de la API en Render y conexión con Vercel

La API se empaqueta con Docker usando PHP 8.3, Apache y Laravel 13. Render no
ofrece PHP como runtime nativo, por eso Docker es necesario para alojar esta
API Laravel allí. El archivo `render.yaml` usa el plan Free, sin disco
persistente. Al iniciar, el contenedor copia `api/database/render-seed.db` a
`/tmp/database.sqlite` solo si esa copia temporal no existe, y aplica
migraciones pendientes con `php artisan migrate --force`. La copia inicial ya
contiene los cinco jugadores; no se ejecuta el seeder en cada arranque.

El sistema de archivos de Render Free es temporal: las altas, cambios y bajas
pueden perderse cuando el servicio se reinicia, se duerme o se redepliega.
Cuando la base temporal desaparece, el próximo arranque vuelve a crearla desde
la copia inicial, recuperando los cinco jugadores. Render también puede dormir
el servicio después de 15 minutos sin tráfico y tardar alrededor de un minuto
en despertarlo. Es adecuado para una demostración escolar, no para guardar
cambios ni para producción.

### Configuración visual en Render

1. Revisa los cambios y, cuando decidas autorizarlos, publícalos en el
   repositorio conectado a Render. No incluyas `.env`, credenciales, `vendor/`
   ni `node_modules/`. En este proyecto `autoDeploy` está desactivado, así que
   el cambio en Git no debe iniciar por sí solo un despliegue.
2. En Render, elige **New +** → **Blueprint** y conecta el repositorio. Revisa
   que el servicio `boca-players-api` sea **Free**, use Docker desde `api/` y
   no tenga un disco adjunto. No crees PostgreSQL ni agregues discos.
3. Render solicitará `APP_KEY`, que debe mantenerse como variable secreta.
   Genera una clave nueva desde `api/` con `php artisan key:generate --show`;
   cópiala directamente en Render y no la guardes en el repositorio ni la
   compartas. El Blueprint deja `APP_DEBUG=false` y configura SQLite en
   `/tmp/database.sqlite`.
4. Crea el servicio e inicia su primer despliegue solo cuando estés listo.
   Cuando Render asigne la URL HTTPS, puedes agregarla como `APP_URL` en
   **Environment** (por ejemplo, `https://boca-players-api.onrender.com`) y
   guardar el cambio. No es una credencial.
5. Comprueba `https://<servicio>.onrender.com/up` y espera a que responda.
   Luego abre `https://<servicio>.onrender.com/api/jugadores`; la respuesta
   debe ser HTTP 200 con los cinco registros iniciales.

Si prefieres crear el servicio sin Blueprint: **New +** → **Web Service** →
selecciona el repositorio; configura **Root Directory** como `api`, **Runtime**
como Docker, **Instance Type** como Free y confirma que no haya un disco
adjunto. Agrega las mismas variables de entorno indicadas arriba.

### Conectar Vercel con la API

1. En Vercel, abre el proyecto web y ve a **Settings** → **Environment
   Variables**.
2. Define `NEXT_PUBLIC_API_URL` con
   `https://<servicio>.onrender.com/api` para los entornos que uses
   (Production y, si corresponde, Preview). El archivo `.env.example` conserva
   `http://127.0.0.1:8000/api` como valor para desarrollo local.
3. Guarda el cambio y ejecuta **Redeploy** desde **Deployments**: Next.js
   incorpora `NEXT_PUBLIC_*` al compilar y no toma el nuevo valor de un build
   anterior.
4. Si Render durmió la API, abre primero `/up`, espera a que despierte y vuelve
   a cargar la página de Vercel. Comprueba el listado y una página de detalle.

El listado y el detalle consultan Laravel desde Server Components de Next.js;
esas solicitudes servidor-a-servidor no dependen de CORS del navegador. No
agregues secretos a `NEXT_PUBLIC_*`: su valor es público.

**Advertencia antes de publicar:** las rutas `POST`, `PUT`, `PATCH` y `DELETE`
de esta API no tienen autenticación. Cualquiera que conozca la URL pública
podría modificar o borrar jugadores. No uses esta API con datos sensibles ni
para un servicio real sin acordar e implementar autenticación/autorización.
En el plan gratuito, cualquier edición de jugadores es temporal y volverá a
los cinco registros iniciales después de que se reinicie o duerma el servicio.
