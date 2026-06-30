const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    try {

        const resposta = await fetch(
            `http://localhost:3000/usuarios?email=${email}&senha=${senha}`
        );

        const usuarios = await resposta.json();

        if (usuarios.length === 0) {

            alert("E-mail ou senha inválidos.");
            return;

        }

        sessionStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarios[0])
        );

        window.location.href = "index.html";

    }
    catch (erro) {

        console.error(erro);
        alert("Erro ao conectar ao servidor.");

    }

});