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