// Obtiene los elementos de la barra de título para que se puedan mover
var windows = document.getElementsByClassName('macos-window');
var taskbar = document.querySelector('.taskbar');

for (var i = 0; i < windows.length; i++) {
    var titleBar = windows[i].getElementsByClassName('macos-titlebar')[0];
    makeDraggable(windows[i], titleBar);
}

function makeDraggable(window, titleBar) {
    var isDragging = false;
    var offsetX = 0;
    var offsetY = 0;

    titleBar.addEventListener('mousedown', startDrag);

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        offsetX = e.clientX - window.offsetLeft;
        offsetY = e.clientY - window.offsetTop;
        window.style.transition = 'none'; // Evita el lag en el arrastre
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('mouseleave', stopDrag); // Manejar el mouseleave
    }

    function drag(e) {
        if (isDragging) {
            window.style.left = e.clientX - offsetX + 'px';
            window.style.top = e.clientY - offsetY + 'px';
        }
    }

    function stopDrag() {
        isDragging = false;
        window.style.transition = ''; // Restaura la transición
        window.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', stopDrag);
        window.removeEventListener('mouseleave', stopDrag);
    }
}

function closeWindow(id) {
    var window = document.getElementById(id);
    window.style.display = 'none';
}

function minimizeWindow(id) {
    var window = document.getElementById(id);

    // Oculta la ventana con una transición suave
    window.style.transition = 'opacity 0.3s ease';
    window.style.opacity = '0';

    // Agrega un ícono correspondiente en la barra de tareas con una transición suave
    var taskbarIcons = document.querySelector('.taskbar-icons');
    var icon = document.createElement('div');
    icon.className = 'taskbar-icon';
    icon.setAttribute('data-window-id', id);
    icon.onclick = function() {
        var windowId = this.getAttribute('data-window-id');
        restoreWindow(windowId);
    };
    taskbarIcons.appendChild(icon);

    // Espera a que termine la transición antes de ocultar completamente la ventana
    setTimeout(function() {
        window.style.display = 'none';
    }, 300);
}

function restoreWindow(id) {
    var window = document.getElementById(id);
    
    // Muestra la ventana con una transición suave
    window.style.transition = 'opacity 0.3s ease';
    window.style.display = ''; // Muestra la ventana
    window.style.opacity = '1';

    // Elimina el ícono correspondiente de la barra de tareas
    var taskbarIcons = document.querySelector('.taskbar-icons');
    var icons = taskbarIcons.getElementsByClassName('taskbar-icon');
    for (var i = 0; i < icons.length; i++) {
        if (icons[i].getAttribute('data-window-id') === id) {
            icons[i].remove();
            break;
        }
    }
}

function maximizeWindow(id) {
    var window = document.getElementById(id);
    if (window.classList.contains('maximized')) {
        window.style.left = window.getAttribute('data-original-left');
        window.style.top = window.getAttribute('data-original-top');
        window.style.width = window.getAttribute('data-original-width');
        window.style.height = window.getAttribute('data-original-height');
        window.classList.remove('maximized');
    } else {
        window.setAttribute('data-original-left', window.style.left);
        window.setAttribute('data-original-top', window.style.top);
        window.setAttribute('data-original-width', window.style.width);
        window.setAttribute('data-original-height', window.style.height);

        window.style.left = '0';
        window.style.top = '0';
        window.style.width = '100%';
        window.style.height = '100%';
        window.classList.add('maximized');
    }
}

function animateMinimize(window) {
    var rect = window.getBoundingClientRect();
    var clone = window.cloneNode(true);
    clone.classList.add('minimized-window');
    clone.style.transition = 'none';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    document.body.appendChild(clone);

    setTimeout(function() {
        var taskbarRect = taskbar.getBoundingClientRect();
        clone.style.transition = 'all 0.3s ease';
        clone.style.left = taskbarRect.left + 'px';
        clone.style.top = taskbarRect.top + 'px';
        setTimeout(function() {
            clone.style.opacity = '0';
            setTimeout(function() {
                clone.remove();
            }, 300);
        }, 300);
    }, 10);
}
