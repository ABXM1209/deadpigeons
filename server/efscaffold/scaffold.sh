#!/bin/bash
# -------------------------------
# Scaffold EF Core from PostgreSQL
# -------------------------------

# تحميل متغيرات البيئة من .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found!"
    exit 1
fi

# تحقق أن متغير DB_CONNECTION_STRING موجود
if [ -z "$DB_CONNECTION_STRING" ]; then
    echo "DbConnectionString is not set in .env"
    exit 1
fi

# Scaffold DbContext
dotnet ef dbcontext scaffold "$DB_CONNECTION_STRING" Npgsql.EntityFrameworkCore.PostgreSQL \
    --output-dir ./Entities \
    --context-dir . \
    --context MyDbContext \
    --no-onconfiguring \
    --namespace efscaffold.Entities \
    --context-namespace Infrastructure.Postgres.Scaffolding \
    --schema deadpigeons \
    --force
