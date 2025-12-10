# TRAVELLING - Caso Práctico de Interfaces de usuario

Este repositorio contiene el código fuente de **Travelling**, un proyecto académico desarrollado para la asignatura de Interfaces de usuario (Curso 2025/2026).

El objetivo principal de esta entrega fue simular una plataforma de agencia de viajes completamente funcional utilizando estándares web nativos, demostrando el dominio de la manipulación del DOM y la persistencia de datos en el cliente.

También, está basado en la heurística de nielsen y lo dado en las clases teóricas de la asignatura.

## Funcionalidades Clave

Lo que hace que este proyecto funcione técnicamente:

* **Arquitectura basada en datos:** El contenido de los destinos no está escrito en el HTML. Se carga dinámicamente desde un archivo `JSON` que actúa como base de datos, lo que permite renderizar las páginas de detalle utilizando una única plantilla reutilizable.
* **Persistencia de datos (Simulación de Backend):** El sistema de registro, inicio de sesión, edición de perfil y reservas funciona realmente. Utilizamos `localStorage` y `sessionStorage` para guardar usuarios, sesiones y el historial de compras, de modo que los datos se mantienen aunque cierres el navegador.
* **Internacionalización (i18n):** La web cuenta con un sistema propio de traducción (Español/Inglés) que actualiza toda la interfaz en tiempo real sin recargar la página.
* **Buscador en tiempo real:** Un algoritmo de filtrado que busca coincidencias en el JSON local para ofrecer resultados instantáneos.

## Tecnologías Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript**

## Estructura del Proyecto

* `/script`: Contiene toda la lógica JavaScript dividida por módulos (auth, buscador, renderizado).
* `/style`: Hojas de estilo CSS organizadas por componentes.
* `ciudades-del-mundo.json`: Archivo que contiene toda la información de los destinos.
* `/images`: Imágenes para el readme.md
* Archivos `.html`: Vistas principales de la navegación.

---

## Showcase del proyecto
![Local image](./images/image1.png)
