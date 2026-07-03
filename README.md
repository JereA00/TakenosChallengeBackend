# Champions League Draw API - Backend Challenge

## 📋 Descripción General

Este challenge evalúa tu capacidad para **entender, corregir y extender** un sistema backend existente, aplicando buenas prácticas de arquitectura, diseño y calidad de código.

El dominio del problema es el **sorteo de la Champions League en su nuevo formato**, donde 36 equipos participan en una liga única y cada uno juega 8 partidos bajo reglas específicas.

---

## 🧩 Contexto del Dominio

### Reglas del Sorteo

- **36 equipos** participan del torneo
- Cada equipo juega:
  - **8 partidos** en total
  - **4 como local** y **4 como visitante**
- **No puede haber partidos repetidos** entre los mismos equipos
- **Restricciones de país:**
  - Dos equipos del mismo país **NO pueden enfrentarse**
  - Un equipo **NO puede jugar contra más de 2 equipos del mismo país**
- Los partidos se distribuyen en **8 jornadas (match days)**
  - Cada equipo juega **1 partido por jornada**
  - Cada jornada tiene **18 partidos** (36 equipos / 2)

---

## ⚠️ Estado Actual del Proyecto

El proyecto que recibes tiene:

✅ **Implementado:**
- Estructura base con arquitectura de bounded contexts
- Conexión a base de datos (SQLite con Prisma)
- Modelos de datos (Team, Country, Match, Draw)
- Algoritmo de generación de sorteo
- Algunos endpoints REST
- Suite de tests (unitarios e integración)

❌ **Problemas conocidos:**
- El código tiene **bugs intencionales** que debes encontrar y corregir
- Faltan **validaciones importantes**
- Algunos **endpoints no están implementados**
- Los **tests están fallando** (12 tests fallan actualmente)

---

## 🎯 Tareas Obligatorias

### 1. Corregir Bugs Existentes

Debes identificar y corregir los siguientes problemas:

#### 🐛 Bug en DrawService
- El algoritmo permite más de 2 oponentes del mismo país

#### 🐛 Bug en Tipos de Datos
- Hay un problema de tipos en el parámetro `drawId`

#### 🐛 Validaciones Faltantes en CreateDrawService
- No valida si ya existe un sorteo antes de crear uno nuevo

#### 🐛 Manejo de Errores en draw.router.ts
- No maneja correctamente el error 409 (Conflict)

#### 🐛 Validaciones Faltantes en SearchMatchesService
- Faltan validaciones de parámetros de paginación

#### 🐛 Validación de Query Params en matches.router.ts
- Falta usar el schema de validación en el router

### 2. Implementar Endpoints Faltantes

Debes crear los siguientes endpoints que **NO existen** actualmente:

#### DELETE /draw
- Eliminar el sorteo actual
- **Responses:**
  - `200`: Draw eliminado exitosamente
  - `404`: No existe un draw para eliminar
- Debe eliminar en cascada: Draw, DrawTeamPot, Match

#### GET /health
- Health check del servicio
- **Response 200:**
  ```json
  {
    "status": "ok",
    "service": "champions-league-draw-api",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
  ```

### 3. Hacer Pasar Todos los Tests

Actualmente hay **12 tests fallando**:
- 1 test unitario en `draw-assigner.service.test.ts`
- 3 tests unitarios en `search-matches.service.test.ts`
- 4 tests E2E para los nuevos endpoints
- 4 tests E2E de validaciones

**Objetivo:** Todos los tests deben pasar (✅ 100% passing)

---

## 🔧 Funcionalidades Requeridas

### A. Sortear los partidos
- [x] Ejecutar el sorteo completo
- [x] Persistir el resultado
- [ ] **FALTA**: Evitar ejecutar el sorteo más de una vez (respuesta 409)

### B. Obtener partidos
- [x] Calendario general con paginación
- [x] Filtros por equipo y fecha
- [ ] **SUGERIDO**: Agregar filtros adicionales (local/visitante, por país, etc.)

### C. Gestión del sorteo
- [ ] Implementar `DELETE /draw`: Eliminar sorteo actual

### D. Health Check
- [ ] Implementar `GET /health`: Verificar estado del servicio

---

## 🧹 Validaciones y Manejo de Errores

### Implementar:

- [ ] Validación de tipos (usando Zod)
- [ ] Validación de rangos (IDs válidos, matchDays 1-8, paginación, etc.)
- [ ] Validación de reglas de negocio
- [ ] Manejo de errores apropiado en los routers
- [ ] Códigos HTTP apropiados:
  - `200 OK`, `201 Created`
  - `400 Bad Request`, `404 Not Found`, `409 Conflict`
  - `500 Internal Server Error`

### Ejemplos de validaciones faltantes:

- Retornar 409 si ya existe un sorteo antes de crear uno nuevo
- Validar parámetros de paginación en `SearchMatchesService`
- Usar el schema de validación en `matches.router.ts`
- Manejar correctamente el error 409 en `draw.router.ts`

---

## 📈 Arquitectura y Diseño

### Evaluar y mejorar:

- Modularización y separación de responsabilidades
- Principios SOLID
- Bajo acoplamiento entre capas
- Preparación para escalar el sistema
- Decisiones técnicas justificables

---

## 🌟 Mejoras Opcionales (Suma Puntos)

Si quieres destacarte, puedes agregar:

### 📊 Nuevos Endpoints
- `GET /teams` - Listar todos los equipos
- `GET /teams/:id` - Detalle de un equipo con sus partidos
- `GET /matches/:id` - Detalle de un partido específico
- `GET /draw/statistics` - Estadísticas del sorteo

### 🔍 Filtros Adicionales
- Filtrar partidos por rango de jornadas (matchDays)
- Filtrar por país (todos los partidos de equipos de un país)
- Ordenamiento personalizado (por jornada, equipo, etc.)

### 📝 Documentación
- Documentar la API con Swagger/OpenAPI
- Diagrams de arquitectura
- Colección de Postman/Insomnia

### 🧪 Testing
- Aumentar cobertura de tests
- Tests de carga/performance
- Tests de casos edge

---

## ✅ Criterios de Evaluación

| Criterio | Qué evaluamos |
|----------|---------------|
| **Correctitud** | Todos los tests pasan, bugs corregidos, reglas del dominio respetadas |
| **Arquitectura** | Separación de responsabilidades, SOLID, bajo acoplamiento |
| **Código** | Legibilidad, expresividad, consistencia, buenas prácticas |
| **Testing** | Casos relevantes, claridad, cobertura |
| **Mejoras** | Iniciativa, creatividad, valor agregado |

---

## 🚀 Cómo Empezar

### 1. Setup del Proyecto

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Seed de datos iniciales
npx prisma db seed
```

### 2. Ejecutar Tests

```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm test

# Ver cobertura
npm run test:coverage
```

### 3. Ejecutar el Servidor

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

### 4. Verificar el Estado Actual

```bash
# Debe mostrar ~12 tests fallando
npm test

# Debe mostrar 1 test fallando
npm run test:unit
```

---

## 📦 Entregable

### Qué debes entregar:

1. **Código fuente:**
   - Fork o clon del repositorio con tus cambios
   - Commits con mensajes claros y descriptivos
   - Branch `main` o `solution` con la solución final

2. **Documentación (README.md):**
   - Cómo levantar el proyecto
   - Decisiones técnicas tomadas
   - Supuestos realizados
   - Bugs encontrados y cómo los solucionaste
   - Mejoras implementadas (si las hay)

3. **Tests:**
   - Todos los tests existentes deben pasar
   - Nuevos tests para código agregado (deseable)

### Formato de entrega:
- Link a repositorio GitHub/GitLab/Bitbucket

---

## 🧠 Qué Buscamos Evaluar

> No buscamos una solución perfecta.
>
> Buscamos **criterio técnico**, **capacidad de análisis**, **calidad de diseño** y **habilidad para trabajar con código existente**.

### Valoramos especialmente:

- ✅ Capacidad para entender código ajeno
- ✅ Identificación sistemática de problemas
- ✅ Soluciones elegantes y mantenibles
- ✅ Balance entre pragmatismo y calidad
- ✅ Comunicación clara de decisiones técnicas

### NO buscamos:

- ❌ Over-engineering
- ❌ Reescribir todo desde cero
- ❌ Agregar librerías innecesarias
- ❌ Optimizaciones prematuras

---

## 📚 Recursos

### Tecnologías del Proyecto

- **Runtime:** Node.js 18+
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Base de datos:** SQLite
- **Testing:** Vitest + Chai
- **DI Container:** InversifyJS

### Documentación Útil

- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Vitest API](https://vitest.dev/api/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🔒 Archivos de Solo Lectura

- `test/*` - No modificar los tests de integración

---

**¡Éxito con el challenge! 🚀**

---

---

# Solución

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Inicializar la base de datos
npm run db:reset

# 3. Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor queda disponible en `http://localhost:8000`.

> El frontend que consume esta API se encuentra en la carpeta `ucl-frontend/`. Ver su README para instrucciones de setup. Requiere que este backend esté corriendo en el puerto 8000. La entrada principal del frontend es `http://localhost:3000/draw` donde se puede crear, eliminar y visualizar el sorteo.

## Verificar que todo funciona

```bash
# Todos los tests deben pasar (38 E2E + 23 unitarios)
npm test
npm run test:unit
```

---

## Bugs encontrados y corregidos

### Bug 1 — `MAX_COUNTRY_OPPONENTS = 3`
**Archivo:** `src/contexts/draw/domain/application/draw-assigner.service.ts:8`

La regla del dominio establece que un equipo no puede enfrentarse a más de 2 rivales del mismo país. La constante estaba en `3`, lo que permitía sorteos inválidos.

```typescript
// Antes
const MAX_COUNTRY_OPPONENTS = 3;
// Después
const MAX_COUNTRY_OPPONENTS = 2;
```

### Bug 2 — `String(drawId)` convierte el ID a string
**Archivo:** `src/contexts/draw/domain/application/draw-assigner.service.ts:28`

El `drawId` se envolvía con `String()` al llamar a `tryGenerateMatches`, cambiando su tipo de `number` a `string`. Los tests que verifican `match.drawId` fallaban porque `"42" !== 42` en comparación estricta. También se corrigió el tipo del parámetro de `any` a `number`.

```typescript
// Antes
this.tryGenerateMatches(teams, potAssignments, String(drawId));
// Después
this.tryGenerateMatches(teams, potAssignments, drawId);
```

### Bug 3 — Paginación no validada correctamente
**Archivo:** `src/contexts/matches/application/search-matches.service.ts`

El operador `||` reemplazaba el valor `0` con el default porque `0` es falsy, impidiendo que `page = 0` llegara a la validación. Se reemplazó por `??` (nullish coalescing) que solo usa el default cuando el valor es `null` o `undefined`.

```typescript
// Antes
const page = params.page || 1;
const limit = params.limit || 10;

// Después
const page = params.page ?? 1;
const limit = params.limit ?? 10;
if (page < 1) throw new Error("Page must be greater than 0");
const validatedLimit = limit > 100 ? 10 : limit;
```

### Bug 4 — `CreateDrawService` no verifica sorteo existente
**Archivo:** `src/contexts/draw/application/create-draw.service.ts`

El servicio ejecutaba el sorteo sin verificar si ya existía uno. La clase `DrawAlreadyExistsError` estaba definida en el proyecto pero nunca se usaba.

```typescript
// Agregado al inicio de run()
const existing = await this.drawRepository.searchCurrent();
if (existing) throw new DrawAlreadyExistsError();
```

### Bug 5 — Error 409 retornado como 400
**Archivo:** `src/contexts/draw/presentation/draw.router.ts`

El catch del endpoint `POST /draw` devolvía HTTP 400 para cualquier error. El sorteo duplicado debe responder 409 (Conflict). Además el test espera texto plano, no JSON.

```typescript
if (error instanceof DrawAlreadyExistsError) {
  return res.status(409).send("Draw already exists"); // .send() no .json()
}
```

### Bug 6 — Schema Zod definido pero nunca aplicado
**Archivo:** `src/contexts/matches/presentation/matches.router.ts`

`SearchMatchesQuerySchema` existía en el proyecto pero el router lo ignoraba completamente, procesando los query params sin validación ni transformación de tipos.

```typescript
// Antes — sin validación
const { teamId, page } = req.query; // strings sin validar

// Después — con Zod
const parsed = SearchMatchesQuerySchema.safeParse(req.query);
if (!parsed.success) {
  return res.status(400).json({ message: parsed.error.issues[0].message });
  // Nota: Zod v4 usa .issues, no .errors
}
const result = await service.run(parsed.data);
```

---

## Endpoints implementados

### `DELETE /draw`
Nuevo servicio `DeleteDrawService` que verifica la existencia del sorteo antes de eliminarlo. Delega la eliminación en cascada al repositorio mediante `deleteAll()`.

- `200` → sorteo eliminado
- `404` → no existe sorteo

### `GET /health`
Agregado en `routes.ts` como endpoint de infraestructura, fuera de cualquier bounded context. No necesita servicio ni repositorio.

```json
{
  "status": "ok",
  "service": "champions-league-draw-api",
  "timestamp": "2026-07-02T14:00:00.000Z"
}
```

---

## Endpoints extras implementados

### `GET /teams`
Lista los 36 equipos con su país y bombo del sorteo más reciente. Si no hay sorteo, el campo `pot` no aparece.

### `GET /teams/:id`
Devuelve el detalle de un equipo con todos sus partidos.

### `GET /matches/:id`
Devuelve el detalle de un partido por ID.

### Filtro `location` en `GET /matches`
Parámetro opcional `location=home|away`. Solo tiene efecto cuando se combina con `teamId`:
- `?teamId=1&location=home` → solo partidos donde el equipo es local (`homeTeamId = 1`)
- `?teamId=1&location=away` → solo partidos donde el equipo es visitante (`awayTeamId = 1`)
- `?teamId=1` → todos los partidos del equipo (comportamiento original con `OR`)

### Filtro `countryName` en `GET /matches`
Parámetro opcional `countryName=Spain`. Devuelve todos los partidos donde alguno de los dos equipos pertenece a ese país, sin necesidad de especificar un equipo concreto:
- `?countryName=Spain` → todos los partidos de equipos españoles (Real Madrid, Barcelona, Atlético, etc.)
- Compatible con `matchDay`: `?countryName=England&matchDay=3`
- Ignorado si se especifica `teamId` (el filtro por equipo es más específico)

### `GET /draw/statistics`
Estadísticas del sorteo actual: total de partidos, distribución por jornada, por bombo y equipos por bombo.

```json
{
  "drawId": 1,
  "totalMatches": 144,
  "matchesPerMatchDay": { "1": 18, "2": 18, "...": "..." },
  "matchesPerPot": { "1": 72, "2": 72, "3": 72, "4": 72 },
  "teamsPerPot": { "1": 9, "2": 9, "3": 9, "4": 9 }
}
```

---

## Mejoras implementadas

### Backtracking en el algoritmo de sorteo
El algoritmo original usaba un bucle de hasta 500 reintentos aleatorios (*greedy + random restart*). El problema es que puede llegar a un callejón sin salida en la jornada N por decisiones tomadas en jornadas anteriores, y en vez de retroceder al último punto conflictivo, descarta todo el trabajo y empieza de cero. Esto es probabilístico: no garantiza encontrar solución aunque exista, y no puede afirmar definitivamente que una configuración es imposible.

Se reemplazó por un solver CSP con **backtracking real**:
- Cada jornada se resuelve recursivamente (`backtrackMatchDay`)
- Dentro de cada jornada, los emparejamientos se intentan uno a uno (`backtrackPairings`)
- Si un equipo queda sin candidatos válidos, se **deshace** (`undoMatch`) el último emparejamiento asignado y se prueba otro, sin reiniciar desde cero
- Si no existe ninguna solución válida para la configuración dada, se determina de forma definitiva (no por agotamiento de intentos)

Archivo: `src/contexts/draw/domain/application/draw-assigner.service.ts`

### Logging estratégico
Se agregaron logs en los puntos clave del flujo para facilitar el debugging en errores que no son visibles en los responses HTTP:
- `CreateDrawService`: inicio, equipos cargados, guardado exitoso, sorteo duplicado
- `DrawService`: inicio del backtracking, resolución de cada jornada, backtrack cuando ocurre, resultado final o error de configuración imposible
- `SearchMatchesService`: filtros aplicados y parámetros de paginación en cada búsqueda

---

## Decisiones técnicas

### Patrón Repository — interfaz + implementación concreta
Los servicios dependen de interfaces (`DrawRepository`, `MatchRepository`), no de implementaciones concretas. Esto permite testear con mocks y cambiar la base de datos sin tocar la lógica de negocio.

### InversifyJS — inyección de dependencias
Cada nuevo servicio sigue el mismo ciclo de registro: agregar el `Symbol` en `types.ts`, hacer el binding en `container.ts` y registrar el router en `routes.ts`. Saltear cualquiera de los tres pasos produce un error en runtime.

### Zod v4 — `.issues` en lugar de `.errors`
En Zod v4 la propiedad de errores cambió de `.errors` a `.issues`. El código usa `parsed.error.issues[0].message` para acceder al primer mensaje de error.

### `??` en lugar de `||` para defaults
El operador `||` trata `0` como falsy y lo reemplaza por el default. En el contexto de paginación, `page = 0` debe llegar a la validación (y fallar con error), no silenciarse. Se usa `??` que solo aplica el default cuando el valor es `null` o `undefined`.

### `GET /health` en `routes.ts`, no en un router separado
El health check es un endpoint de infraestructura que no pertenece a ningún bounded context del dominio. No tiene sentido darle un servicio ni un repositorio. Va directo en `routes.ts`.

### Cálculo de estadísticas en memoria
`GET /draw/statistics` reutiliza `searchCurrent()` y calcula las métricas iterando los datos ya cargados, sin queries adicionales. Para 144 partidos el impacto es insignificante y mantiene el código simple.

### CORS habilitado para el frontend
Se agregó el middleware `cors` con `origin: "http://localhost:3000"` en `app.ts` para permitir que el frontend (Next.js en puerto 3000) consuma la API desde el navegador. Sin esto el navegador bloquea los requests por Same-Origin Policy.

---

## Supuestos asumidos

- Solo puede existir un sorteo activo. Crear uno cuando ya existe devuelve 409.
- El bombo de `GET /teams` corresponde al sorteo más reciente. Sin sorteo, el campo `pot` se omite.
- Cuando `limit > 100` en la paginación, se usa 10 como valor de fallback (comportamiento que espera el test, no un error).
- `GET /draw/statistics` retorna 404 si no hay sorteo creado.
- El orden de los equipos en los bombos se determina por su ID (tal como estaba en el proyecto original).
