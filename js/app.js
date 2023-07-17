const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


// Crear Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas()

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        
       const {FullName, Name} = cripto.CoinInfo;
    //    console.log(FullName, Name)
    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option)

    });

}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
}

function submitFormulario(e){
    e.preventDefault();
    // validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos Campos son Obligatorios');
        return
    }

    // consultar la api
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const error = document.querySelector('.error');

    if(!error){

        const mensajeAlerta = document.createElement('DIV')
        mensajeAlerta.classList.add('error')
        mensajeAlerta.textContent = mensaje
        formulario.appendChild(mensajeAlerta)
    
        setTimeout(() => {
            mensajeAlerta.remove()
        }, 3000);
    }
}


function consultarAPI( ){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
        })

}

function mostrarCotizacionHTML(cotizacion){
        limpiarHTML()
        const {moneda, criptomoneda} = objBusqueda;

        const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion
        const existePrecio = document.querySelector('.precio')
        

            const precio = document.createElement('DIV');
            precio.classList.add('precio')
            precio.innerHTML = `
            <h2>Cotización ${moneda} vs ${criptomoneda}</h2>
            <p class="precio">El precio actual es: <span>${PRICE}</span>  </p>
            <p>Última actualización: <span>${LASTUPDATE}</span>   </p>
            `
            resultado.appendChild(precio)
        
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner')
    spinner.innerHTML =`
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>

    `
    resultado.appendChild(spinner)


}