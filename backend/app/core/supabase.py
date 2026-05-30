import json
from typing import Any

from app.core.database import get_conn


def _row_to_dict(row) -> dict[str, Any]:
    return dict(row) if row else None


class SupabaseClient:
    def __init__(self, api_key: str = "", jwt_token: str | None = None):
        pass

    def table(self, table: str) -> "TableQuery":
        return TableQuery(table)


class TableQuery:
    def __init__(self, table: str):
        self.table_name = table
        self._select = "*"
        self._filters: list[tuple[str, str, Any]] = []
        self._order_col: str | None = None
        self._order_asc: bool = True
        self._limit_val: int | None = None
        self._offset_val: int | None = None

    def select(self, columns: str = "*") -> "TableQuery":
        self._select = columns
        return self

    def eq(self, column: str, value: Any) -> "TableQuery":
        self._filters.append(("eq", column, value))
        return self

    def in_(self, column: str, values: list[Any]) -> "TableQuery":
        self._filters.append(("in", column, values))
        return self

    def neq(self, column: str, value: Any) -> "TableQuery":
        self._filters.append(("neq", column, value))
        return self

    def order(self, column: str, ascending: bool = True) -> "TableQuery":
        self._order_col = column
        self._order_asc = ascending
        return self

    def limit(self, count: int) -> "TableQuery":
        self._limit_val = count
        return self

    def range(self, start: int, end: int) -> "TableQuery":
        self._offset_val = start
        self._limit_val = end - start
        return self

    def _build_sql(self) -> tuple[str, list[Any]]:
        cols = ", ".join(f'"{c.strip()}"' for c in self._select.split(",")) if self._select != "*" else "*"
        sql = f'SELECT {cols} FROM "{self.table_name}"'
        params: list[Any] = []
        where_parts: list[str] = []
        for op, col, val in self._filters:
            if op == "eq":
                where_parts.append(f'"{col}" = ?'); params.append(val)
            elif op == "neq":
                where_parts.append(f'"{col}" != ?'); params.append(val)
            elif op == "in":
                if not val:
                    where_parts.append("1=0")
                else:
                    placeholders = ", ".join("?" for _ in val)
                    where_parts.append(f'"{col}" IN ({placeholders})')
                    params.extend(val)
        if where_parts:
            sql += " WHERE " + " AND ".join(where_parts)
        if self._order_col:
            sql += f' ORDER BY "{self._order_col}" {"ASC" if self._order_asc else "DESC"}'
        if self._limit_val is not None:
            sql += f" LIMIT {self._limit_val}"
        if self._offset_val is not None:
            sql += f" OFFSET {self._offset_val}"
        return sql, params

    JSON_FIELDS = {"content", "options", "answers"}

    def _parse_row(self, row: dict[str, Any]) -> dict[str, Any]:
        result = {}
        for k, v in row.items():
            if v is not None and k in self.JSON_FIELDS and isinstance(v, str):
                try:
                    result[k] = json.loads(v)
                except (json.JSONDecodeError, TypeError):
                    result[k] = v
            else:
                result[k] = v
        return result

    def execute(self) -> list[dict[str, Any]]:
        conn = get_conn()
        try:
            sql, params = self._build_sql()
            return [self._parse_row(dict(r)) for r in conn.execute(sql, params).fetchall()]
        finally:
            conn.close()

    def execute_single(self) -> dict[str, Any] | None:
        self._limit_val = 1
        rows = self.execute()
        return rows[0] if rows else None

    def _serialize(self, item: dict[str, Any]) -> dict[str, Any]:
        result = {}
        for k, v in item.items():
            if isinstance(v, (dict, list)):
                result[k] = json.dumps(v)
            else:
                result[k] = v
        return result

    def insert(self, data: dict[str, Any] | list[dict[str, Any]]) -> list[dict[str, Any]]:
        conn = get_conn()
        try:
            items = data if isinstance(data, list) else [data]
            for item in items:
                item = self._serialize(item)
                cols = ", ".join(f'"{k}"' for k in item.keys())
                placeholders = ", ".join("?" for _ in item)
                conn.execute(
                    f'INSERT INTO "{self.table_name}" ({cols}) VALUES ({placeholders})',
                    list(item.values()),
                )
            conn.commit()
            return items
        finally:
            conn.close()

    def update(self, data: dict[str, Any]) -> list[dict[str, Any]]:
        conn = get_conn()
        try:
            data = self._serialize(data)
            sql, params = self._build_sql()
            where_clause = sql.split("WHERE", 1)[1] if "WHERE" in sql else "1=1"
            set_clause = ", ".join(f'"{k}" = ?' for k in data.keys())
            conn.execute(
                f'UPDATE "{self.table_name}" SET {set_clause} WHERE {where_clause}',
                list(data.values()) + params,
            )
            conn.commit()
            select_sql = f'SELECT {self._select} FROM "{self.table_name}" WHERE {where_clause}'
            return [dict(r) for r in conn.execute(select_sql, params).fetchall()]
        finally:
            conn.close()

    def upsert(self, data: dict[str, Any], on_conflict: str | None = None) -> list[dict[str, Any]]:
        conn = get_conn()
        try:
            data = self._serialize(data)
            cols = ", ".join(f'"{k}"' for k in data.keys())
            placeholders = ", ".join("?" for _ in data)
            values = list(data.values())
            if on_conflict:
                conflict_cols = ", ".join(f'"{c.strip()}"' for c in on_conflict.split(","))
                updates = ", ".join(f'"{k}" = excluded."{k}"' for k in data.keys())
                sql = f'INSERT INTO "{self.table_name}" ({cols}) VALUES ({placeholders}) ON CONFLICT({conflict_cols}) DO UPDATE SET {updates}'
            else:
                sql = f'INSERT INTO "{self.table_name}" ({cols}) VALUES ({placeholders})'
            conn.execute(sql, values)
            conn.commit()
            return [data]
        finally:
            conn.close()

    def delete(self) -> list[dict[str, Any]]:
        conn = get_conn()
        try:
            rows = self.execute()
            sql, params = self._build_sql()
            where_clause = sql.split("WHERE", 1)[1] if "WHERE" in sql else "1=1"
            conn.execute(f'DELETE FROM "{self.table_name}" WHERE {where_clause}', params)
            conn.commit()
            return rows
        finally:
            conn.close()


supabase_admin = SupabaseClient()


def get_supabase_client(jwt_token: str) -> SupabaseClient:
    return SupabaseClient("", jwt_token)
