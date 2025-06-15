"use client"
export default function Terms_and_Condition({show, setShow}){
    return(
        <div className={`container container-terms d-${show}`}>
            <span onClick={()=>setShow('none')}><i className="bi bi-x-lg"></i></span>
            <div>
                <h1>TERMINOS DE USO</h1>
                
                <h3>1. Identidad del Responsable:</h3>
                <p>Esta plataforma, denomida [JobGet-lat], es operada por [AlexServ], y contacto a travez del correo [alexdaniel2005.yt@gmail.com]</p>

                <h3>2. Aceptacion de terminos:</h3>
                <p>Al acceder y utilizar esta aplicación, el usuario acepta plenamente los presentes Términos de Uso. Si no estás de acuerdo con ellos, no deberías utilizar la plataforma.</p>  
                
                <h3>3. Acceso y Registro:</h3>
                <p>Para acceder a ciertas funcionalidades, los usuarios deben iniciar sesión mediante Google o registro comun. El usuario garantiza que la información proporcionada es verídica, actual y completa.</p>

                <h3>4. Edad Minima:</h3>
                <p>El uso de esta plataforma está permitido únicamente a personas mayores de 18 años (dependiendo de tu país objetivo). Al registrarte, declaras que cumplís con este requisito.</p>  

                <h3>5. Cuenta del Usuario:</h3>
                <p>Cada usuario es responsable de toda actividad realizada desde su cuenta. Se compromete a mantener la confidencialidad de sus credenciales (aunque uses login con Google, esto sigue aplicando para cookies/token).</p>

                <h3>6. Propiedad intelectual:</h3>
                <p>Todo el contenido de la plataforma (logos, textos, gráficos, código, etc.) pertenece a [AlexServ] y está protegido por leyes de propiedad intelectual. Queda prohibido copiar, distribuir o modificar sin autorización.</p>

                <h3>7. Modificaciones de los términos:</h3>
                <p>Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. Se notificará a los usuarios sobre cambios importantes. El uso continuado implica aceptación.
                </p>

                <h3>8. Finalidad de uso:</h3>
                <p>
                Esta plataforma fue creada para [Ayudar a los ciudadanos sin ningun tipo de discriminacion, poder buscar/publicar empleos, pasantias o servicios]. Cualquier uso indebido será motivo de restricción o eliminación de la cuenta.
                </p>
                
                <h3>9. Recopilacion de datos:</h3>
                <p>Esta plataforma no recopila datos personales del usuario salvo lo necesario para poder identificarse en el sitio. El desarrollador no manipula la informacion basica proporcionada del usuario para el sitio salvo que el mismo usuario autorize al desarrollador</p>
            </div>
            <br/>
            <div>
                <h1>CONDICIONES DE USO</h1>
                
                <h3>Prohibiciones de conducta:</h3>
                <p>No se permite publicar contenido ofensivo, ilegal, violento, sexual explícito, discriminatorio, etc.</p>

                <h3>Uso correcto de los servicios:</h3>
                <p>Usar la app para su propósito principal mostrado en Terminos de uso (por ejemplo: buscar empleos, conectar personas, etc.) y no para spam, bots, fraude, suplantaciones, etc.</p>

                <h3>Suspensión de cuentas:</h3>
                <p>Si un usuario incumple las reglas, su cuenta puede ser suspendida o eliminada sin previo aviso.</p>

                <h3>Contenido del usuario:</h3>
                <p>El usuario es responsable del contenido que sube. Si sube algo ilegal o con derechos de autor, es su responsabilidad.</p>

                <h3>Seguridad:</h3>
                <p>Prohibido intentar hackear, hacer ingeniería inversa, acceder a datos de otros usuarios, etc. Este incumplimiento ira por via legal</p>

                <h3>Comportamiento entre usuarios (si aplica):</h3>
                <p>Trato respetuoso. Prohibido el acoso, amenazas, o cualquier comportamiento abusivo.</p>
            </div>
            <button className="btn btn-primary w-75" onClick={()=>{
                setShow('none')
            }}>
                Aceptar
            </button>
        </div>
    )    
}