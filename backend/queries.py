def build_where(filters: dict) -> tuple[str, dict]:
    #Construye WHERE dinámico con parámetros seguros
    clauses = []
    params = {}
    
    if filters.get("ciudad"):
        clauses.append("ciudad = $ciudad")
        params["ciudad"] = filters["ciudad"]
    
    if filters.get("categoria"):
        clauses.append("categoria = $categoria")
        params["categoria"] = filters["categoria"]
    
    if filters.get("metodo_pago"):
        clauses.append("metodopago = $metodo")
        params["metodo"] = filters["metodo_pago"]
    
    if filters.get("fecha_inicio") and filters.get("fecha_fin"):
        clauses.append("fecha BETWEEN $fecha_inicio AND $fecha_fin")
        params["fecha_inicio"] = filters["fecha_inicio"]
        params["fecha_fin"] = filters["fecha_fin"]
    
    where_clause = " AND ".join(clauses) if clauses else ""
    return where_clause, params

def get_kpis(filters: dict):
    #Retorna los 6 KPIs obligatorios según los filtros aplicados
    where, params = build_where(filters)
    where_sql = f"WHERE {where}" if where else ""
    
    return f"""
        SELECT 
            COALESCE(SUM(precio), 0) as total_ventas,
            COALESCE(AVG(precio), 0)::INTEGER as promedio_gasto,
            MODE(categoria) as cat_mas_vendida,
            MODE(producto) as prod_mas_vendido,
            MODE(ciudad) as ciudad_mas_compras,
            MODE(metodopago) as metodo_mas_usado
        FROM compras {where_sql}
    """, params

def get_chart_data(chart_type: str, filters: dict):
    #Retorna query según tipo de gráfico.
    where, params = build_where(filters)
    where_sql = f"WHERE {where}" if where else ""
    
    queries = {
        "categoria": f"""
            SELECT categoria, SUM(precio) as total 
            FROM compras {where_sql}
            GROUP BY categoria 
            ORDER BY total DESC
        """,
        
        "ciudad": f"""
            SELECT ciudad, COUNT(*) as cantidad 
            FROM compras {where_sql}
            GROUP BY ciudad 
            ORDER BY cantidad DESC 
            LIMIT 10
        """,
        
        "edad": f"""
            SELECT 
                CASE 
                    WHEN edad BETWEEN 18 AND 25 THEN '18-25'
                    WHEN edad BETWEEN 26 AND 35 THEN '26-35'
                    WHEN edad BETWEEN 36 AND 45 THEN '36-45'
                    WHEN edad BETWEEN 46 AND 60 THEN '46-60'
                    ELSE '60+' 
                END as rango,
                COUNT(*) as cantidad
            FROM compras {where_sql}
            GROUP BY rango 
            ORDER BY rango
        """,
        
        "fecha": f"""
            SELECT fecha, SUM(precio) as ventas 
            FROM compras {where_sql}
            GROUP BY fecha 
            ORDER BY fecha
        """,
        
        "producto": f"""
            SELECT producto, SUM(precio) as total 
            FROM compras {where_sql}
            GROUP BY producto 
            ORDER BY total DESC 
            LIMIT 10
        """,
        
        "metodo_pago": f"""
            SELECT metodopago, COUNT(*) as uso 
            FROM compras {where_sql}
            GROUP BY metodopago 
            ORDER BY uso DESC
        """
    }
    
    return queries.get(chart_type), params