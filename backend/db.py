import duckdb # type: ignore
import os
import threading
from pathlib import Path

# Definir las rutas para la base de datos y el archivo CSV
DB_Path = Path(__file__).parent.parent / "data" / "compras.duckdb"
CSV_Path = Path(__file__).parent.parent / "data" / "compras.csv"

class DuckDBConnectionProxy:
    def __init__(self):
        self._conn = None

    def _get_conn(self):
        if self._conn is None:
            try:
                self._conn = duckdb.connect(str(DB_Path))
            except duckdb.IOException as e:
                import sys
                print("\n" + "="*80)
                print(" ERROR CRÍTICO: No se pudo abrir la base de datos DuckDB.")
                print("El archivo 'data/compras.duckdb' está bloqueado por otro proceso.")
                print("Esto ocurre cuando hay un proceso zombie de Python corriendo en segundo plano")
                print("o si tienes la base de datos abierta en un visor externo (como DBeaver).")
                print("\n Para solucionarlo en Windows (PowerShell), ejecuta:")
                print("   Get-Process python | Stop-Process -Force")
                print("="*80 + "\n")
                sys.exit(1)
        return self._conn

    def execute(self, *args, **kwargs):
        return self._get_conn().execute(*args, **kwargs)

    def close(self, *args, **kwargs):
        if self._conn is not None:
            self._conn.close()
            self._conn = None

conexion = DuckDBConnectionProxy()
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
