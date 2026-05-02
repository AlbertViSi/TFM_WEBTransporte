Instrucciones levantar base de datos.

1. Crear base de datos y cargar **backup_database.sql**
2. Crear, si es necesario, roles de usuario *admin*, *user*, *moderator* y *node_builder*
3. Crear usuario tipo admin mediante la API en la tabla *users*
4. Crear nodos en la tabla *nodes* con los datos necesarios
5. Crear rutas en la tabla *routes*
6. Crear un orden de nodos en la tabla *route_nodes* (opcional pero recomendado)
7. Logear con el administrador y cambiar la contraseña

Instrucciones levantar API

1. Crear archivo .env con los datos de la base de datos y JWT_SECRET y el encriptado DNI_SECRET
DB_HOST=example
DB_USER=example
DB_PASS=#example
DB_NAME=example
DB_PORT=XXXX
JWT_SECRET=mi_clave_super_secreta_123
DNI_SECRET=mi_clave_super_segura_123