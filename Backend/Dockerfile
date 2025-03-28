# # Etapa 1: Build da aplicação
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /app
# COPY . ./ 
# RUN dotnet restore
# RUN dotnet publish -c Release -o /out

# # Etapa 2: Aplicar migrations (rodando o comando dotnet ef database update)
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS migrate
# WORKDIR /app
# COPY --from=build /app ./ 
# RUN dotnet ef database update --no-build --environment Development

# # Etapa 3: Runtime (após as migrations)
# FROM mcr.microsoft.com/dotnet/aspnet:8.0
# WORKDIR /app
# COPY --from=build /out ./ 

# # Expõe a porta 8080 para o backend
# EXPOSE 8080
# EXPOSE 5001

# CMD ["dotnet", "Backend.dll"]
# Etapa 1: Build da aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . ./ 
RUN dotnet restore
RUN dotnet publish -c Release -o /out

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out ./ 

# Expõe a porta que o ASP.NET Core usa por padrão
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

CMD ["dotnet", "Backend.dll"]