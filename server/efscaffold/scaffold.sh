#!/bin/bash
# -------------------------------
# Scaffold EF Core from PostgreSQL
# -------------------------------

# Downloads the environmental variables from .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo ".env file not found!"
    exit 1
fi

# check if DB_CONNECTION_STRING variable is there
if [ -z "$DB_CONNECTION_STRING" ]; then
    echo "DbConnectionString is not set in .env"
    exit 1
fi

# Scaffold DbContext
dotnet tool install -g dotnet-ef
dotnet ef dbcontext scaffold "$DB_CONNECTION_STRING" Npgsql.EntityFrameworkCore.PostgreSQL \
    --output-dir ./Entities \
    --context-dir . \
    --context MyDbContext \
    --no-onconfiguring \
    --namespace efscaffold.Entities \
    --context-namespace Infrastructure.Postgres.Scaffolding \
    --schema deadpigeons \
    --force
