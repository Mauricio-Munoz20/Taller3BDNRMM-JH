import duckdb # type: ignore
import os
import threading
from pathlib import Path

# Definir las rutas para la base de datos y el archivo CSV
DB_Path = Path(__file__).parent.parent / "data" / "compras.duckdb"
CSV_Path = Path(__file__).parent.parent / "data" / "compras.csv"

# Verificar si el archivo de la base de datos existe, si no, crearlo e importar los datos desde el CSV
conexion = duckdb.connect(str(DB_Path))
db_lock = threading.Lock()

def importar_csv():
    """Importa CSV solo si la tabla no existe."""
    # Verificar si la tabla ya existe
    existe = conexion.execute("""
        SELECT COUNT(*) FROM duckdb_tables() 
        WHERE table_name = 'compras'
    """).fetchone()[0]
    
    if existe == 0:
        print(" Importando 5M filas... (toma ~5-10s)")
        conexion.execute("""
            CREATE TABLE compras AS
            SELECT * FROM read_csv_auto(?, 
                types={
                    'usuarioid': 'BIGINT',
                    'edad': 'INTEGER',
                    'ciudad': 'VARCHAR',
                    'producto': 'VARCHAR',
                    'categoria': 'VARCHAR',
                    'precio': 'INTEGER',
                    'fecha': 'DATE',
                    'hora': 'TIME',
                    'metodopago': 'VARCHAR'
                },
                auto_detect=True)
        """, [str(CSV_Path)])
        print(" Importación completada.")
        
        # Validar conteo
        total = conexion.execute("SELECT COUNT(*) FROM compras").fetchone()[0]
        print(f"[OK] Total de registros: {total:,}")
    else:
        total = conexion.execute("SELECT COUNT(*) FROM compras").fetchone()[0]
        print(f"[OK] Base ya poblada con {total:,} registros.")
