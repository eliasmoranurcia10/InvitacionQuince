document.addEventListener('DOMContentLoaded', function() {
    const sobre = document.getElementById('sobrecito');
    const audio = new Audio('./audios/musica-fondo.mp3');
    
    let scrollLocked = true;

    function preventScroll(e) {
        if (!scrollLocked) return;
        e.preventDefault();
    }

    function lockScroll() {
        scrollLocked = true;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    function unlockScroll() {
        scrollLocked = false;
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', function(e) {
        if (!scrollLocked) return;
        const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'];
        if (keys.includes(e.key)) e.preventDefault();
    });

    lockScroll();

    // Al recargar la página, asegurarse de que se muestre primero #sobrecito.
    if (sobre) {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        sobre.scrollIntoView({ behavior: 'auto', block: 'start' });
        window.scrollTo({ top: 0, left: 0 });
    }

    audio.loop = true;

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            audio.pause();
        } else if (audio.paused && audio.currentTime > 0) {
            audio.play().catch(function() {
                console.log('No se pudo reanudar el audio al volver a la página.');
            });
        }
    });

    if (sobre) {
        sobre.addEventListener('click', function() {
            unlockScroll();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            sobre.classList.toggle('abierto');

            if (typeof audio.play === 'function') {
                audio.play().catch(function() {
                    console.log('No se pudo reproducir el audio al hacer clic.');
                });
            }
            // Auto-scroll: start when opened, stop when closed
            if (sobre.classList.contains('abierto')) {
                startAutoScroll();
            } else {
                stopAutoScroll();
            }
        });
    }
});

// Auto-scroll implementation
let scrollInterval = null;
function startAutoScroll() {
    if (scrollInterval) return;
    // scroll by 1px every 16ms (~60fps) for smooth slow scroll
    scrollInterval = setInterval(() => {
        // if at bottom, stop
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            stopAutoScroll();
            return;
        }
        window.scrollBy(0, 1);
    }, 16);
}

function stopAutoScroll() {
    if (!scrollInterval) return;
    clearInterval(scrollInterval);
    scrollInterval = null;
}


// Stop auto-scroll on user interaction (scroll, wheel, touch, key, mouse)
function attachStopOnUserInteraction() {
    const stopEvents = ['wheel', 'touchstart', 'mousedown'];
    stopEvents.forEach(evt => window.addEventListener(evt, stopAutoScroll, { passive: true }));

    window.addEventListener('keydown', function(e){
        // common navigation keys
        const keys = ['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ' ,'Escape'];
        if (keys.includes(e.key)) stopAutoScroll();
    });
}

attachStopOnUserInteraction();



// Temporizador

const fechaEvento = new Date("July 25, 2026 20:00:00").getTime();

function actualizarTemporizador(){

    const ahora = new Date().getTime();

    const diferencia = fechaEvento - ahora;

    if(diferencia < 0){

        document.querySelector(".timer").innerHTML =
        "<h2>¡Llegó el gran día! 🎉</h2>";

        return;
    }

    const dias = Math.floor(diferencia / (1000*60*60*24));

    const horas = Math.floor(
        (diferencia % (1000*60*60*24))
        /(1000*60*60)
    );

    const minutos = Math.floor(
        (diferencia % (1000*60*60))
        /(1000*60)
    );

    const segundos = Math.floor(
        (diferencia % (1000*60))
        /1000
    );

    document.getElementById("dias").innerHTML = dias;
    document.getElementById("horas").innerHTML = horas;
    document.getElementById("minutos").innerHTML = minutos;
    document.getElementById("segundos").innerHTML = segundos;

}

setInterval(actualizarTemporizador,1000);

actualizarTemporizador();


