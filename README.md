# 🌱☕ Ruta Ecológica para Transporte de Pulpa de Café

## 📌 Problemática

La pulpa de café es el residuo orgánico que queda al despulpar el grano, y es **altamente
perecedera**: comienza a fermentarse y descomponerse pocas horas después de generarse en la
finca. Entre una finca cafetera y una planta de procesamiento suelen existir **varias vías
posibles**, y hoy esa elección se hace de forma empírica ("por experiencia sé que esa vía es
mala"), sin considerar de manera objetiva factores como el clima, el estado real de la carretera
o las emisiones generadas en el trayecto.

Esto genera tres problemas concretos:

- **Pérdida de producto**: si la ruta elegida toma demasiado tiempo o atraviesa condiciones de
  calor/humedad altas, la pulpa se fermenta antes de llegar, perdiendo valor o volviéndose
  inutilizable.
- **Mayor huella ambiental**: una vía en mal estado implica más frenados, aceleraciones y consumo
  de combustible, aumentando las emisiones de CO₂ del transporte.
- **Decisiones no repetibles**: cada conductor o transportista decide "a ojo", sin un criterio
  estandarizado que pueda auditarse o mejorarse con datos.

**La aplicación resuelve esto automatizando la decisión**: dado un origen (finca) y un destino
(planta), calcula varias rutas reales alternativas y las evalúa por distancia, tiempo, clima,
altitud y estado de la vía, combinando todo en un puntaje ecológico objetivo — reemplazando la
intuición por un cálculo repetible y explicable.

## 📸 Capturas de pantalla

### 1. Selección de origen y destino en el mapa

![alt text](<Captura de pantalla 2026-07-29 222041.png>)

El punto de partida de la aplicación: un mapa interactivo donde el usuario marca la **finca**
(primer clic) y la **planta de procesamiento** (segundo clic). En este ejemplo ya se calcularon
las rutas entre Guayaquil y Riobamba: se ven **las dos rutas alternativas dibujadas al mismo
tiempo** — la recomendada en **verde y más gruesa** (Ruta 1, vía Calle Rural) y la alternativa en
**naranja** (Ruta 2, vía Panamericana Sur). Debajo del mapa, la leyenda con botones permite
seleccionar cualquiera de las dos directamente, y las coordenadas exactas de origen/destino
quedan visibles al final.

### 2. Resultado de la evaluación

![alt text](<Captura de pantalla 2026-07-29 222114.png>)

Apenas termina el cálculo, se muestra de inmediato la tarjeta de la **ruta recomendada** (marcada
con 🏆), con sus indicadores principales: distancia, duración, clima del trayecto (temperatura y
humedad promedio) y las emisiones de CO₂ estimadas. La etiqueta verde **BUENO** indica el estado
inferido de la vía.

Ademas aquí se ve la tarjeta de la ruta recomendada ya completa (incluyendo altitud promedio y riesgo de
deterioro de la pulpa), y justo debajo el **selector de criterios individuales**: además del
puntaje ecológico combinado, el usuario puede pedir directamente cuál ruta es mejor por
**menor distancia**, **menor tiempo**, **menor CO₂** o **menor riesgo** — sin volver a calcular
nada, ya que todos los indicadores de todas las rutas viajaron en la respuesta original. Al
elegir un criterio, la ruta ganadora de ese parámetro se resalta también en el mapa.

### 4. Panel comparativo de rutas

![alt text](<Captura de pantalla 2026-07-29 222136.png>)

La tabla comparativa reúne **todas** las rutas evaluadas en una sola vista, columna por columna:
distancia, duración, altitud promedio, CO₂, riesgo de deterioro, estado de la vía y el puntaje
ecológico final. Cualquier fila es clicable para verla en detalle (nótese el aviso "Seleccionada
manualmente" en la tarjeta de abajo, que indica que la ruta activa no fue elegida por ningún
criterio predefinido sino por un clic directo en la fila o en el mapa).

### 5. Detalle de todas las rutas evaluadas

![alt text](<Captura de pantalla 2026-07-29 222146.png>)

Al final de la página, cada ruta evaluada se muestra como una tarjeta independiente con todos sus
indicadores completos — útil para comparar en detalle sin tener que interpretar solo la tabla
resumida. La ruta recomendada mantiene su borde e ícono 🏆 distintivo incluso aquí, para que
siempre quede claro cuál ganó el puntaje ecológico combinado, sin importar qué tan abajo se
desplace la página.
