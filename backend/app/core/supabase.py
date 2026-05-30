import httpx
from typing import Any

from app.core.config import settings


class SupabaseClient:
    def __init__(self, api_key: str, jwt_token: str | None = None):
        self.api_key = api_key
        self.headers = {
            "apikey": api_key,
            "Content-Type": "application/json",
        }
        if jwt_token:
            self.headers["Authorization"] = f"Bearer {jwt_token}"

    @property
    def _rest_headers(self) -> dict[str, str]:
        return {
            **self.headers,
            "Prefer": "return=representation",
        }

    def table(self, table: str) -> "TableQuery":
        return TableQuery(self, table)

    def rpc(self, func: str, params: dict[str, Any] | None = None) -> httpx.Response:
        url = f"{settings.SUPABASE_URL}/rest/v1/rpc/{func}"
        with httpx.Client() as client:
            return client.post(url, headers=self.headers, json=params or {})


class TableQuery:
    def __init__(self, client: SupabaseClient, table: str):
        self.client = client
        self.table = table
        self._select = "*"
        self._filters: list[tuple[str, str, Any]] = []
        self._order: str | None = None
        self._limit: int | None = None
        self._range: tuple[int, int] | None = None

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

    def gt(self, column: str, value: Any) -> "TableQuery":
        self._filters.append(("gt", column, value))
        return self

    def lt(self, column: str, value: Any) -> "TableQuery":
        self._filters.append(("lt", column, value))
        return self

    def gte(self, column: str, value: Any) -> "TableQuery":
        self._filters.append(("gte", column, value))
        return self

    def lte(self, column: str, value: Any) -> "TableQuery":
        self._filters.append(("lte", column, value))
        return self

    def order(self, column: str, ascending: bool = True) -> "TableQuery":
        self._order = f"{column}.{'asc' if ascending else 'desc'}"
        return self

    def limit(self, count: int) -> "TableQuery":
        self._limit = count
        return self

    def range(self, start: int, end: int) -> "TableQuery":
        self._range = (start, end)
        return self

    def _build_url(self) -> str:
        url = f"{settings.SUPABASE_URL}/rest/v1/{self.table}?select={self._select}"
        for op, col, val in self._filters:
            if op == "in":
                vals = ",".join(str(v) for v in val)
                url += f"&{col}=in.({vals})"
            else:
                url += f"&{col}={op}.{val}"
        if self._order:
            url += f"&order={self._order}"
        if self._limit:
            url += f"&limit={self._limit}"
        if self._range:
            url += f"&offset={self._range[0]}&limit={self._range[1] - self._range[0]}"
        return url

    def execute(self) -> list[dict[str, Any]]:
        url = self._build_url()
        with httpx.Client() as client:
            resp = client.get(url, headers=self.client._rest_headers)
            resp.raise_for_status()
            return resp.json()

    def execute_single(self) -> dict[str, Any] | None:
        rows = self.limit(1).execute()
        return rows[0] if rows else None

    def insert(self, data: dict[str, Any] | list[dict[str, Any]]) -> list[dict[str, Any]]:
        url = f"{settings.SUPABASE_URL}/rest/v1/{self.table}"
        with httpx.Client() as client:
            resp = client.post(url, headers=self.client._rest_headers, json=data)
            resp.raise_for_status()
            return resp.json()

    def update(self, data: dict[str, Any]) -> list[dict[str, Any]]:
        url = self._build_url().split("?")[0]
        params = self._build_url().split("?", 1)[1] if "?" in self._build_url() else ""
        full_url = f"{url}?{params}" if params else url
        with httpx.Client() as client:
            resp = client.patch(full_url, headers=self.client._rest_headers, json=data)
            resp.raise_for_status()
            return resp.json()

    def upsert(self, data: dict[str, Any], on_conflict: str | None = None) -> list[dict[str, Any]]:
        headers = {**self.client._rest_headers, "Prefer": "resolution=merge-duplicates,return=representation"}
        if on_conflict:
            headers["Prefer"] = f"resolution=merge-duplicates,return=representation,on_conflict={on_conflict}"
        url = f"{settings.SUPABASE_URL}/rest/v1/{self.table}"
        with httpx.Client() as client:
            resp = client.post(url, headers=headers, json=data)
            resp.raise_for_status()
            return resp.json()

    def delete(self) -> list[dict[str, Any]]:
        url = self._build_url()
        with httpx.Client() as client:
            resp = client.delete(url, headers=self.client._rest_headers)
            resp.raise_for_status()
            return resp.json()


supabase_admin = SupabaseClient(settings.effective_service_key)


def get_supabase_client(jwt_token: str) -> SupabaseClient:
    return SupabaseClient(settings.SUPABASE_ANON_KEY, jwt_token)
