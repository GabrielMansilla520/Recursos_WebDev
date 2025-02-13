function ListaRecursos({ recursos }) {
  const [terminoBusqueda, establecerTerminoBusqueda] = React.useState('');
  const [recursosFiltrados, establecerRecursosFiltrados] = React.useState(recursos);
  const [filtros, establecerFiltros] = React.useState([]);
  const [mostrarFiltros, establecerMostrarFiltros] = React.useState(false);
  const [paginaFiltros, establecerPaginaFiltros] = React.useState(0);
  const filtrosPorPagina = 5;

  React.useEffect(() => {
    const fuse = new Fuse(recursos, {
      keys: ['titulo', 'tags'],
      includeScore: true,
      threshold: 0.3,
    });

    let resultados = terminoBusqueda ? fuse.search(terminoBusqueda).map(result => result.item) : recursos;

    if (filtros.length > 0) {
      resultados = resultados.filter(recurso => filtros.every(filtro => recurso.tags && recurso.tags.includes(filtro)));
    }

    establecerRecursosFiltrados(resultados);
  }, [terminoBusqueda, recursos, filtros]);

  const toggleFiltro = (tag) => {
    if (filtros.includes(tag)) {
      establecerFiltros(filtros.filter(filtro => filtro !== tag));
    } else {
      establecerFiltros([...filtros, tag]);
    }
  };

  const tagsUnicos = [...new Set(recursos.reduce((acc, recurso) => acc.concat(recurso.tags || []), []))];

  const alternarMostrarFiltros = () => {
    establecerMostrarFiltros(!mostrarFiltros);
    establecerPaginaFiltros(0);
  };

  const totalPaginasFiltros = Math.ceil(tagsUnicos.length / filtrosPorPagina);

  const siguientePagina = () => {
    establecerPaginaFiltros(paginaFiltros + 1);
  };

  const paginaAnterior = () => {
    establecerPaginaFiltros(paginaFiltros - 1);
  };

  const filtrosPaginaActual = tagsUnicos.slice(paginaFiltros * filtrosPorPagina, (paginaFiltros + 1) * filtrosPorPagina);

  return (
    <div className="fade-in">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Buscar recursos..."
          className="w-full p-2 mr-2 text-gray-900 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          onChange={(e) => establecerTerminoBusqueda(e.target.value)}
        />
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
          onClick={alternarMostrarFiltros}
        >
          Filtrar
        </button>
      </div>
      {mostrarFiltros && (
        <div className="overlay">
          <div className="filter-popup">
            <h3>Filtrar por categoría</h3>
            <div className="filter-container">
              {filtrosPaginaActual.map((tag, tagIndex) => (
                <button
                  key={tagIndex}
                  className={`filter-button ${filtros.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleFiltro(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="pagination">
              {paginaFiltros > 0 && (
                <button className="page-button" onClick={paginaAnterior}>
                  &laquo; Anterior
                </button>
              )}
              {paginaFiltros < totalPaginasFiltros - 1 && (
                <button className="page-button" onClick={siguientePagina}>
                  Siguiente &raquo;
                </button>
              )}
            </div>
            <button className="close-button" onClick={() => establecerMostrarFiltros(false)}>Cerrar</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recursosFiltrados.map((recurso, index) => (
          <div key={index} className="card animate__animated animate__fadeInUp">
            <a href={recurso.href} target="_blank" rel="noopener noreferrer">
              <h3 className="text-lg font-semibold text-purple-400 hover:text-purple-300">{recurso.titulo}</h3>
            </a>
            {recurso.tags && recurso.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="resource-tag">{tag}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ListaPublicaciones() {
  const publicacionesData = [
  ];

  return (
    <div className="fade-in">
      {publicacionesData.map((publicacion, index) => (
        <div key={index} className="card animate__animated animate__fadeInUp">
          <a href={publicacion.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
            <h3 className="text-lg font-semibold">{publicacion.nombre}</h3>
          </a>
          <p>{publicacion.descripcion}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [recursoData, establecerRecursoData] = React.useState([]);

  React.useEffect(() => {
    fetchRecursos()
      .then(data => {
        establecerRecursoData(data);
      })
      .catch(error => {
        console.error("Error buscando recursos:", error);
        establecerRecursoData([
          { href: "https://www.classcentral.com/report/free-developer-it-certifications/?ref=dailydev", titulo: "900+ Certificaciones gratuitas para desarrolladores y profesionales de TI", tags: ["gratis", "certificaciones"] },
          { href: "https://dev.to/hanzla-baig/150-free-apis-every-developer-needs-to-know-m9j?ref=dailydev", titulo: "Más de 150 APIs GRATUITAS que todo desarrollador necesita conocer", tags: ["api", "desarrollo"] },
          { href: "https://css-loaders.com/", titulo: "CSS Loaders: Una colección de más de 600 animaciones de carga", tags: ["css", "animación"] },
          { href: "https://www.freepublicapis.com/?ref=dailydev", titulo: "APIs Públicas Gratuitas", tags: ["api", "gratis"] },
          { href: "https://www.freepublicapis.com/eva-email-verification", titulo: "Verificación de correo electrónico EVA", tags: ["api", "correo electrónico"] },
          { href: "https://dev.to/hanzla-mirza/100-free-apis-every-developer-should-know-in-2024-1bdk?ref=dailydev", titulo: "APIs 100% gratuitas que todo desarrollador debería conocer en 2024", tags: ["api", "gratis"] },
          { href: "https://uiverse.io/elements?ref=dailydev", titulo: "5214 elementos de la UI: CSS & Tailwind", tags: ["ui", "css", "tailwind"] },
          { href: "https://blog.bytebytego.com/p/ep128-the-ultimate-software-architect?ref=dailydev", titulo: "El mapa de conocimiento definitivo del arquitecto de software", tags: ["arquitectura", "software"] },
          { href: "https://medium.com/javarevisited/6-best-resources-for-tech-interview-preparation-in-2024-d06f11ada15c", titulo: "6 Mejores recursos para la preparación de entrevistas técnicas en 2024", tags: ["entrevista", "técnica"] },
          { href: "https://medium.com/javarevisited/5-javascript-concepts-every-developer-should-know-61111b00349a?ref=dailydev", titulo: "5 Conceptos de JavaScript que todo desarrollador debería conocer", tags: ["javascript", "conceptos"] },
          { href: "https://www.classcentral.com/report/free-developer-it-certifications/?ref=dailydev", titulo: "900+ Certificaciones gratuitas para desarrolladores y profesionales de TI", tags: ["gratis", "certificaciones"] },
          { href: "https://dev.to/buildwebcrumbs/creating-a-personal-brand-how-to-sell-yourself-as-a-developer-52po?ref=dailydev", titulo: "Creando una marca personal: Cómo venderte como desarrollador", tags: ["personal", "marca"] },
          { href: "https://techcrunch.com/2024/08/11/a-not-quite-definitive-guide-to-open-source-alternative-software/?ref=dailydev", titulo: "Herramientas de código abierto para impulsar tu productividad", tags: ["código abierto", "herramientas"] },
          { href: "https://developer20.com/go-libs-i-dont-use/?ref=dailydev", titulo: "Librerías de Go que no uso pero son populares", tags: ["go", "librerías"] },
          { href: "https://blog.bytebytego.com/p/ep130-design-a-system-like-youtube?ref=dailydev", titulo: "Diseñando un sistema como YouTube", tags: ["arquitectura", "youtube"] },
          { href: "https://newsletter.systemdesigncodex.com/p/database-sharding?ref=dailydev", titulo: "Particionamiento de bases de datos", tags: ["base de datos", "diseño de sistemas"] },
          { href: "https://proton.me/blog/drive-open-source?ref=dailydev", titulo: "Todas las apps de Proton Drive ahora son de código abierto", tags: ["código abierto", "almacenamiento"] },
          { href: "https://app.daily.dev/posts/you-get-paid-based-on-the-level-of-abstraction-you-can-work-at--soryhdhti", titulo: "Te pagan según el nivel de abstracción en el que puedes trabajar", tags: ["desarrollo", "carrera"] },
          { href: "https://uiverse.io/", titulo: "Uiverse | La biblioteca más grande de elementos de la UI de código abierto", tags: ["ui", "código abierto"] },
          { href: "https://app.daily.dev/posts/the-clean-code-handbook-how-to-write-better-code-for-agile-software-development-e4hpw6ma1", titulo: "El manual de código limpio: Cómo escribir mejor código para el desarrollo de software ágil", tags: ["código limpio", "desarrollo"] },
          { href: "https://medium.com/javarevisited/10-things-software-engineers-should-learn-in-2025-a3c9ec594762", titulo: "10 Cosas que los ingenieros de software deberían aprender en 2025", tags: ["ingeniería de software", "aprendizaje"] },
          { href: "https://sqlpd.com/?ref=dailydev", titulo: "¡Aprende SQL mientras resuelves crímenes! Departamento de Policía SQL", tags: ["sql", "aprendizaje"] },
          { href: "https://blog.bytebytego.com/p/ep144-the-9-algorithms-that-dominate-our-world?ref=dailydev", titulo: "Los 9 algoritmos que dominan nuestro mundo", tags: ["algoritmos", "tecnología"] },
          { href: "https://dev.to/devmount/a-cheatsheet-of-128-cheatsheets-for-developers-f4m?ref=dailydev", titulo: "Una hoja de trucos de 128 hojas de trucos para desarrolladores", tags: ["hoja de trucos", "desarrollo"] },
          { href: "https://app.daily.dev/posts/system-design-cheatsheet-for-interview-teul0ryab", titulo: "Hoja de trucos de diseño de sistemas para entrevistas", tags: ["diseño de sistemas", "entrevista"] },
          { href: "https://glaze.dev/", titulo: "Glaze", tags: ["herramientas", "desarrollo"] },
          { href: "https://logdy.dev/", titulo: "Logdy: un visor web para logs", tags: ["logs", "herramientas"] },
          { href: "https://wind-ui.com/", titulo: "Librería de componentes de Tailwind CSS | WindUI", tags: ["tailwind css", "librería"] },
          { href: "https://is-a.dev/", titulo: "is-a.dev - Subdominios gratuitos para desarrolladores", tags: ["subdominios", "herramientas"] },
          { href: "https://www.manishtamang.com/blog/modern-react-ui-component-libraries?ref=dailydev", titulo: "Librerías de componentes de la UI de React modernas 2025", tags: ["react", "librería"] },
          { href: "https://blog.logrocket.com/building-ai-agent-frontend-project/?ref=dailydev", titulo: "Construyendo un agente de IA para tu proyecto frontend", tags: ["ia", "frontend"] },
          { href: "https://dylanhuang.com/blog/closing-my-startup/?ref=dailydev", titulo: "Después de 3 años, fracasé. Aquí está todo el código de mi startup.", tags: ["startup", "código"] },
          { href: "https://newsletter.techworld-with-milan.com/p/how-to-learn-api?ref=dailydev", titulo: "¿Cómo aprender API?", tags: ["api", "aprendizaje"] },
          { href: "https://dev.to/rayenmabrouk/best-tech-stack-for-startups-in-2025-5h2l", titulo: "El mejor stack tecnológico para startups en 2025", tags: ["stack tecnológico", "startup"] },
          { href: "https://www.reactbits.dev/", titulo: "React Bits - Componentes de la UI animados para React", tags: ["react", "animaciones"] },
          { href: "https://www.waveterm.dev/?ref=dailydev", titulo: "Wave Terminal - Mejora tu línea de comandos", tags: ["terminal", "herramientas"] },
          { href: "https://www.builder.io/blog/react-ai-stack?ref=dailydev", titulo: "React + AI Stack para 2025", tags: ["react", "ia"] },
          { href: "https://omatsuri.app/", titulo: "Omatsuri", tags: ["herramientas", "desarrollo"] },
          { href: "https://htmlrev.com/", titulo: "Plantillas de sitios web HTML gratuitas en HTMLrev", tags: ["html", "plantillas"] },
          { href: "https://unicornicons.com/", titulo: "Iconos de unicornio | Iconos animados para tu próximo proyecto", tags: ["iconos", "animaciones"] },
          { href: "https://undraw.co/", titulo: "unDraw - Ilustraciones de código abierto para cualquier idea", tags: ["ilustraciones", "código abierto"] },
          { href: "https://patternpad.com/", titulo: "PatternPad - Crea hermosos patrones para presentaciones, redes sociales o branding.", tags: ["patrones", "diseño"] },
          { href: "https://www.shapedivider.app/", titulo: "Shape Divider App", tags: ["diseño", "herramientas"] },
          { href: "https://www.photopea.com/", titulo: "Photopea | Editor de fotos online", tags: ["editor de fotos", "herramientas"] },
          { href: "https://quickref.me/php", titulo: "Hoja de trucos y referencia rápida de PHP", tags: ["php", "hoja de trucos"] },
          { href: "https://devdocs.io/", titulo: "Documentación de la API de DevDocs", tags: ["api", "documentación"] },
          { href: "https://devdocs.io/dom/", titulo: "Documentación de las APIs web - DevDocs", tags: ["api web", "documentación"] },
          { href: "https://devhints.io/", titulo: "Devhints - TL;DR para la documentación del desarrollador", tags: ["documentación", "herramientas"] },
          { href: "https://codepen.io/", titulo: "CodePen: Editor de código en línea y comunidad de desarrolladores web frontend", tags: ["editor de código", "frontend"] },
          { href: "https://template0.com/", titulo: "Template0 - Explora y comparte plantillas gratuitas", tags: ["plantillas", "herramientas"] },
          { href: "https://www.freecodecamp.org/news/how-to-host-static-sites-on-azure-static-web-apps/?ref=dailydev", titulo: "Cómo alojar sitios estáticos en Azure Static Web Apps de forma gratuita", tags: ["azure", "alojamiento"] },
          { href: "https://thenewstack.io/free-tool-helps-web-devs-with-googles-complex-seo-update/?ref=dailydev", titulo: "Herramienta gratuita ayuda a los desarrolladores web con la 'compleja' actualización SEO de Google", tags: ["seo", "herramientas"] },
          { href: "https://dev.to/devluc/best-websites-to-find-free-tailwind-css-templates-21ii", titulo: "10 mejores sitios web para plantillas gratuitas de Tailwind", tags: ["tailwind css", "plantillas"] },
          { href: "https://www.producthunt.com/products/treo#treo-site-speed", titulo: "Treo - Información del producto, últimas actualizaciones y reseñas 2025 | Product Hunt", tags: ["herramientas", "productividad"] },
          { href: "https://dev.to/simpledev/top-5-websites-to-find-free-illustrations-31om?ref=dailydev", titulo: "Top 5 sitios web para encontrar ilustraciones gratuitas", tags: ["ilustraciones", "recursos"] },
          { href: "https://icons8.com/illustrations", titulo: "Gráficos vectoriales gratuitos, imágenes prediseñadas e ilustraciones", tags: ["ilustraciones", "recursos"] },
          { href: "https://www.freepik.com/", titulo: "Freepik | Crea grandes diseños, más rápido", tags: ["diseño", "recursos"] },
          { href: "https://www.humaaans.com/", titulo: "Humaaans: Librería de ilustraciones Mix-&-Match", tags: ["ilustraciones", "recursos"] },
          { href: "https://www.drawkit.com/", titulo: "DrawKit - Hermosas ilustraciones e iconos 2D y 3D", tags: ["ilustraciones", "recursos"] },
          { href: "https://absurd.design/", titulo: "Absurd Design - Ilustraciones surrealistas y arte vectorial gratuitos", tags: ["ilustraciones", "recursos"] },
          { href: "https://www.freecodecamp.org/", titulo: "Aprende a programar — Gratis — Cursos de codificación para gente ocupada", tags: ["aprendizaje", "programación"] },
          { href: "https://www.sololearn.com/es/", titulo: "Sololearn: Aprende a Programar", tags: ["aprendizaje", "programación"] },
          { href: "https://www.programiz.com/", titulo: "Programiz: Aprende a codificar gratis", tags: ["aprendizaje", "programación"] },
          { href: "https://www.geeksforgeeks.org/", titulo: "GeeksforGeeks | Un portal de ciencias de la computación para geeks", tags: ["ciencias de la computación", "recursos"] },
          { href: "https://www.studytonight.com/", titulo: "Studytonight - El mejor lugar para aprender a codificar en línea", tags: ["aprendizaje", "programación"] },
          { href: "https://upskillcourses.com/", titulo: "Upskill", tags: ["aprendizaje", "cursos"] },
          { href: "https://www.tpointtech.com/", titulo: "Tpoint Tech - Tutoriales en línea gratuitos", tags: ["aprendizaje", "tutoriales"] },
          { href: "https://www.tutorialspoint.com/python/index.htm", titulo: "Tutorial de Python: Aprende programación en Python", tags: ["python", "tutoriales"] },
          { href: "https://mailchi.mp/webtoolsweekly/web-tools-554?ref=dailydev", titulo: "Web Tools Weekly", tags: ["herramientas web", "recursos"] },
          { href: "https://gameidea.org/2024/12/13/how-to-make-an-rts-game-in-godot/", titulo: "Cómo hacer un juego RTS en Godot", tags: ["godot", "desarrollo de juegos"] },
          { href: "https://draw.audio/?ref=dailydev", titulo: "Draw.Audio", tags: ["audio", "herramientas"] },
          { href: "https://levelup.gitconnected.com/single-point-of-failure-spof-in-system-design-c8bbac5af993", titulo: "Punto único de fallo (SPOF) en el diseño de sistemas", tags: ["diseño de sistemas", "arquitectura"] },
          { href: "https://blog.meetbrackets.com/architectures-of-modern-front-end-applications-8859dfe6c12e", titulo: "Arquitecturas de aplicaciones frontend modernas", tags: ["frontend", "arquitectura"] },
          { href: "https://webflow.com/", titulo: "Webflow", tags: ["herramientas", "desarrollo web"] },
          { href: "https://bubble.io/", titulo: "Bubble", tags: ["herramientas", "desarrollo web"] },
          { href: "https://thunkable.com/", titulo: "Thunkable", tags: ["herramientas", "desarrollo móvil"] },
          { href: "https://www.glideapps.com/", titulo: "Glide", tags: ["herramientas", "desarrollo móvil"] },
          { href: "https://zapier.com/", titulo: "Zapier", tags: ["herramientas", "automatización"] },
          { href: "https://www.airtable.com/", titulo: "Airtable", tags: ["herramientas", "productividad"] },
          { href: "https://www.adalo.com/", titulo: "Adalo", tags: ["herramientas", "desarrollo móvil"] },
          { href: "https://www.softr.io/", titulo: "Softr", tags: ["herramientas", "desarrollo web"] },
          { href: "https://www.flutterflow.io/", titulo: "FlutterFlow", tags: ["herramientas", "desarrollo móvil"] },
          { href: "https://www.weweb.io/", titulo: "WeWeb", tags: ["herramientas", "desarrollo web"] },
          { href: "https://www.vantajs.com/", titulo: "Vanta.js - Fondos animados en 3D para tu sitio web", tags: ["animaciones", "recursos"] },
          { href: "https://www.youtube.com/watch?v=BTBftM7D9v8", titulo: "Explicado en 2 minutos: Tipo vs Interfaz en Typescript", tags: ["typescript", "tutoriales"] },
          { href: "https://git.sn/78TmmMg", titulo: "Postiz", tags: ["herramientas", "desarrollo"] },
          { href: "https://github.com/tolgee/tolgee-platform", titulo: "Tolgee", tags: ["herramientas", "i18n"] },
          { href: "https://github.com/medusajs/medusa", titulo: "MedusaJS", tags: ["e-commerce", "desarrollo"] },
          { href: "https://github.com/formbricks/formbricks", titulo: "Formbricks", tags: ["herramientas", "formularios"] },
          { href: "https://github.com/teamhanko/hanko", titulo: "Hanko", tags: ["autenticación", "seguridad"] },
          { href: "https://github.com/ToolJet/ToolJet", titulo: "ToolJet", tags: ["herramientas", "desarrollo"] },
          { href: "https://github.com/novuhq/novu", titulo: "Novu", tags: ["notificaciones", "herramientas"] },
          { href: "https://github.com/flipt-io/flipt", titulo: "Flipt", tags: ["feature flags", "herramientas"] },
          { href: "https://github.com/PostHog/posthog", titulo: "PostHog", tags: ["analíticas", "herramientas"] },
          { href: "https://github.com/dubinc/dub", titulo: "Dub", tags: ["acortador de enlaces", "herramientas"] },
          { href: "https://github.com/AppFlowy-IO/AppFlowy", titulo: "AppFlowy", tags: ["herramientas", "productividad"] },
          { href: "https://github.com/jitsi/jitsi-meet", titulo: "Jitsi", tags: ["videoconferencia", "herramientas"] },
          { href: "https://github.com/makeplane/plane", titulo: "Plane", tags: ["gestión de proyectos", "herramientas"] },
          { href: "https://github.com/nocodb/nocodb", titulo: "NocoDB", tags: ["base de datos", "herramientas"] },
          { href: "https://github.com/coollabsio/coolify", titulo: "Coolify", tags: ["herramientas", "despliegue"] },
          { href: "https://github.com/taubyte/tau", titulo: "Taubyte", tags: ["herramientas", "desarrollo"] },
          { href: "https://github.com/dokku/dokku", titulo: "Dokku", tags: ["herramientas", "despliegue"] },
          { href: "https://github.com/pocketbase/pocketbase", titulo: "PocketBase", tags: ["backend", "herramientas"] },
          { href: "https://github.com/appwrite/appwrite", titulo: "Appwrite", tags: ["backend", "herramientas"] },
          { href: "https://github.com/supabase/supabase", titulo: "Supabase", tags: ["backend", "herramientas"] },
          { href: "https://github.com/PrestaShop/PrestaShop", titulo: "PrestaShop", tags: ["e-commerce", "desarrollo"] },
          { href: "https://github.com/mattermost/mattermost", titulo: "Mattermost", tags: ["comunicación", "herramientas"] },
          { href: "https://github.com/frappe/erpnext", titulo: "ERPNext", tags: ["erp", "herramientas"] },
          { href: "https://github.com/nextcloud/server", titulo: "Nextcloud", tags: ["almacenamiento", "herramientas"] },
          { href: "https://github.com/mautic/mautic", titulo: "Mautic", tags: ["marketing", "herramientas"] },
          { href: "https://github.com/wekan/wekan", titulo: "Wekan", tags: ["kanban", "herramientas"] },
          { href: "https://github.com/documenso/documenso", titulo: "Documenso", tags: ["documentos", "herramientas"] },
          { href: "https://github.com/calcom/cal.com", titulo: "Cal", tags: ["calendario", "herramientas"] },
          { href: "https://github.com/prometheus/prometheus", titulo: "Prometheus", tags: ["monitorización", "herramientas"] },
          { href: "https://github.com/plausible/analytics", titulo: "Plausible", tags: ["analíticas", "herramientas"] },
          { href: "https://github.com/usefathom/fathom", titulo: "Fathom", tags: ["analíticas", "herramientas"] },
          { href: "https://github.com/n8n-io/n8n", titulo: "n8n", tags: ["automatización", "herramientas"] },
          { href: "https://github.com/devflowinc/trieve", titulo: "Trieve", tags: ["búsqueda", "herramientas"] },
          { href: "https://github.com/chatwoot/chatwoot", titulo: "Chatwoot", tags: ["chat en vivo", "herramientas"] },
          { href: "https://github.com/ComposioHQ/composio", titulo: "Composio", tags: ["cms", "herramientas"] },
          { href: "https://github.com/llmware-ai/llmware", titulo: "LLMWare", tags: ["ia", "herramientas"] },
          { href: "https://github.com/airbytehq/airbyte", titulo: "Airbyte", tags: ["etl", "herramientas"] },
          { href: "https://github.com/phoenixframework/phoenix", titulo: "Phoenix", tags: ["framework", "desarrollo web"] },
          { href: "https://github.com/mfts/papermark", titulo: "Papermark", tags: ["documentos", "herramientas"] },
          { href: "https://github.com/toeverything/AFFiNE", titulo: "Affine", tags: ["productividad", "herramientas"] },
          { href: "https://www.freecodecamp.org/news/build-deploy-a-full-stack-dating-app/?ref=dailydev", titulo: "Construye y despliega una aplicación de citas de pila completa", tags: ["full stack", "desarrollo"] },
          { href: "https://api.daily.dev/r/jU1GU4YrY", titulo: "Imagen de portada de la publicación", tags: ["recursos", "imágenes"] },
        ])
      });
  }, []);

  const fetchRecursos = async () => {
    try {
      return Promise.resolve([
        { href: "https://www.classcentral.com/report/free-developer-it-certifications/?ref=dailydev", titulo: "900+ Certificaciones gratuitas para desarrolladores y profesionales de TI", tags: ["gratis", "certificaciones"] },
        { href: "https://dev.to/hanzla-baig/150-free-apis-every-developer-needs-to-know-m9j?ref=dailydev", titulo: "Más de 150 APIs GRATUITAS que todo desarrollador necesita conocer", tags: ["api", "desarrollo"] },
        { href: "https://css-loaders.com/", titulo: "CSS Loaders: Una colección de más de 600 animaciones de carga", tags: ["css", "animación"] },
        { href: "https://www.freepublicapis.com/?ref=dailydev", titulo: "APIs Públicas Gratuitas", tags: ["api", "gratis"] },
        { href: "https://www.freepublicapis.com/eva-email-verification", titulo: "Verificación de correo electrónico EVA", tags: ["api", "correo electrónico"] },
        { href: "https://dev.to/hanzla-mirza/100-free-apis-every-developer-should-know-in-2024-1bdk?ref=dailydev", titulo: "APIs 100% gratuitas que todo desarrollador debería conocer en 2024", tags: ["api", "gratis"] },
        { href: "https://uiverse.io/elements?ref=dailydev", titulo: "5214 elementos de la UI: CSS & Tailwind", tags: ["ui", "css", "tailwind"] },
        { href: "https://blog.bytebytego.com/p/ep128-the-ultimate-software-architect?ref=dailydev", titulo: "El mapa de conocimiento definitivo del arquitecto de software", tags: ["arquitectura", "software"] },
        { href: "https://medium.com/javarevisited/6-best-resources-for-tech-interview-preparation-in-2024-d06f11ada15c", titulo: "6 Mejores recursos para la preparación de entrevistas técnicas en 2024", tags: ["entrevista", "técnica"] },
        { href: "https://medium.com/javarevisited/5-javascript-concepts-every-developer-should-know-61111b00349a?ref=dailydev", titulo: "5 Conceptos de JavaScript que todo desarrollador debería conocer", tags: ["javascript", "conceptos"] },
        { href: "https://www.classcentral.com/report/free-developer-it-certifications/?ref=dailydev", titulo: "900+ Certificaciones gratuitas para desarrolladores y profesionales de TI", tags: ["gratis", "certificaciones"] },
        { href: "https://dev.to/buildwebcrumbs/creating-a-personal-brand-how-to-sell-yourself-as-a-developer-52po?ref=dailydev", titulo: "Creando una marca personal: Cómo venderte como desarrollador", tags: ["personal", "marca"] },
        { href: "https://techcrunch.com/2024/08/11/a-not-quite-definitive-guide-to-open-source-alternative-software/?ref=dailydev", titulo: "Herramientas de código abierto para impulsar tu productividad", tags: ["código abierto", "herramientas"] },
        { href: "https://developer20.com/go-libs-i-dont-use/?ref=dailydev", titulo: "Librerías de Go que no uso pero son populares", tags: ["go", "librerías"] },
        { href: "https://blog.bytebytego.com/p/ep130-design-a-system-like-youtube?ref=dailydev", titulo: "Diseñando un sistema como YouTube", tags: ["arquitectura", "youtube"] },
        { href: "https://newsletter.systemdesigncodex.com/p/database-sharding?ref=dailydev", titulo: "Particionamiento de bases de datos", tags: ["base de datos", "diseño de sistemas"] },
        { href: "https://proton.me/blog/drive-open-source?ref=dailydev", titulo: "Todas las apps de Proton Drive ahora son de código abierto", tags: ["código abierto", "almacenamiento"] },
        { href: "https://app.daily.dev/posts/you-get-paid-based-on-the-level-of-abstraction-you-can-work-at--soryhdhti", titulo: "Te pagan según el nivel de abstracción en el que puedes trabajar", tags: ["desarrollo", "carrera"] },
        { href: "https://uiverse.io/", titulo: "Uiverse | La biblioteca más grande de elementos de la UI de código abierto", tags: ["ui", "código abierto"] },
        { href: "https://app.daily.dev/posts/the-clean-code-handbook-how-to-write-better-code-for-agile-software-development-e4hpw6ma1", titulo: "El manual de código limpio: Cómo escribir mejor código para el desarrollo de software ágil", tags: ["código limpio", "desarrollo"] },
        { href: "https://medium.com/javarevisited/10-things-software-engineers-should-learn-in-2025-a3c9ec594762", titulo: "10 Cosas que los ingenieros de software deberían aprender en 2025", tags: ["ingeniería de software", "aprendizaje"] },
        { href: "https://sqlpd.com/?ref=dailydev", titulo: "¡Aprende SQL mientras resuelves crímenes! Departamento de Policía SQL", tags: ["sql", "aprendizaje"] },
        { href: "https://blog.bytebytego.com/p/ep144-the-9-algorithms-that-dominate-our-world?ref=dailydev", titulo: "Los 9 algoritmos que dominan nuestro mundo", tags: ["algoritmos", "tecnología"] },
        { href: "https://dev.to/devmount/a-cheatsheet-of-128-cheatsheets-for-developers-f4m?ref=dailydev", titulo: "Una hoja de trucos de 128 hojas de trucos para desarrolladores", tags: ["hoja de trucos", "desarrollo"] },
        { href: "https://app.daily.dev/posts/system-design-cheatsheet-for-interview-teul0ryab", titulo: "Hoja de trucos de diseño de sistemas para entrevistas", tags: ["diseño de sistemas", "entrevista"] },
        { href: "https://glaze.dev/", titulo: "Glaze", tags: ["herramientas", "desarrollo"] },
        { href: "https://logdy.dev/", titulo: "Logdy: un visor web para logs", tags: ["logs", "herramientas"] },
        { href: "https://wind-ui.com/", titulo: "Librería de componentes de Tailwind CSS | WindUI", tags: ["tailwind css", "librería"] },
        { href: "https://is-a.dev/", titulo: "is-a.dev - Subdominios gratuitos para desarrolladores", tags: ["subdominios", "herramientas"] },
        { href: "https://www.manishtamang.com/blog/modern-react-ui-component-libraries?ref=dailydev", titulo: "Librerías de componentes de la UI de React modernas 2025", tags: ["react", "librería"] },
        { href: "https://blog.logrocket.com/building-ai-agent-frontend-project/?ref=dailydev", titulo: "Construyendo un agente de IA para tu proyecto frontend", tags: ["ia", "frontend"] },
        { href: "https://dylanhuang.com/blog/closing-my-startup/?ref=dailydev", titulo: "Después de 3 años, fracasé. Aquí está todo el código de mi startup.", tags: ["startup", "código"] },
        { href: "https://newsletter.techworld-with-milan.com/p/how-to-learn-api?ref=dailydev", titulo: "¿Cómo aprender API?", tags: ["api", "aprendizaje"] },
        { href: "https://dev.to/rayenmabrouk/best-tech-stack-for-startups-in-2025-5h2l", titulo: "El mejor stack tecnológico para startups en 2025", tags: ["stack tecnológico", "startup"] },
        { href: "https://www.reactbits.dev/", titulo: "React Bits - Componentes de la UI animados para React", tags: ["react", "animaciones"] },
        { href: "https://www.waveterm.dev/?ref=dailydev", titulo: "Wave Terminal - Mejora tu línea de comandos", tags: ["terminal", "herramientas"] },
        { href: "https://www.builder.io/blog/react-ai-stack?ref=dailydev", titulo: "React + AI Stack para 2025", tags: ["react", "ia"] },
        { href: "https://omatsuri.app/", titulo: "Omatsuri", tags: ["herramientas", "desarrollo"] },
        { href: "https://htmlrev.com/", titulo: "Plantillas de sitios web HTML gratuitas en HTMLrev", tags: ["html", "plantillas"] },
        { href: "https://unicornicons.com/", titulo: "Iconos de unicornio | Iconos animados para tu próximo proyecto", tags: ["iconos", "animaciones"] },
        { href: "https://undraw.co/", titulo: "unDraw - Ilustraciones de código abierto para cualquier idea", tags: ["ilustraciones", "código abierto"] },
        { href: "https://patternpad.com/", titulo: "PatternPad - Crea hermosos patrones para presentaciones, redes sociales o branding.", tags: ["patrones", "diseño"] },
        { href: "https://www.shapedivider.app/", titulo: "Shape Divider App", tags: ["diseño", "herramientas"] },
        { href: "https://www.photopea.com/", titulo: "Photopea | Editor de fotos online", tags: ["editor de fotos", "herramientas"] },
        { href: "https://quickref.me/php", titulo: "Hoja de trucos y referencia rápida de PHP", tags: ["php", "hoja de trucos"] },
        { href: "https://devdocs.io/", titulo: "Documentación de la API de DevDocs", tags: ["api", "documentación"] },
        { href: "https://devdocs.io/dom/", titulo: "Documentación de las APIs web - DevDocs", tags: ["api web", "documentación"] },
        { href: "https://devhints.io/", titulo: "Devhints - TL;DR para la documentación del desarrollador", tags: ["documentación", "herramientas"] },
        { href: "https://codepen.io/", titulo: "CodePen: Editor de código en línea y comunidad de desarrolladores web frontend", tags: ["editor de código", "frontend"] },
        { href: "https://template0.com/", titulo: "Template0 - Explora y comparte plantillas gratuitas", tags: ["plantillas", "herramientas"] },
        { href: "https://www.freecodecamp.org/news/how-to-host-static-sites-on-azure-static-web-apps/?ref=dailydev", titulo: "Cómo alojar sitios estáticos en Azure Static Web Apps de forma gratuita", tags: ["azure", "alojamiento"] },
        { href: "https://thenewstack.io/free-tool-helps-web-devs-with-googles-complex-seo-update/?ref=dailydev", titulo: "Herramienta gratuita ayuda a los desarrolladores web con la 'compleja' actualización SEO de Google", tags: ["seo", "herramientas"] },
        { href: "https://dev.to/devluc/best-websites-to-find-free-tailwind-css-templates-21ii", titulo: "10 mejores sitios web para plantillas gratuitas de Tailwind", tags: ["tailwind css", "plantillas"] },
        { href: "https://www.producthunt.com/products/treo#treo-site-speed", titulo: "Treo - Información del producto, últimas actualizaciones y reseñas 2025 | Product Hunt", tags: ["herramientas", "productividad"] },
        { href: "https://dev.to/simpledev/top-5-websites-to-find-free-illustrations-31om?ref=dailydev", titulo: "Top 5 sitios web para encontrar ilustraciones gratuitas", tags: ["ilustraciones", "recursos"] },
        { href: "https://icons8.com/illustrations", titulo: "Gráficos vectoriales gratuitos, imágenes prediseñadas e ilustraciones", tags: ["ilustraciones", "recursos"] },
        { href: "https://www.freepik.com/", titulo: "Freepik | Crea grandes diseños, más rápido", tags: ["diseño", "recursos"] },
        { href: "https://www.humaaans.com/", titulo: "Humaaans: Librería de ilustraciones Mix-&-Match", tags: ["ilustraciones", "recursos"] },
        { href: "https://www.drawkit.com/", titulo: "DrawKit - Hermosas ilustraciones e iconos 2D y 3D", tags: ["ilustraciones", "recursos"] },
        { href: "https://absurd.design/", titulo: "Absurd Design - Ilustraciones surrealistas y arte vectorial gratuitos", tags: ["ilustraciones", "recursos"] },
        { href: "https://www.freecodecamp.org/", titulo: "Aprende a programar — Gratis — Cursos de codificación para gente ocupada", tags: ["aprendizaje", "programación"] },
        { href: "https://www.sololearn.com/es/", titulo: "Sololearn: Aprende a Programar", tags: ["aprendizaje", "programación"] },
        { href: "https://www.programiz.com/", titulo: "Programiz: Aprende a codificar gratis", tags: ["aprendizaje", "programación"] },
        { href: "https://www.geeksforgeeks.org/", titulo: "GeeksforGeeks | Un portal de ciencias de la computación para geeks", tags: ["ciencias de la computación", "recursos"] },
        { href: "https://www.studytonight.com/", titulo: "Studytonight - El mejor lugar para aprender a codificar en línea", tags: ["aprendizaje", "programación"] },
        { href: "https://upskillcourses.com/", titulo: "Upskill", tags: ["aprendizaje", "cursos"] },
        { href: "https://www.tpointtech.com/", titulo: "Tpoint Tech - Tutoriales en línea gratuitos", tags: ["aprendizaje", "tutoriales"] },
        { href: "https://www.tutorialspoint.com/python/index.htm", titulo: "Tutorial de Python: Aprende programación en Python", tags: ["python", "tutoriales"] },
        { href: "https://mailchi.mp/webtoolsweekly/web-tools-554?ref=dailydev", titulo: "Web Tools Weekly", tags: ["herramientas web", "recursos"] },
        { href: "https://gameidea.org/2024/12/13/how-to-make-an-rts-game-in-godot/", titulo: "Cómo hacer un juego RTS en Godot", tags: ["godot", "desarrollo de juegos"] },
        { href: "https://draw.audio/?ref=dailydev", titulo: "Draw.Audio", tags: ["audio", "herramientas"] },
        { href: "https://levelup.gitconnected.com/single-point-of-failure-spof-in-system-design-c8bbac5af993", titulo: "Punto único de fallo (SPOF) en el diseño de sistemas", tags: ["diseño de sistemas", "arquitectura"] },
        { href: "https://blog.meetbrackets.com/architectures-of-modern-front-end-applications-8859dfe6c12e", titulo: "Arquitecturas de aplicaciones frontend modernas", tags: ["frontend", "arquitectura"] },
        { href: "https://webflow.com/", titulo: "Webflow", tags: ["herramientas", "desarrollo web"] },
        { href: "https://bubble.io/", titulo: "Bubble", tags: ["herramientas", "desarrollo web"] },
        { href: "https://thunkable.com/", titulo: "Thunkable", tags: ["herramientas", "desarrollo móvil"] },
        { href: "https://www.glideapps.com/", titulo: "Glide", tags: ["herramientas", "desarrollo móvil"] },
        { href: "https://zapier.com/", titulo: "Zapier", tags: ["herramientas", "automatización"] },
        { href: "https://www.airtable.com/", titulo: "Airtable", tags: ["herramientas", "productividad"] },
        { href: "https://www.adalo.com/", titulo: "Adalo", tags: ["herramientas", "desarrollo móvil"] },
        { href: "https://www.softr.io/", titulo: "Softr", tags: ["herramientas", "desarrollo web"] },
        { href: "https://www.flutterflow.io/", titulo: "FlutterFlow", tags: ["herramientas", "desarrollo móvil"] },
        { href: "https://www.weweb.io/", titulo: "WeWeb", tags: ["herramientas", "desarrollo web"] },
        { href: "https://www.vantajs.com/", titulo: "Vanta.js - Fondos animados en 3D para tu sitio web", tags: ["animaciones", "recursos"] },
        { href: "https://www.youtube.com/watch?v=BTBftM7D9v8", titulo: "Explicado en 2 minutos: Tipo vs Interfaz en Typescript", tags: ["typescript", "tutoriales"] },
        { href: "https://git.sn/78TmmMg", titulo: "Postiz", tags: ["herramientas", "desarrollo"] },
        { href: "https://github.com/tolgee/tolgee-platform", titulo: "Tolgee", tags: ["herramientas", "i18n"] },
        { href: "https://github.com/medusajs/medusa", titulo: "MedusaJS", tags: ["e-commerce", "desarrollo"] },
        { href: "https://github.com/formbricks/formbricks", titulo: "Formbricks", tags: ["herramientas", "formularios"] },
        { href: "https://github.com/teamhanko/hanko", titulo: "Hanko", tags: ["autenticación", "seguridad"] },
        { href: "https://github.com/ToolJet/ToolJet", titulo: "ToolJet", tags: ["herramientas", "desarrollo"] },
        { href: "https://github.com/novuhq/novu", titulo: "Novu", tags: ["notificaciones", "herramientas"] },
        { href: "https://github.com/flipt-io/flipt", titulo: "Flipt", tags: ["feature flags", "herramientas"] },
        { href: "https://github.com/PostHog/posthog", titulo: "PostHog", tags: ["analíticas", "herramientas"] },
        { href: "https://github.com/dubinc/dub", titulo: "Dub", tags: ["acortador de enlaces", "herramientas"] },
        { href: "https://github.com/AppFlowy-IO/AppFlowy", titulo: "AppFlowy", tags: ["herramientas", "productividad"] },
        { href: "https://github.com/jitsi/jitsi-meet", titulo: "Jitsi", tags: ["videoconferencia", "herramientas"] },
        { href: "https://github.com/makeplane/plane", titulo: "Plane", tags: ["gestión de proyectos", "herramientas"] },
        { href: "https://github.com/nocodb/nocodb", titulo: "NocoDB", tags: ["base de datos", "herramientas"] },
        { href: "https://github.com/coollabsio/coolify", titulo: "Coolify", tags: ["herramientas", "despliegue"] },
        { href: "https://github.com/taubyte/tau", titulo: "Taubyte", tags: ["herramientas", "desarrollo"] },
        { href: "https://github.com/dokku/dokku", titulo: "Dokku", tags: ["herramientas", "despliegue"] },
        { href: "https://github.com/pocketbase/pocketbase", titulo: "PocketBase", tags: ["backend", "herramientas"] },
        { href: "https://github.com/appwrite/appwrite", titulo: "Appwrite", tags: ["backend", "herramientas"] },
        { href: "https://github.com/supabase/supabase", titulo: "Supabase", tags: ["backend", "herramientas"] },
        { href: "https://github.com/PrestaShop/PrestaShop", titulo: "PrestaShop", tags: ["e-commerce", "desarrollo"] },
        { href: "https://github.com/mattermost/mattermost", titulo: "Mattermost", tags: ["comunicación", "herramientas"] },
        { href: "https://github.com/frappe/erpnext", titulo: "ERPNext", tags: ["erp", "herramientas"] },
        { href: "https://github.com/nextcloud/server", titulo: "Nextcloud", tags: ["almacenamiento", "herramientas"] },
        { href: "https://github.com/mautic/mautic", titulo: "Mautic", tags: ["marketing", "herramientas"] },
        { href: "https://github.com/wekan/wekan", titulo: "Wekan", tags: ["kanban", "herramientas"] },
        { href: "https://github.com/documenso/documenso", titulo: "Documenso", tags: ["documentos", "herramientas"] },
        { href: "https://github.com/calcom/cal.com", titulo: "Cal", tags: ["calendario", "herramientas"] },
        { href: "https://github.com/prometheus/prometheus", titulo: "Prometheus", tags: ["monitorización", "herramientas"] },
        { href: "https://github.com/plausible/analytics", titulo: "Plausible", tags: ["analíticas", "herramientas"] },
        { href: "https://github.com/usefathom/fathom", titulo: "Fathom", tags: ["analíticas", "herramientas"] },
        { href: "https://github.com/n8n-io/n8n", titulo: "n8n", tags: ["automatización", "herramientas"] },
        { href: "https://github.com/devflowinc/trieve", titulo: "Trieve", tags: ["búsqueda", "herramientas"] },
        { href: "https://github.com/chatwoot/chatwoot", titulo: "Chatwoot", tags: ["chat en vivo", "herramientas"] },
        { href: "https://github.com/ComposioHQ/composio", titulo: "Composio", tags: ["cms", "herramientas"] },
        { href: "https://github.com/llmware-ai/llmware", titulo: "LLMWare", tags: ["ia", "herramientas"] },
        { href: "https://github.com/airbytehq/airbyte", titulo: "Airbyte", tags: ["etl", "herramientas"] },
        { href: "https://github.com/phoenixframework/phoenix", titulo: "Phoenix", tags: ["framework", "desarrollo web"] },
        { href: "https://github.com/mfts/papermark", titulo: "Papermark", tags: ["documentos", "herramientas"] },
        { href: "https://github.com/toeverything/AFFiNE", titulo: "Affine", tags: ["productividad", "herramientas"] },
        { href: "https://www.freecodecamp.org/news/build-deploy-a-full-stack-dating-app/?ref=dailydev", titulo: "Construye y despliega una aplicación de citas de pila completa", tags: ["full stack", "desarrollo"] },
        { href: "https://api.daily.dev/r/jU1GU4YrY", titulo: "Imagen de portada de la publicación", tags: ["recursos", "imágenes"] },
      ])
    } catch (error) {
      console.error("Error buscando recursos:", error);
      throw error;
    }
  };

  return (
    <>
      <ListaRecursos recursos={recursoData} />
      <ListaPublicaciones />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));