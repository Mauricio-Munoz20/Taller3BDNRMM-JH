# Taller3BDNR-MM-JH

Proyecto de análisis de compras compuesto por una API en FastAPI (`backend`) y un frontend en React con Vite (`frontend`).

Autores:
- Mauricio Muñoz (mauricio.munoz01@alumnos.ucn.cl - 21.542.213-5)
- Julian Honores (julian.honores@alumnos.ucn.cl - 21.328.088-0)


## Estructura del proyecto

```
Taller3BDNR-MM/
├── backend/
│   ├── db.py
│   ├── main.py
│   ├── queries.py
│   └── requirements.txt
├── data/
│   ├── compras.csv #Ignorado
│   └── compras.duckdb
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── vite.config.js
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       └── components/
│           ├── Charts.jsx
│           ├── Filters.jsx
│           └── KPIs.jsx
└── venv/
```

## Descripción de carpetas

### `backend/`
Contiene la API de FastAPI y la lógica de acceso a datos.

- `main.py`: punto de entrada de la aplicación FastAPI.
- `db.py`: establece la conexión DuckDB y carga el CSV si la tabla no existe.
- `queries.py`: construye las consultas SQL para KPIs y datos de gráficos.
- `requirements.txt`: dependencias de Python necesarias para ejecutar el backend.

### `data/`
Contiene los datos del proyecto.

- `compras.csv`: datos de compras originales.
- `compras.duckdb`: base DuckDB generada a partir del CSV.

### `frontend/`
Contiene el frontend de React con Vite.

- `index.html`: plantilla principal de Vite.
- `package.json`: dependencias y scripts del frontend.
- `vite.config.js`: configuración de Vite (servidor, proxy, puerto).
- `src/`: código fuente de React.
  - `App.jsx`: componente principal que consume la API.
  - `App.css`: estilos globales y específicas de la UI.
  - `components/`: componentes reutilizables para filtros, KPIs y gráficos.

### `venv/`
Entorno virtual de Python para el backend.

- Contiene los paquetes de Python instalados localmente para el proyecto.
- No es necesario tocar nada dentro de esta carpeta, solo activar el entorno antes de ejecutar el backend.

## Requisitos previos

1. **Python 3.11+**
2. **Node.js 18+**
3. **pnpm** (recomendado) o **npm**

Si no tienes `pnpm`, puedes instalarlo con:

```bash
npm install -g pnpm
```

## Ejecutar el backend

1. Abre una terminal y ve al directorio raíz del proyecto:

```bash
cd Dirección carpeta 
```

2. Si no tienes creado el entorno virtual, créalo y actívalo. El `venv` no se activa por sí solo:

Crear el entorno (Windows PowerShell):

```powershell
python -m venv venv
```

Activar el entorno (PowerShell):

```powershell
.\venv\Scripts\Activate.ps1
```

Activar el entorno (cmd.exe):

```cmd
.\venv\Scripts\activate.bat
```

Instalar dependencias:

```powershell
pip install -r backend/requirements.txt
```

3. Ejecuta el backend:

```powershell
python backend/main.py
```

4. El backend quedará escuchando en `http://127.0.0.1:8000`.

> Si `compras.duckdb` no está creada, el backend importará `data/compras.csv` automáticamente.

## Ejecutar el frontend

1. Abre otra terminal nueva.
2. Ve al directorio `frontend`:

```bash
cd Dirección carpeta\frontend
```

3. Instala dependencias si no lo has hecho:

```bash
pnpm install
```

Si no tienes `pnpm`, puedes usar:

```bash
npm install
```

4. Inicia el servidor de desarrollo:

```bash
pnpm run dev
```

O con npm:

```bash
npm run dev
```

5. Abre el navegador en `http://127.0.0.1:3005`.

## Notas importantes

- El backend debe estar ejecutándose antes de abrir el frontend para que éste pueda consumir la API.
- **¿Por qué se usa el puerto 3005 por defecto?** En sistemas Windows, el puerto `3000` suele ser ocupado o restringido por servicios internos del sistema (como Hyper-V o WSL2). El proyecto está preconfigurado en `vite.config.js` para iniciar directamente en el puerto `3005` y evitar cualquier conflicto.
- Si por algún motivo deseas cambiarlo, puedes hacerlo modificando el valor `port` en `frontend/vite.config.js`.
- Si tu frontend no carga, confirma que `frontend/index.html` y `frontend/src/main.jsx` existan en la estructura del proyecto.

---

Con esto tendrás la documentación necesaria para entender la estructura y ejecutar el proyecto correctamente.
