const usuarioLogado = JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);
console.log(usuarioLogado);

// Elementos do menu
const itemLogin = document.getElementById("item-login");
const itemFavoritos = document.getElementById("item-favoritos");
const itemLogout = document.getElementById("item-logout");
const itemCadastro = document.getElementById("item-cadastro");
console.log(itemCadastro);
// Se estiver logado
if (usuarioLogado) {

    if (itemLogin)
        itemLogin.classList.add("d-none");

    if (itemFavoritos)
        itemFavoritos.classList.remove("d-none");

    if (itemLogout)
        itemLogout.classList.remove("d-none");

    if (itemCadastro) {

    if (usuarioLogado.admin) {

        itemCadastro.classList.remove("d-none");

    } else {

        itemCadastro.classList.add("d-none");

    }
    console.log("Admin?", usuarioLogado.admin);
}
JSON.parse(sessionStorage.getItem("usuarioLogado"))

}
// Se não estiver logado
else {

    if (itemLogin)
        itemLogin.classList.remove("d-none");

    if (itemFavoritos)
        itemFavoritos.classList.add("d-none");

    if (itemLogout)
        itemLogout.classList.add("d-none");

}

function logout() {

    const confirmar = confirm("Deseja realmente sair?");

    if (!confirmar)
        return;

    sessionStorage.removeItem("usuarioLogado");

    window.location.href = "login.html";

}

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener("click", (event) => {

        event.preventDefault();

        logout();

    });

}